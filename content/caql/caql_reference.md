# CAQL Reference Manual {#CAQLReferenceManual}

This manual contains formal description of the CAQL syntax and semantics.
For a tutorial please refer to the [CAQL Overview](https://login.circonus.com/user/docs/CAQL) page.

## Data Flow and Data Structures {#DataFlowandDataStructures}

### Processing Units {#ProcessingUnits}

 * A CAQL statement compiles into a *processing unit* (PU) that is executed over a stream of incoming data.

 * A *stream* is an unbounded list of *values*, that can have one of the following types:
   - *numeric values*, double precision floating point numberos.
   - *histogram values*, consisting of [Circonus histograms](https://login.circonus.com/user/docs/Visualization/Graphs/View/Histograms).
   - *missing value*, signaling missing data.

Streams are *synchronous*, in the sense that for each *(sampling) period*, there is precisely one sample in the stream. If no data was collected for a given period, then a missing value is inserted.

 * A processing units keep an internal state that is updated with each arriving sample.

 * A processing units can have several input streams and but only a single output stream.

![Image: 'PU.png'](/assets/PU.png?raw=true)

 * Multiple processing units can be composed to create a larger processing unit.

![Image: 'PUComposition.png'](/assets/PUComposition.png?raw=true)


### From CAQL Statements to Processing Units {#FromCAQLStatementstoProcessingUnits}

The CAQL language allows the creation, configuration and plumbing of processing units.

 * CAQL functions generate individual processing units.
   - E.g. `is_missing()` yields `1` when a values is missing and `0` if not.

 * Function *arguments* are used to configure the processing unit.
   - E.g. `delay(5M)` will delay a stream by 5 Minutes.
   - E.g. `anomaly_detection(20, model='periodic daily')` This statement will create a processing unit with a single input slot and a single output slot, that computes an anomaly detection method across the stream of data.

 * Processing units can be linearly composed using the *pipe operator* `|`.
   - E.g. `delay(5M) | delay(3M)` plumbs two delay-PU's together, resulting in a total delay of 8 minutes.

 * Function *slots* specify more complex plumbing rules.
   - E.g. `delay(3M){ delay(5M) }` is equivalent to `delay(5M) | delay(3M)`.
   - E.g. `op:sum{ delay(1M), delay(2M), is_missing() }` describes a compound processing unit composed of four-other processing units, with a total of three input streams.
   - We will further discuss slot arguments in the following sections.

 * Sources are processing units that have no inputs.
   - E.g. `metric(uuid, name)` creates a numeric stream from a Circonus metric.
   - Numeric literals give rise to sources:
     - E.g. `5` creates a constant numeric stream with value 5.

## CAQL Syntax {#CAQLSyntax}

### Identifiers {#Identifiers}

Identifiers are syntacitic elements that occure as function and variable names.
Only a reduced set of symbols is allowed in identifiers:

```
identifier <- [a-zA-Z_] [a-zA-Z_0-9]*
```

I.e. identifiers have to start with an alphabethic character or a low-dash, and can contains numbers in the body.
An exmpale of a valid identifier is `my_Identifier_123`.


### Function Definitions {#FunctionDefinitions}

CAQL functions create processing units that are executed across the stream of incoming metrics.
Two different kinds of parameters can be passed to CAQL functions:

 1. *arguments*, that specify properties of the processing unit itself, e.g. the window size.
 2. *slots*, that specify the plumbing of the inputs of the processing unit, e.g. two metrics that should be summed.

The function call sytax is:

```
function <- name '(' args ',' kwargs ')'  '{' slots '}'
```

Where

 - `name` is a list of identifiers separated by a colon (`:`).  We use colons to separate packages like `math:`.
 - `args` is a comma separated list of literals.
 - `kwargs` is a comma separated list of key value pairs: `<kwargs> ::= <key> = <value>, <key> = <value>, ...`  where key is an identifier and value is a literal.
 - `slots` is a comma separated list of CAQL expressions.

One of the blocks `(args, kwargs)` and `{ slots }` can be omitted, but not both.

Here are some examples:

 * `my_function(1)` -- basic function call with parameters
 * `my_package:my_function()` -- with package idenfifier
 * `my_function(1,2,3,key=4, key2="val2")` -- with many arguments
 * `my_function(){ f(), g(), h() }` -- with slots
 * `my_function{ f(), g(), h() }` -- Equivalent with `()` omitted


### String Literals {#StringLiterals}

 * Strings in CAQL are internally represented as sequences of ASCII characters.

 * Strings are delimited by a matching pair of single quotes (`'`) or double quotes (`"`).
```
'this is  a string literal!'
"this is another one."
```

 * [Percent Encoding](https://tools.ietf.org/html/rfc3986#section-2.1) can be used, when prefixing a string with "p". Use this to input exotic metric names.
```
p'This%20is%20a%20percent encoded string!'
```

The formal syntax of string literals reads as follows:

```
string             <- encoding_specifier? ( sq-string / dq-string )
sq-string          <- "'" chars* "'"
dq-string          <- '"' chars* '"'
encoding_specifier <- [p]
```

Currently, all characters with exception of those quotes are allowed within strings.
We only guarantee that alphanumeric characters [/A-Za-z0-9.md](/A-Za-z0-9.md) will be supported in the future.


### Number Literals {#NumberLiterals}

All numbers are internally represented as double precision floating point numbers.

Number literals have the form:

```
number <- [+-]? [0-9]+ ('.' [0-9]+)?
```

Examples inclide `2` and `+0.312`.


### Duration Literals {#DurationLiterals}

CAQL supports a special literal type that descibes time durations.
Internally these duration literals are represented as numbers, which express the duration in seconds.

Warning: The numeric value of a duration literal is considered an implementation detail, and might change in future releases.
If a parameter is specified as duration, do provide a duration literal and not a raw number.
E.g. do use `delay(1h)`, and not `delay(60)`.

Duration literals follow the syntax:

```
duration <- (number unit)+
```

Where `unit` is one of:

 * `s` -- second (limitations apply, see below.)
 * `M` -- minute
 * `h` -- hour
 * `d` -- day
 * `w` -- week


There is no whitespace allowed between the number and the unit.
Whitespace between duration literal elements is allowed, but not required.

Valid examples are include `5M`- 5 minutes, `1d6h` - one day and 6 hours.

Limiation: The minimal duration supported by CAQL is currently 1M. Second durations are silently rounded to the next lower minute.

 * `90s` -- 90 seconds, rounded to 1M

### Boolean Values {#BooleanValues}

There are no special boolean literals in CAQL, truth is represented by 1, false is represented by 0.

The boolean operators `and` and `or` treat all non-zero number values as true.

### Operators {#Operators}

CAQL Support the following operators, ordered in descending precedence:

| Operator | Type          | Definition |
|---|---|---|
| `|`      | associative          |  Pipe operator. Linear comosition of processing units.  |
| `not`    | unary                |  Logical `not`. Returns 1 if the operand is 0 or false. |
| `or`     | associative          |  Logical `or`. Returns 1 if at least one operand is 1, else 0. |
| `and`    | associative          |  Logical `and`. Returns 1 if both operands are 1, else 0. |
| `==`     | binary               |  Numerical comparison. Returns 1 if both operands are equal as floating point numbers. |
| `>=`     | binary               |  Numerical greater than or equals.  |
| `<=`     | binary               |  Numerical less than or equals.  |
| `>`      | binary               |  Numerical grater than  |
| `<`      | binary               |  Numerical less than  |
| `+`      | associative          | Infix operator for addition |
| `-`      | associative          | Infix operator for subtraction |
| `*`      | associative          | Infix operator for multiplication |
| `/`      | associative          | Infix operator for division |
| `^`      | associative          | Infix operator for exponentiation |
| `!`      | unary                |  Like `not` but with high precedence. |

Binary operators requrire precisely two arguments e.g. `A <= B`, where
as associative operators can be used in chains e.g. `A * B * C`.

Parenthesis `(` and `)` can be used to override the natural order of operations.
For example, `A+B/10` is equivalent to `A+(B/10)`.
To achieve a right to left precedence in this example, one would use `(A+B)/10`.


### The Pipe Operator {#ThePipeOperator}

The pipe operator composes processing units in linear order.
It's syntax is lended from the UNIX shell.

As an example take the sequence: `f(10) | g(3) | h(1,2,3)`.
This CAQL statement creates three processing units from the functions `f(10)`,
  `g(3)`, `h(1,2,3)`, that are composed as indicated in the figure below.

![Image: 'Pipe.png'](/assets/Pipe.png?raw=true)


### Advanced composition with slot arguments {#Advancedcompositionwithslotarguments}

To build up more complicated structures, you can use the slot arguments to functions.
Streams passed into the slot arguments are connected as inputs to the processing unit.

![Image: 'MultiInpupts.png'](/assets/MultiInpupts.png?raw=true)

For example, the linear sequence `f(10) | g(3) | h(1,2,3)` could be equivalently expressed as: `h(1,2,3){ g(3){ f(10) } }`

More generally, pipes can always be replaced by first-slot insertion: `A | f(a,b,c,...){B,C,...}` is equivalent to `f(a,b,c,...){A,B,C,...}`.

## Constants {#Constants}

CAQL defines the following constants, which can be used as function arguments (`op:sum(VIEW_PERIOD)`) and placed into slots (`op:sum{A, B, VIEW_PERIOD}`)

* `VIEW_RANGE` the duration of the currently active view range of a graph.
  E.g. if you are looking at two weeks of data, VIEW_RANGE will have a numeric value equal to the `2w` duration literal.
  When used in CAQL checks, the value will be equal to `1M`.
* `VIEW_PERIOD` the "period duration" of the current active view of a graph.
  This is the minimal duration that is visually represented in a graph.
  E.g. if you are looking at one year of data, `VIEW_PERIOD` will be equal to `12h`.
  When used in CAQL checks, the value will be equal to `1M`.

## Directives {#Directives}

CAQL directives allow the user to change the behavior of the CAQL processor.
Directives have to be placed on separate lines at the very beginning of the CAQL query.
The following directives are supported:

* `#preview`. Activates "preview mode".
  This directive applies to graphs only.
  It has no effect on CAQL checks.
  In preview mode the CAQL processor applies additional short-cuts that speed up processing for long range queries but sactifice accuracy of the result.
  Results are still guaranteed to be accurate on view ranges smaller than one day where `VIEW_PERIOD` equals `1M` or lower.

## Function Tables {#FunctionTables}

The following sections give a full list of all available functions in
CAQL.  All functions are specified with their full signature. Optional
arguments are enclosed in `[]`.
Keyword arguments (e.g. `model = 'linear'`) are always optional, and
their default value is listed in the signature.

### Global Functions {#GlobalFunctions}

This package contains all globaly accessible functions.

 * **`anomaly_detection([sensitivity], [model="constant"], [model_period=1440], [prefill_period="auto"])`** - Detects anomalies in the input stream with the specified sensitivity. This method operates on 5M rollups.
   - `sensitivity` - (optional, default:`50`) Valid range: 0 .. 100
   - `model = "constant"` - underlying time-series model. Valid values: constant/trending/periodic/periodic daily/periodic weekly
   - `model_period = 1440` - If model=periodic, set the period interval, as duration literal (e.g. 1d)
   - `prefill_period = "auto"` - The amount of training data to take into consideration before detecting anomalies
 * **`count()`** - Counts the number of non-missing values in input slots.
 * **`delay(t1, t2, ...)`** - Delays the stream by the specified time-duration.
   - `t1, t2, ...` - times to delay stream
 * **`diff()`** - Differentiate a metric. Returns the difference of two consecutive numeric values.
 * **`if()`** -  The if operator takes three slot arguments: `if{cond-slot, then-slot, else-slot}`        For each point in time, if the value of cond-slot is truthy (nonzero) then return then-slot,        else return else-slot. This operator only supports numeric input at this point. 
 * **`integrate()`** - Computes a cumulative sum over the metric. The starting point of the summation is unspecified, and may vary between invocations, of the same statement. 
 * **`is_missing()`** - Sets the value to 1 if the current value is missing, or to 0 if it is not missing.
 * **`label(format[, format2, format3, ...])`** - Label output slots according to format string.  Labels are applied to slots in the order.  Any slots past the available label formats with be formatted using the last argument in the list.  i.e. if a single format argument is provided, it is applied to all streams.
   - `format` - Format label string from metric metadata. Supported parameters: 
     - '%d' -> slot number, 
     - '%n' -> metric name without tags 
     - '%cn' -> canonical metric name with tags 
     - '%t{$tagcat}' -> tagcat:tagvalue 
     - '%tv{$tagcat}' -> tagvalue  
   * Variants: 
     - Use $tagcat = "*" this function will return output for all tags that do not lead with `__` (double underscore)
     - '%-t', '%-tv' will act like '%t', '%tv', but only return output for fields that have variance among all output slots.
   * Examples: 
     - `label("Some static name")` 
     - `histogram:percentile(50,95,99) | label("Median", "95th Percentile", "99th Percentile")`
     - `label("This is output slot %d")` enumerate output slots 
     - `label("%n [%t{*}]")` label with name and tags in brackets 
     - `find("...") | label("%n %t-{*}")` label with name, and all tags that vary among the search results 
 * **`metriccluster(id)`** - Warning: This function is deprecated and will be removed by 2020-01-31. Add metrics in a [metriccluster](https://login.circonus.com/user/docs/Data/View/MetricClusters).
   - `id` - id of metric cluster as (unquoted) integer.
 * **`pass()`** - Identity transformation. Pass through all values. Do not perform any processing.
 * **`tag(t1, t2, ...)` ** - Shorthand for `tag:add(t1, t2, ...)`
 * **`tag:add(t1, t2, ...)`** - Attach tags to all input slots. Do not perform any processing.
   - `t1, t2, ...` - tags to append in the form 'tag:value'
 * **`tag:remove(cat, [val])`** - Remove tag from all input slots.
   - `cat` - tag category to remove tags from
   - `val` - if unset, remove all tags from the given category. If set, only remove tags with the given value.
 * **`top(k, [method="mean"])`** - Return top-k streams over the current VIEW_RANGE. Not supported in CAQL checks.
   - `k` - The number of streams to return
   - `method = "mean"` - The way how streams are compared to each other. Valid values: 'max', 'mean'
 * **`wait(t)`** - Returns 1 if the value has been 1 for a given time duration. Can be used to test alerting rules that specify a 'wait' duration.
   - `t` - time to wait.

### Package `each` {#Packageeach}

The `each` package provides functions that operate on all input slots at once.

 * **`each:add(x)`** - Adds a given amount to all input slots
   - `x` - Amount to add
 * **`each:div(x)`** - Divides all input slots by a given number
   - `x` - Number to divide by
 * **`each:eq(x)`** - Tests is each slot is equal to a given number.
   - `x` - Number to test against
 * **`each:exp(x)`** - Raises all input slots to the power of a given number
   - `x` - Number to raise to
 * **`each:geq(x)`** - Tests is each slot is greater than or equal to a given number.
   - `x` - Number to test against
 * **`each:gt(x)`** - Tests is each slot is greater than a given number.
   - `x` - Number to test against
 * **`each:leq(x)`** - Tests is each slot is less than or equal to a given number.
   - `x` - Number to test against
 * **`each:lt(x)`** - Tests is each slot is less than a given number.
   - `x` - Number to test against
 * **`each:mul(x)`** - Multiplies all input slots by a given number
   - `x` - Number to multiply with
 * **`each:sub(x)`** - Subtracts a given amount from all input slots
   - `x` - Amount to subtract

### Package `fill` {#Packagefill}

Functions filling in missing values

 * **`fill(value)`** - Replace missing values with a given number.
   - `value` - for replacement
 * **`fill:forward()`** - Replace missing value with last non-missing value in the stream.

### Package `find` {#Packagefind}

The `find` package allows you to use tag search from within CAQL.
The full tag search pattern syntax is documented in the section [Metric Search](/SearchingV3.md).
Here are a few examples:

* `find("foo")` will search for all metrics whose name is "foo"
* Globbing: `find("foo*")` will search for metrics whose name starts with "foo"
* Regular expression: `find("/^foo/")` will search for metrics whose name starts with "foo"
* Complex boolean tag search expressions: `find("foo","and(tag:value,or(thing:that,not(i:want)))")`



 * **`find(name pattern, [tag search expression])`** - Shorthand for search:tag:average().
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression
 * **`find:average(name pattern, [tag search expression])`** - Search for metrics of kind  'average' matching a tag pattern pattern.
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression
 * **`find:count(name pattern, [tag search expression])`** - Search for metrics of kind  'count' matching a tag pattern pattern.
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression
 * **`find:counter(name pattern, [tag search expression])`** - Search for metrics of kind  'counter' matching a tag pattern pattern.
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression
 * **`find:counter_stddev(name pattern, [tag search expression])`** - Search for metrics of kind  'counter_stddev' matching a tag pattern pattern.
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression
 * **`find:derivative(name pattern, [tag search expression])`** - Search for metrics of kind  'derivative' matching a tag pattern pattern.
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression
 * **`find:derivative_stddev(name pattern, [tag search expression])`** - Search for metrics of kind  'derivative_stddev' matching a tag pattern pattern.
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression
 * **`find:histogram(name pattern, [tag search expression])`** - Search for metrics of kind  'histogram' matching a tag pattern pattern.
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression
 * **`find:histogram_cum(name pattern, [tag search expression])`** - Search for metrics of kind  'histogram_cum' matching a tag pattern pattern.
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression
 * **`find:stddev(name pattern, [tag search expression])`** - Search for metrics of kind  'stddev' matching a tag pattern pattern.
   - `name pattern` - search for metrics which match this tag search pattern
   - `tag search expression` - (optional) search for metrics which match this tag search expression

### Package `forecasting` {#Packageforecasting}

This package provides functions, that allow to project time series into the future.

 * **`forecasting:dewma(alpha, beta, [fill=1], [forecast_duration=0])`** - Double exponentially weighted moving average.
   - `alpha` - decay parameter, in `[0,1]`.
   - `beta` - decay parameter slope, in `[0,1]`.
   - `fill = 1` - fill in missing values with forecast (fill=1). If fill=2, then only missing values will be replaced by the forecast. Non-missing values will be passed through.
   - `forecast_duration = 0` - return values forecasted by this duration to the future.
 * **`forecasting:ewma(alpha, [fill=1])`** - Exponentially weighted moving average.
   - `alpha` - decay parameter, in `[0,1]`.
   - `fill = 1` - fill in missing values with forecast (fill=1). If fill=2, then only missing values will be replaced by the forecast. Non-missing values will be passed through.
 * **`forecasting:holt_winters(alpha, beta, gamma, [forecast_duration=0], [fill=1], [period=1440])`** - Holt-Winters triple exponential weighted moving average.
   - `alpha` - decay parameter, in `[0,1]`.
   - `beta` - decay parameter for slope, in `[0,1]`.
   - `gamma` - decay parameter for period, in `[0,1]`.
   - `forecast_duration = 0` - return values forecasted by this duration to the future.
   - `fill = 1` - fill in missing values with forecast (fill=1). If fill=2, then only missing values will be replaced by the forecast. Non-missing values will be passed through.
   - `period = 1440` - duration of period. Default 1d
 * **`forecasting:regression(forecast_duration, [model_duration], [step=?], [model="linear"])`** - Forecast values, by fitting a regression line.
   - `forecast_duration` - target duration to forecast into the future
   - `model_duration` - (optional, default:`10`) duration of time to base the model on
   - `step = ?` - specify interval, to recompute regression. Default = `model_duration`.
   - `model = "linear"` - linear/exp
 * **`forecasting:slope(forecast_duration, [model_duration], [step=1], [model="linear"])`** - Forecast values, by fitting a line through two points.
   - `forecast_duration` - target duration to forecast into the future.
   - `model_duration` - (optional, default:`10`) duration of time to base model on.
   - `step = 1` - specify interval to recompute fitting-line.
   - `model = "linear"` - linear/exp

### Package `group_by` {#Packagegroupby}

Warning: This package is in alpha phase. The semantics might change without warning.

Warning: This package only works with metrics that were returned by find().

Warning: This package is not supported with caql-checks.

The `group_by` package allows you to aggregate metrics by tags.



 * **`group_by:count(tag)`** - Aggregate (count) metrics by tag
   - `tag` - tag to group by
 * **`group_by:max(tag)`** - Aggregate (max) metrics by tag
   - `tag` - tag to group by
 * **`group_by:mean(tag)`** - Aggregate (mean) metrics by tag
   - `tag` - tag to group by
 * **`group_by:min(tag)`** - Aggregate (min) metrics by tag
   - `tag` - tag to group by
 * **`group_by:sum(tag)`** - Aggregate (sum) metrics by tag
   - `tag` - tag to group by

### Package `histogram` {#Packagehistogram}

The histogram package includes the functions that operate on histograms.

 * **`histogram:IQR([range])`** - Calculates the Interquartile Range (i.e. 75-percentile - 25-percentile) of the histogram.
   - `range` - (optional, default:`50`) Distance between quantiles to compute. I.e. `IQR(x)` contains x% of all samples. Valid range 0..100
 * **`histogram()`** - Creates histograms from numeric data metrics provided as slot arguments e.g. `histogram:create{A,B}`.
 * **`histogram:count()`** - Calculate the number of values represetned by the histogram per minute.
 * **`histogram:count_above(t1, t2, ...)`** - Calculates the number of samples in buckets entirely above the given threshold values.
   - `t1, t2, ...` - threshold values, inclusive (x >= t)
 * **`histogram:count_below(t1, t2, ...)`** - Calculates the number of samples in buckets entirely below the given threshold values.
   - `t1, t2, ...` - threshold values, inclusive (x <= t)
 * **`histogram:count_bucket(t1, t2, ...)`** - Calculates the number of samples in the same bucket as the provided values.
   - `t1, t2, ...` - bucket values
 * **`histogram:create()`** - Creates histograms from numeric data metrics provided as slot arguments e.g. `histogram:create{A,B}`.
 * **`histogram:inverse_percentile(t1, t2, ...)`** - Calculates the ratio of samples below the given threshold values.
   - `t1, t2, ...` - threshold values, exclusive (x < t)
 * **`histogram:max()`** - Calculates the maximum of all values contained in the histogram.
 * **`histogram:mean()`** - Calculates the arithmetic mean of the histogram.
 * **`histogram:median()`** - Calculates the median of the histogram, i.e. the 50th percentile.
 * **`histogram:merge()`** - Merges all histograms provided as slot arguments e.g. `histogram:merge{A,B}`.
 * **`histogram:min()`** - Calculates the minimum of all values contained in the histogram.
 * **`histogram:percentile(p1, p2, ...)`** - Calculates the given percentiles over a stream of histograms.
   - `p1, p2, ...` - percentiles to compute. Valid range: 0 .. 100
 * **`histogram:rate()`** - Calculates the number of values represented by the histogram per second. This equals `histogram:count() / 60`
 * **`histogram:rolling(window_duration)`** - Aggregate a stream of histograms across a rolling window of given size
   - `window_duration` - duration of the time window.
 * **`histogram:stddev()`** - Calculates the standard deviation of the histogram.
 * **`histogram:sum()`** - Calculates the sum of all samples in the histogram.
 * **`histogram:window(window_duration)`** - Aggregates a stream of histograms to a new histogram of given window size
   - `window_duration` - duration of the time window.

### Package `math` {#Packagemath}

The `math` package provides basic mathematical functions.

 * **`math:abs()`** - Calculate absolute value of the current value. Missing values are passed through.
 * **`math:e()`** - Produces the value `e`, Eulers constant
 * **`math:exp()`** - Raises E to the power of the preceding value. Missing values are passed through. Missing values are passed through.
 * **`math:floor()`** - Round a numeric value to the next lower integer. Missing values are passed through.
 * **`math:ln()`** - Calculate the logarithm to the basis e (Euler's constant).
 * **`math:log([base])`** - Calculates the natural logarithm of the preceding with respect to the given base base. Missing values are passed through.
   - `base` - (optional, default:`10`) basis of logarithm
 * **`math:log10()`** - Calculate the logarithm to basis 10.
 * **`math:pi()`** - Produces the value Pi, the area of a unit circle.
 * **`math:pow(exponent)`** - Raises the current value to the power of exponent. Missing values are passed through.
   - `exponent` - of power function.

### Package `metric` {#Packagemetric}

 The metric package gives you access to metric data with various kinds, i.e. windowing functions.
See [DataTypes](https://login.circonus.com/user/docs/Data/Overview#DataTypes) for
details about windowing functions. 

 * **`metric(check_uuid, metric_name)`** - Feed metric data into CAQL processor, using the 'average' windowing function.
   - `check_uuid` - uuid of the check the metric belongs to.
   - `metric_name` - name of the metric within the check.
 * **`metric:average(check_uuid, metric_name)`** - The average of the observed samples in the one window period.
 * **`metric:count(check_uuid, metric_name)`** - The numer of samples observed in the window period.
 * **`metric:counter(check_uuid, metric_name)`** - The first order derivative ignoring decreases in sample value in the one window period.
 * **`metric:counter_stddev(check_uuid, metric_name)`** - The standard deviation of the counter (i.e., the positive rate of change) of the metric.
 * **`metric:derivative(check_uuid, metric_name)`** - The rate of change (per second) of the observed samples in the one window period.
 * **`metric:derivative_stddev(check_uuid, metric_name)`** - The standard deviation of the derivative (i.e., the rate of change) of the metric.
 * **`metric:histogram(check_uuid, metric_name)`** - Observed samples observed in the window period as histogram.
 * **`metric:histogram_cum(check_uuid, metric_name)`** - Observed samples observed in the window period as histogram from a cumulative histogram source.
 * **`metric:stddev(check_uuid, metric_name)`** - The standard deviation of the observed samples in the one window period.

### Package `op` {#Packageop}

This package contains function-versions of all CAQL
operators. Binary operators expect the input streams to be passed in
the input slots (e.g. `op:eq{A,B}` will return 1 whenever the values
of stream `A` an `B` are equal.). Optionally the second input stream
can be replace by a constant that is passed as a function argument
(e.g. `op:leq(5)` will return 1 whenever the input stream is less than
5). The operator naming is lended from the unix `test` command.

All operators will return missing data if one of the slot arguments.
Use the `stats:*` methods if you want to ignore missing data.


 * **`op:and()`** - Operator `and`. Returns 0 if one argument is 0; else 1.
 * **`op:div([B])`** - Operator `/`. Returns quotient of the first slot by the product of all remaining slots.
   - `B` - (optional) constant value that replaces the second slot.
 * **`op:eq([B])`** - Operator `==`. Test if slot one equal to slot two.
   - `B` - (optional) constant value that replaces the second slot.
 * **`op:exp([B])`** - Operator `^`. Returns slot one raised the power of slot two.
   - `B` - (optional) constant value that replaces the second slot.
 * **`op:geq([B])`** - Operator `>=`. Test if slot one is larger than or equal to slot two.
   - `B` - (optional) constant value that replaces the second slot.
 * **`op:gt([B])`** - Operator `>`. Test if slot one is less than or equal to slot two.
   - `B` - (optional) constant value that replaces the second slot.
 * **`op:leq([B])`** - Operator `<=`. Test if slot one is less than or equal to slot two.
   - `B` - (optional) constant value that replaces the second slot.
 * **`op:lt([B])`** - Operator `<`. Test if slot one is less than or equal to slot two.
   - `B` - (optional) constant value that replaces the second slot.
 * **`op:neg()`** - Operator `-`. Unary Negation. Returns current value times -1.
 * **`op:not()`** - Operator `!` and `not`. Returns the boolean negation of the current value.
 * **`op:or()`** - Operator `or`. Returns 1 if one argument is a non-zero number, else 0.
 * **`op:prod([B])`** - Operator `*`. Returns product of all slots.
   - `B` - (optional) constant value that replaces the second slot.
 * **`op:sub([B])`** - Operator `-`. Returns the value of the first slot minus the sum of all remaining slots.
   - `B` - (optional) constant value that replaces the second slot.
 * **`op:sum([B])`** - Operator `+`. Returns sum of all input slots.
   - `B` - (optional) constant value that replaces the second slot.

### Package `outlier` {#Packageoutlier}

Functions for identifying outlying metrics.

 * **`outlier:cluster_score([normalize=0])`** - Takes in multiple streams and computes an outlier score for each of the input metrics.  Example: `outlier:cluster_score(search:metric("db`*`request_rate"))`. This statement takes in the request rates of several nodes in a db cluster and outputs the outlier score for all of those nodes.
   - `normalize = 0` - normalize output a deviation measure (1) or a mean measure (2).
 * **`outlier:count([sensitivity=50])`** - Counts the number of outliers as displayed in the Outlier Report for a given point in time
   - `sensitivity = 50` - Sensitivity to outliers. Valid values (less outliers) 0 .. 100 (more outliers)
 * **`outlier:normal_range([sensitivity=50])`** - Normal range as displayed in the Outlier Report.
   - `sensitivity = 50` - Sensitivity to outliers. Valid values (large ranges) 0 .. 100 (small ranges)
 * **`outlier:std_score([trim=0], [show_model=0], [normalize=0])`** - Compute the standard-score of the first slot argument, within context of all remaining slots.  The standard-score is defined the normalized distance of current value to the mean value to the normalized context:  $ std_score(y,c_1,...,c_N) = \frac{y - mean(c_1,...,c_N)}{ NORM } $  The parameter `normalize` allows several choices of the normalization. 
   - `trim = 0` - remove the N lowest and N highest values from the context values.
   - `show_model = 0` - output the mean value of the context instead of the outlier score model. 0/1
   - `normalize = 0` - normalize output by a deviation measure (1) or a mean measure (2). Setting normalized=0 disables normalization.

### Package `rolling` {#Packagerolling}

The rolling package includes functions that operate on rolling
windows. These functions are similar to those in the window
package.

 * **`rolling:count(window_duration)`** - The number of non-missing values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`rolling:histogram(window_duration)`** - Returns a historam of all the values contained in the specified time window.
   - `window_duration` - duration of the time window.
 * **`rolling:inverse_percentile(window_duration, threshold)`** - Calculates the inverse percentile, the percentage of values below a threshold value, over the specified time window.
   - `window_duration` - duration of the time window.
   - `threshold` - threshold for values (exclusive).
 * **`rolling:max(window_duration)`** - The maximum of the values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`rolling:mean(window_duration)`** - The arithmetic mean of the values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`rolling:min(window_duration)`** - The minimum of the values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`rolling:percentile(window_duration, percentile)`** - Calculates the percentile of values over the specified time window
   - `window_duration` - duration of the time window.
   - `percentile` - the percentile to calculate. Valid range: 0 .. 100
 * **`rolling:stddev(window_duration)`** - The (uncorrected) standard deviation of the values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`rolling:sum(window_duration)`** - The sum of the values over the specified time window.
   - `window_duration` - duration of the time window.

### Package `search` {#Packagesearch}

Warning: This package is deprecated. Use functions in find:* instead.

The `search` package allows you to use [Circonus metric search facilities](https://login.circonus.com/user/docs/SearchingV2) from within CAQL.

 * **`search:metric(pattern)`** - (deprecated) Shorthand for search:metric:average().
 * **`search:metric:average(pattern)`** - (deprecated) Search for metrics matching pattern of type 'average'.
 * **`search:metric:count(pattern)`** - (deprecated) Search for metrics matching pattern of type 'count'.
 * **`search:metric:counter(pattern)`** - (deprecated) Search for metrics matching pattern of type 'counter'.
 * **`search:metric:counter_stddev(pattern)`** - (deprecated) Search for metrics matching pattern of type 'counter_stddev'.
 * **`search:metric:derivative(pattern)`** - (deprecated) Search for metrics matching pattern of type 'derivative'.
 * **`search:metric:derivative_stddev(pattern)`** - (deprecated) Search for metrics matching pattern of type 'derivative_stddev'.
 * **`search:metric:histogram(pattern)`** - (deprecated) Search for metrics matching pattern of type 'histogram'.
 * **`search:metric:stddev(pattern)`** - (deprecated) Search for metrics matching pattern of type 'stddev'.

### Package `stats` {#Packagestats}

Functions in these package operate on all slot arguments at the same time.

All functions in this package ignore missing values. For example use
`metriccluter(?) | stats:mean()` to get the mean value of all
available values in a metric cluster.


 * **`stats:div([B])`** - Returns quotient of the first slot by the product of all remaining slots. Missing values are treated as 1.
   - `B` - (optional) constant value that replaces the second slot.
 * **`stats:max([B])`** - Return the maximum of all input values.
   - `B` - (optional) optional number, that is included in max calculation. Use for e.g. `stats:max(0)`
 * **`stats:mean()`** - Return the mean of all input values.
 * **`stats:min([B])`** - Return the minimum of all input values.
   - `B` - (optional) optional number, that is included in min calculation. Use for e.g. `stats:min(100)`
 * **`stats:percentile(p1, p2, ...)`** - Calculates the given percentiles of all input values using histograms.
   - `p1, p2, ...` - percentiles to compute. Valid range: 0 .. 100
 * **`stats:prod([B])`** - Returns product of all slots. Missing values are treated as 1
   - `B` - (optional) constant value that replaces the second slot.
 * **`stats:select(n)`** - Select a specific slot.
   - `n` - slot to select
 * **`stats:sub([B])`** - Returns the value of the first slot minus the sum of all remaining slots. Missing values are treated as 0.
   - `B` - (optional) constant value that replaces the second slot.
 * **`stats:sum([B])`** - Returns sum of all input slots. Missing values are treated like 0.
   - `B` - (optional) constant value that replaces the second slot.
 * **`stats:trim(n)`** - Discard samples at high and low end.
   - `n` - number of samples to discard.

### Package `time` {#Packagetime}

Functions that tell the time

 * **`time:epoch()`** - Returns the current UNIX epoch in seconds
 * **`time:tz(timezone, field)`** - Timezone calculations
   - `timezone` - E.g. "UTC", "US/Eastern", "Europe/Berlin"
   - `field` - Field to compute. Valid fileds are: second, minute, hour, monthday, month, weekday, yearday, year

### Package `window` {#Packagewindow}

The `window` package includes functions that operate values aggregated
over moving time windows. This package is similar to the `rolling`
package, but the functions operate on the the most recent fully
completed window instead of rolling windows.

 * **`window:count(window_duration)`** - The number of non-missing values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`window:histogram(window_duration)`** - Returns a historam of all the values contained in the specified time window.
   - `window_duration` - duration of the time window.
 * **`window:inverse_percentile(window_duration, threshold)`** - Calculates the inverse percentile over the specified time window.
   - `window_duration` - duration of the time window.
   - `threshold` - threshold for values (exclusive).
 * **`window:max(window_duration)`** - The maximum of the values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`window:mean(window_duration)`** - The arithmetic mean of the values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`window:min(window_duration)`** - The minimum of the values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`window:percentile(window_duration, percentile)`** - Calculates the percentile of values over the specified time window
   - `window_duration` - duration of the time window.
   - `percentile` - the percentile to calculate. Valid range: 0 .. 100
 * **`window:stddev(window_duration)`** - The (uncorrected) standard deviation of the values over the specified time window.
   - `window_duration` - duration of the time window.
 * **`window:sum(window_duration)`** - The sum of the values over the specified time window.
   - `window_duration` - duration of the time window.


