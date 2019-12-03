# CAQL Design and Architecture

This documents describes some of the engineering efforts that went into the creation of the CAQL language.
It also explains design decisions and trade-offs that were made along the way.
This knowledge can help as background to set expectations for use-cases and guide query optimizations for accuracy and performance.

## CAQL is written in lua and C

The main CAQL logic is implemented in lua, with I/O related and performance critical logic implemented in C.

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

## CAQL supports Stream- and Batch-Mode

One of the fundamental design decisions that went into CAQL, was to support two different execution modes:

1. Batch mode -- supports request/reply processing on stored historical data

2. Stream mode -- performs on-line processing on live data streaming into the system

CAQL batch mode is used in IRONdb.
This is the usual processing mode, typically supported by query engines.

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

## Stream-/Batch-Mode are largely Compatible

CAQL batch mode and CAQL stream mode _should_ be compatible in the following sense:

- Create a CAQL check for a given query, and add the resulting CAQL metrics as Search Datapoint to a graph

- Add the same CAQL query as CAQL Datapoint to the same a graph

Both Datapoints should result in the same data for the recent time period where the CAQL check holds data.

This ideal is not fully reached for the following two reasons:

1. Some functions don't make sense in Stream mode, e.g. top(), groupby:sum() and are hence not supported.

2. Approximations in Batch mode. Strictly emulating Stream mode requires processing data in the granularity of the data
  stream (1M). This is extremely slow, when requesting large time windows, like 1 year.  To make CAQL usable on larger
  time slices, we apply a number of optimizations that approximate query result by operating pre-aggregated data.

CAQL in IRONdb supports a Stream-emulation mode, by adding the `#serial` directive to the CAQL query.
This will disable all optimizations and force 1M data processing.

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

## Data Fetching Logic

TODO
- Data Access with per-stored NNT rollups

## Histogram Support

TODO

## Query Federation

TODO

## Clustering caql-broker

- CAQL Broker Clustering

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
