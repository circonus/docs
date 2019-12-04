# CAQL Design and Architecture

When creating CAQL we had the following goals in mind:

- Facilitate aggregation of thousands of metrics in interactive graphs

- Allow deep, customized analysis on individual streams

- Use syntax, that is intuitive for beginners, yet expressive and concise

- Drive analytics alerting rules from CAQL statements

This documents describes some of the engineering decisions and technology choices that we took to realize
these goals.

## Architecture Overview

Here is how CAQL fit's into the overall Circonus architecture:

![](/images/caql/CAQL_architecture_overview.png)

There are two separate components, IRONdb and caql-broker, that are capable of executing CAQL queries.
Those components operate quite differently.

1. IRONdb / Batch mode -- supports request/reply processing on stored historical data

2. caql-broker / Stream mode -- performs on-line processing on live data streaming into the system

Batch mode is the typical execution mode supported by most query languages.

In Stream mode, standing CAQL queries are registered as CAQL checks, and executed over the stream of incoming data.
CAQL checks typically stay active indefinitely.
Outputs for each registered check are produced every minute and emitted to the system as CAQL metrics.
CAQL metrics, in turn, can be used to drive threshold based alerting rules.

The advantage of this dual design is that CAQL alerting rules do not depend on regular database queries.
In other systems, analytics alerting rules are implemented by scheduling database queries to run every few seconds and checking the outputs against a threshold.
This puts a constant load on the database that can be quite significant.

In stream mode, the CAQL query keeps state in memory which is updated as new data arrives.
The state update operation is typically executed within a few micro-seconds.
Hence, by comparison, very little CPU resources are consumed.
On the flip-side, we have to allocate a certain amount of memory for a long time, and keep that state consistent across crashes and updates.

## Stream-/Batch-Mode are almost Compatible

CAQL batch mode and CAQL stream mode strive to be compatible in the following sense:

- Create a CAQL check for a given query

- Add the same CAQL query to a graph

Both cases should result in the same data for the recent time period where the CAQL check holds data.

This ideal is not fully reached for the following two reasons:

1. Some functions don't make sense in Stream mode, e.g. top(), groupby:sum() and are hence not supported.

2. Approximations in Batch mode. When requesting large time slices, a number of optimizations are applied that
   return approximate results which are not guaranteed to be fully compatible with Stream mode.

We have found that strictly emulating Stream mode is prohibitively slow since it requires processing data in the
granularity of the stream (1M). This is a problem when requesting large time windows, like 1 year, where ~500K values
would have to be processed per metric. To make CAQL usable on larger time slices, we have to resort to approximate
results by operating pre-aggregated data.

In cases where full compatibility is required, CAQL supports a Stream-emulation mode, that is enabled by adding the
`#serial` directive to the CAQL query. With `#serial` enabled queries will be a lot slower but fully consistent with
CAQL metrics generated in Stream mode.

## CAQL is written in lua and C

The main CAQL logic is implemented in lua, with I/O related and performance critical logic implemented in C.  Apart from
performance considerations, re-use of existing code, tooling and know-how within the Circonus organization were the main
factors influencing the language choice.

