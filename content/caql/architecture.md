# CAQL Design and Architecture

## CAQL comes with Stream- and Batch-Mode

CAQL can be executed in two different modes:

1. Batch mode -- supports request/reply processing on stored historical data

2. Stream mode -- performs on-line processing on live data streaming data into the system

CAQL batch mode is used in IRONdb.
This is the usual processing mode, typically supported by query engines.

CAQL stream mode is used in caql-broker.
In this mode, standing CAQL queries are registered as CAQL checks, and executed over the stream of incoming data.
CAQL checks typically stay active for multiple months.
Outputs for each registered check are produced every minute and emitted to the system as CAQL metrics.
CAQL metrics, in turn, can be used to drive threshold based alerting rules.

The advantage of this dual design is that CAQL alerting rules do not depend on regular database queries.
In other systems, analytics alerting rules are implemented by scheduling database queries to run every few seconds, and checking the outputs against a threshold.
This puts a constant load on the database, that can be quite significant.

In stream mode, the CAQL query keep state in memory which is updated as new data arrives.
The state update operation is typically executed within a few micro-seconds.
Hence, by comparison, very little CPU resources are consumed.
On the flip-side, we have to allocate a certain amount of memory for a long time, and keep that state consistent across crashes and updates.

## CAQL Technology Stack is C/lua based:

The main CAQL logic is implemented in lua, with IO related and performance critical logic implemented in C.

Like all Circonus components, CAQL leverages [libmtev](http://circonus-labs.github.io/libmtev/) as execution environment.
It comes with an advanced lua-runtime that supports:

- Multiple OS-threads (shared nothing)
- Multiple coroutines per thread (shared lua-state)
- Async/Await-style coroutine coordination
- HTTP(s) 1/2 request handling
- Highly flexible logging and configuration logic
- Built-in instrumentation around lua scheduling and request handling

The lua interpreter itself is [Luajit](https://luajit.org/), which brings high-performance code execution.

In IRONdb data fetching logic is performed with asynchronous C functions that directly expose C-level arrays into lua,
by leveraging [Luajit/FFI](http://luajit.org/ext_ffi.html).
In this way lua table allocations and manual copying of individual values is entirely avoided.

In caql-broker the initial parsing and routing of incoming messages is handled in C.
Once a message is determined to carry metric data that is relevant for some registered check, it is passed to the appropriate lua state.

There are a number of occasions where we leverage C-level functions for manipulating data in CAQL.
This includes, Rollup logic, Histogram operations (like calculating percentiles), at this point this is mainly for consistency reasons.
At this point in time, most of the mathematical operations are still implemented in pure lua, which has proved sufficiently fast () for the applications we have been 

## Compatibility between Stream- and Batch-Mode

CAQL batch mode and CAQL stream mode _should_ be compatible in the following sense:

- Create a CAQL check for a given query, and add the resulting CAQL metrics as Search Datapoint to a graph

- Add the same CAQL query as CAQL Datapoint to the same a graph

Then both Datapoints should result in the same data for the recent time period where the CAQL-check holds data.

This ideal is not fully reached for performance reasons:   Strictly emulating Stream mode outputs in batch mode requires
us to always process data a 1M granularity, since this is the interval that caql-broker operates on.  This is extremely
slow. Instead CAQL will leverage pre-aggregated data to speed-up computation in batch mode on.

In order force strict compatibility in Batch mode, add the `#serial` directive to the CAQL query.
This will disable all optimizations and force.

## Parser

CAQL uses a [PEG grammar](http://www.inf.puc-rio.br/~roberto/lpeg/) to parse CAQL queries.
PEG grammars allow the syntax specification to be very concise and comparatively easy to read and maintain.
Also parsing is very fast when compared to recursive descend parsers.

The complete grammar we use today is a mere 42 LOC and [attached in full](#caqlgrammar) for reference.

Early versions of CAQL used the pure lua PEG parser [LuLpeg](https://github.com/pygy/LuLPeg), which turned out to be
quite problematic for our use case. We had multiple issues that crashed the process we were unable to debug.
The C implementation [LPeg](http://www.inf.puc-rio.br/~roberto/lpeg/) has worked extremely well for us.
Since we switched over, we never had any issues that could be traced back to LPeg.

One disadvantage, to hand-written parsers is that error handling is that catching syntax errors is tricky to implement.
This is an area, where CAQL can be improved.

## Syntax

The CAQL syntax is inspired by a number of technologies that should be familiar to the target audience.

- Functions calls look like Python, with key-word arguments:  
  ```window:mean(1h, period=50, offset="US/Eastern")```

- Function composition looks like shell pipes:  
  ```find("*") | stats:sum()```

- Comments look like C++/Java:  
  ```1 // just one```

- Whitespace is insignificant

- Complex composition that can't be modeled with pipes is expressed with a second set of brackets: "{...}"

- Argument lists for "{..}" are flattened, like in perl. Henve, the following are equivalent:
  - ```stats:sum{ pass{1, 2}, pass{3}  }```
  - ```stats:sum{ 1, 2, 3  }.```

These primitives allow us to express a great variety of common processing patterns as one-liners
E.g.
```
find:counter("www-*`/`requests") | stats:sum() | window:max(1h)
```

So far we have little regrets about the syntactical choices: It's concise, expressive and readable.
The complaints we got, were usually addressable with language tooling and documentation.

## Performance Optimizations in Batch Mode

## Query Federation

## Histogram Support

## Clustering caql-broker

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

# Change Log

* 2019-12-02, Initial Version