Like many Circonus components,
CAQL leverages [libmtev](http://circonus-labs.github.io/libmtev/) as execution environment.
It comes with an advanced lua-runtime that supports:

- Multiple OS-threads (shared nothing)
- Multiple coroutines per thread (shared lua-state)
- Async/Await-style coroutine coordination
- HTTP(s) 1/2 request handling
- Highly flexible logging and configuration logic
- Built-in instrumentation around lua scheduling and request handling

The lua interpreter itself is [Luajit](https://luajit.org/), which brings high-performance code execution.

In IRONdb, data fetching logic is performed with asynchronous C functions that directly expose C-level arrays into lua,
by leveraging [Luajit/FFI](http://luajit.org/ext_ffi.html).
In this way lua table allocations and manual copying of individual values is entirely avoided.

There are a number of occasions where we leverage C-level functions for manipulating data in CAQL.
This includes, the rollup logic, and histogram operations (e.g. percentiles), at this point this is mainly for consistency.
The mathematical operations are implemented in pure lua, which has proved sufficiently fast for our use-cases.

## Efficient Data Fetching in Batch Mode

In Batch mode a CAQL query is compiled into a tree of objects called processing units.
Each processing unit requests data from it's child nodes.
The results are then merged, processed and passed along.

The data fetching methods support a `period` parameter that allows to control the granularity of the fetched data.
Each processing node requests data of the maximal granularity that is needed to fullfuill the request.

For data sources like `find()` or `metric()` statments, higher granularity data is read directly from pre-computed 
rollups that are available in the database.

Intermediate results are stored as C-level float (or histogram) arrays for maximal memory efficiency and processing speed.
It also allows buffers allocated by the data-fetching layer to be processed in CAQL without additional copy operations.

We have found that memory efficient data structures with managed granularity are essential for interactive 
manipulation of data on time spans longer than a few days.

## Batch Mode Queries are Federated

CAQL on IRONdb uses map-reduce style data fetching framework that allows to federate certain computations out to the cluster.
This framework is directly exposed as [/fetch](https://www.irondb.io/docs/api/fetch.html)-endpoint in IRONdb.
Prime example include, the following processing patterns:

* `find() | stats:sum()` -- select metrics based on a search query and sum the resutlts

* `find:histogram() | histogram:merge()` -- select histogram metrics and merge the results

* `find() | top(10)` -- select the top-10 metrics that match a given search query.

Each of those query patterns is suitable for query fedreation.
Partial results can be calculated on cluster nodes and merged on the node that initiated the request.

CAQL leverages query federation with a query optimization pass.
After the query is parsed, the AST is searched for suitable sub-trees, that allow to be federated.
Those sub-trees are then replaced by an equivalent federated fetching operation.

The main advantage of this approach is the reduction in network bandwith and encoding/parsing overhead.
With this approched, we have seen query execution times dropping from minutes to under 5 seconds.

At the time of this writing, working interactively with queries aggregating ~3000 individual metric is 
feasible on a 10 node IRONdb cluster.

## Query Execution in Stream Mode is State Machine Based

In Stream mode CAQL queries are executed as state machines, that are driven by incoming metric data.

Like in Batch mode, CAQL Queries are compiled into a tree of processing units.
Instead of data fetching operations, processing unit in stream mode use a state update operation, that fetches
single values of data from all child processing units and updates internal state accordingly.
State updates are triggered in regular time intervals (1M), and generate output which is emitted as metric data.

With this design the CPU and IO costs for evaluating CAQL queries are minimal.
There is a modest amount of memory that needs to be allocated while each CAQL query is active.

The main difficulaty with this design is the to maintain the state across faults, restarts and updates.

## Clustering is essential for reliable Stream Processing

- All crashes of caql-broker lead to gaps in metrics
- Re-creating state is tricky, so re-starts will take some time
- Need to cover our backs, and run caql-broker in HA cluster

- Solution: Ernie style heartbeats
- Allows zero-downtime updates
- Gives some headroom for debugging issues we hit in production

## State is Re-created by Replaying Data

There are two strategies for restoring state that has been lost by faults, restarts or updates.

1. State Persistence. Write the state to a persistent medium after each update.

2. Data Replay. Re-apply the state updates starting from the beginning of time.

Both strategies can be mixed, so that state is persisted at only at certain check-points,
and data replays starts at those checkpoints.
In our particular situation, we have access to a persisted version of the data stored in IRONdb,
so the replay solution is a natural path forward.

When a CAQL Stream query is re-initialized a suitable amount of data is fetched from IRONdb,
that replayed to the state machine.
This will perfectly re-create the state for bounded-time queries like `window:sum(1d)` or `delay(1h)`, 
and approximate state for un-bounded queries like `integrate()` or `anomaly_detection()`.

If restart time, or state approximation becomes an issue in the future, we plan to add state-persistence and
check-pointing logic to CAQL. So far this has not been necessary.

## CAQL parser uses a PEG Grammar

CAQL uses a [PEG grammar](http://www.inf.puc-rio.br/~roberto/lpeg/) to parse CAQL queries.
PEG grammars allow the syntax specification to be very concise and comparatively easy to read and maintain.
Also parsing is very fast when compared to recursive descend parsers.

The complete grammar we use today is a mere 42 lines of code and [attached in full](#caqlgrammar) for reference.
There has not been a single issue that could be traced back to bugs in the parser or the grammar.

One disadvantage to hand-written parsers is that the error handling for catching syntax errors is very tricky to get right.

## CAQL syntax is inspired by UNIX tools

The CAQL syntax is inspired by a number of traditional UNIX technologies that might be familiar to the target audience.

- Functions calls look like Python, with key-word arguments:  
  ```window:mean(1h, period=50, offset="US/Eastern")```

- Function composition looks like shell pipes:  
  ```find("*") | stats:sum()```

- Comments look like C++/Java  
  ```1 // just one```

- Whitespace is insignificant

- Complex composition that can't be modeled with pipes is expressed with a second set of brackets: "{...}"

- Argument lists for "{..}" are flattened, like in perl. Thus, the following are equivalent:  
  - ```stats:sum{ pass{1, 2}, pass{3}  }```
  - ```stats:sum{ 1, 2, 3  }.```

These primitives allow us to express a great variety of common processing patterns as one-line statements.
E.g.
```
find:counter("www-*`/`requests") | stats:sum() | window:max(1h)
```

So far there has been little regret about the syntactical choices: It's concise, expressive and readable.
Use feedback has usually been addressable with language tooling and documentation.

# Appendix: CAQL Grammar {#caqlgrammar}

CAQL uses a [PEG grammar](http://www.inf.puc-rio.br/~roberto/lpeg/) to parse CAQL queries.
At the time of this writing (2019-12-02), the CAQL grammar looks as follows:

```
line           <- head expression

head           <- (s directive s)*
directive      <- '#' {| identifier |} [%nl]

expression     <- s op s

-- infix operators in ascending precedence
op              <- pipe
pipe            <- not    ('|'   not)*

not             <- 'not' not_node / or
not_node        <- or
or              <- and   ('or'  and)*
and             <- eq    ('and' eq )*

eq              <- geq   ('=='   geq)?
geq             <- leq   ('>='  leq)?
leq             <- gt    ('<='  gt )?
gt              <- lt    ('>'   lt )?
lt              <- sum   ('<'   sum)?

sum             <- sub   ('+'   sub)*
sub             <- prod  ('-'   prod)*
prod            <- div   ('*'   div)*
div             <- exp   ('/'   exp)?
exp             <- value ('^'   value)?

value           <- s ( literal / function / variable  / negation / inversion / '(' expression ')' ) s

negation        <- '-' expression
inversion       <- '!' expression

variable        <- identifier !":"

function        <- identifier (":" identifier)* args slots?
args            <- "(" s !(s ",") (pargs / s) ("," !(s ")"))? (kwargs / s) ")"
pargs           <- arg_value ("," arg_value)*
kwargs          <- kwpair ("," kwpair)*
kwpair          <- s "=" arg_value
arg_value       <- literal / (!kwpair variable) -- variables look like keys
slots           <- "{"( expression ("," expression)* / s )"}"

literal         <- s (literal_str / literal_dur / literal_nr) s
literal_str     <- "p"?
literal_nr      <- number
literal_dur     <- dur_element ([ ]* dur_element)*)

identifier      <- [a-zA-Z_] [a-zA-Z0-9_]*
number          <- [+-]? [0-9]+ ('.' [0-9]+)?
str             <- ("'" [^']* "'") / ('"' [^"]* '"')
dur_element     <- number dur_unit
dur_unit        <- "ms" / [sMhdw]
s               <- ([ %nl] / comment)* -- whitespace
comment         <- '//' [^%nl]* ([%nl] / !.) -- comments are terminated by new-lines or end of string.
```
