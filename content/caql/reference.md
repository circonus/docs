---
title: Reference Manual
weight: 40
---

# CAQL Reference Manual

This manual contains formal description of the CAQL syntax and semantics.
For a tutorial please refer to the [CAQL Getting Started](/caql/getting-started/) page.

## CAQL Data Flow and Data Structures

CAQL is a stream processing language, that allows the user to create complex transformations of metric data.

A CAQL *stream* is time-indexed list of *values*, that can have one of the following types:
- *numeric values*, double precision floating point numbers
- *histogram values*, consisting of [histograms](/circonus/visualizations/graphs/histograms/).

Streams are *synchronous*, in the sense that for each sampling period of 1M, there is precisely one value.
If no data was collected for a given period, then a *NULL value* representing missing data is inserted.

Streams carry meta-data, including:
- A *label*, which is used for the graph legend
- A set of *tags*, that is used by functions like [group_by](#package-group_by)

Each Circonus metric gives rise to a stream of values.
Unlike metrics, CAQL streams are not persisted and have a simplified data model.
[CAQL-checks](/circonus/checks/check-types/caql-check/) can be used, to create a metric from a CAQL stream.

A CAQL statement consists of one or more functions that can be composed in different ways.
Functions can have multiple input and output streams.
The precise semantics of CAQL functions and streams are will be explained in the following paragraphs.

**Example:**

To get an idea of the syntax, consider the following CAQL statement:

```
( find("req_error") | stats:sum() ) / 
( find("req_total") | stats:sum() )
```

This statement gives rise to the following data-flow graph:

![](/images/caql/CAQL_Dataflow_Example.png)

In the first row, the `find("req_error")` function selects data from all metrics with name "req_error", the resulting streams are "piped" into the `stats:sum()` function, which sums data from all input streams.
Similarly the second row computes the sum of all metrics with name "req_total".
Finally the "/" operator, represented by the function "op:div()", divides the first sum, by the second sum, to get ratio of failed requests.

## Syntax

CAQL supports the following syntactical constructs:

### Function Invocations

CAQL functions take two different kinds of parameters as input:

 1. *arguments*, that specify parameters of function itself, e.g. the window size.
 2. *sources*, that specify the plumbing of input streams

The function call sytax is:

```
function <- name '(' args ',' kwargs ')'  '{' sources '}'
```

Where

 - `name` is the function name, including package separator (`:`), e.g. `math:exp`.
 - `args` is a comma separated list of literals.
 - `kwargs` is a comma separated list of key value pairs, like `period=60s, method="sum"`, where key is a name, and value is a literal.
 - `sources` is a comma separated list of CAQL expressions.

One of the blocks `(args, kwargs)` and `{ sources }` can be omitted, but not both.

**Examples:**

 * `A(1)` -- Function invocation with a single argument
 * `A(1,2,3, key=4, key2="val2")` -- Function invocation with multiple arguments
 * `package:A()` -- Function invocation from a package
 * `C(){ A(), B() }` -- Function invocation with source functions
 * `C{ A(), B() }` -- Equivalent, with `()` omitted.

The semantics of the source parameters is explained in the section [input sources](#composition-with-input-sources) below.

> **Note:** Most CAQL statements occurring in practice do not use source parameters, only arguments.
> Hence a typical function call, looks like `A()`.

### String Literals

String literals are delimited by a matching pair of single quotes (`'`) or double quotes (`"`).
```
'this is  a string literal!'
"this is another one."
```

Strings in CAQL hold sequences of ASCII characters.

> **Note:** Allowed characters within a (plain) string include alphanumeric characters `[A-Za-z0-9]`, as well as the special characters `[ _]`.
> If you want to represent other ASCII characters in a string, you should percent encode the string, as explained in the next section.

* [Percent Encoding](https://tools.ietf.org/html/rfc3986#section-2.1) (aka. "url encoding") can be used to input arbitrary ASCII strings. Percent encoded string literals look like plain string literals prefixed string with a "p" character.
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

### Number Literals

All numbers are internally represented as double precision floating point numbers.

Number literals have the form:

```
number <- [+-]? [0-9]+ ('.' [0-9]+)?
```

Examples inclide `2` and `+0.312`.

### Duration Literals

CAQL supports a special literal type that descibes time durations.
Internally these duration literals are represented as numbers, which express the duration in minutes.

> **Warning:** The numeric value of a duration literal is considered an implementation detail, and might change in future releases.
> If a parameter is specified as duration, do provide a duration literal and not a raw number.
> E.g. do use `delay(1h)`, and not `delay(60)`.

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

The characters are consistent with those of the C function [strftime(3)](http://man7.org/linux/man-pages/man3/strftime.3.html).
There is no whitespace allowed between the number and the unit.
Whitespace between duration literal elements is allowed, but not required.

Valid examples are include:
- `5M` -- 5 minutes,
- `1d 6h` -- one day and 6 hours.

> **Note:** The minimal duration supported by CAQL is 1M.
> Smaller durations are rounded to the next lower minute.
> E.g. `90s` is rounded to `1M`.

### Boolean Values

There are no special boolean literals in CAQL, truth is represented by `1`, false is represented by `0`.

The boolean operators `and` and `or` treat all non-zero number values as true.

### Operators

CAQL Support the following operators, ordered in descending precedence:

| Operator | Type          | Definition |
|---|---|---|
| &verbar;   | associative          |  Pipe operator. Linear comosition of CAQL functions.  |
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

Each operator has a corresponding function in the [`op` package](#package-op).

### The Pipe Operator

The pipe operator composes CAQL functions in linear order. The syntax is inspired from the UNIX shell.
The CAQL statement
```
A() | B() | C()
```
gives rise to a data-flow graph, where all outputs of function `A`, are used as input for function `B`,
and all outputs of function `B`, are used as inputs of function `C`:

![](/images/caql/CAQL_Pipe.png)

More general composition patterns can be realized using source arguments, as explained in the next section.

### Composition with Input Sources

To build up more complicated structures, you can define multiple sources to CAQL function.
The input sources of a CAQL function `A` are defined with curly brackets, like so: `A(){ ... }`.
The CAQL statement
```
C(){ A(), B() }
```
gives rise to a data-flow graph, where the input of function `C()` are a flat, concatenated list consisting of
all outputs of function A() and then those of function B(), as illustrated in the following figure:

![](/images/caql/CAQL_Compose.png)

> **Note:** The pipe operator, can always be replaced by first-source insertion.
> The statement, `A | X(){B,C,...}` is equivalent to `X(){A,B,C,...}`.

## Constants

CAQL defines the following constants, which can be used as function arguments (`op:sum(VIEW_PERIOD)`) and sources
 (`op:sum{A, B, VIEW_PERIOD}`)

* `VIEW_RANGE` the duration of the currently active view range of a graph.
  E.g. if you are looking at two weeks of data, VIEW_RANGE will have a numeric value equal to the `2w` duration literal.
  When used in CAQL checks, the value will be equal to `1M`.
* `VIEW_PERIOD` the "period duration" of the current active view of a graph.
  This is the minimal duration that is visually represented in a graph.
  E.g. if you are looking at one year of data, `VIEW_PERIOD` will be equal to `12h`.
  When used in CAQL checks, the value will be equal to `1M`.

## Directives

CAQL directives allow the user to change the behavior of the CAQL processor.
Directives have to be placed on separate lines at the very beginning of the CAQL query.
The following directives are supported:

* `#preview`. Activates "preview mode".
  In preview mode the CAQL processor applies additional short-cuts that speed up processing for long range queries but sactifice accuracy of the result.
  Results are still guaranteed to be accurate on view ranges smaller than one day where `VIEW_PERIOD` equals `1M` or lower.
  This directive applies to graphs only.

* `#serial`. Activates "serial" processing.
  When this directive is set, the CAQL processor emulates CAQL checks and processes data serially one sample at a time.
  No optimizations or approximations are applied.
  Only functions that are supported for serial processing in CAQL checks are allowed.
  This directive applies to graphs only.

## Function Tables

The following sections give a full list of all available functions in CAQL.  All functions are specified with their full
signature. Optional arguments are enclosed in `[]`.  Keyword arguments (e.g. `model = 'linear'`) are always optional,
and their default value is listed in the signature.

### Global Functions

This package contains all globaly accessible functions.

 * **`count()`** - Counts the number of non-missing values across all input streams.

 * **`is_missing()`** - Returns a value to 1 if the current value is missing, or to 0 if it is not missing on each input
   stream.

 * **`delay(t1, t2, ...)`** - Delays the stream by the specified time-duration.
   - `t1, t2, ...` - times to delay stream

 * **`diff()`** - Differentiate a metric. Returns the difference of two consecutive numeric values.

* **`pass()`** - Identity transformation. Does not perform any processing.

* **`if()`** -  The `if` operator takes three source parameters: `if{cond-stream, then-stream, else-stream}`
  For each point in time, if the value of `cond-stream` is truthy (nonzero) then return a value from the `then-stream`, else return the a value from the `else-stream`. 
  This operator only supports numeric inputs.

* **`wait(t)`** _(Experimental)_ - Returns 1 if the value has been 1 for a given time duration. Can be used to test alerting rules that specify a 'wait' duration.
   - `t` - time to wait.

* **`anomaly_detection([sensitivity], [model="constant"], [model_period=1440], [prefill_period="auto"])`** - Detects anomalies in the input stream with the specified sensitivity. This method operates on 5M rollups.
  - `sensitivity` - (optional, default:`50`) Valid range: 0 .. 100
  - `model = "constant"` - underlying time-series model. Valid values: constant/trending/periodic/periodic daily/periodic weekly
  - `model_period = 1440` - If model=periodic, set the period interval, as duration literal (e.g. 1d)
  - `prefill_period = "auto"` - Duration literal or the string "auto". The amount of training data to take into consideration before detecting anomalies.

* **`metriccluster(id)`** (_Deprecated_. Use find() instead.) - Add metrics in a [metriccluster](/circonus/metrics/metric-clusters/).
  - `id` - id of metric cluster as integer.

#### top-k

* **`top(k, [method="mean"])`** - Return top-k streams over the current VIEW_RANGE. 
  Not supported in #serial mode / CAQL checks.
   - `k` - The number of streams to return
   - `method = "mean"` - The way how streams are compared to each other. Valid values: 'max', 'mean'

**Examples:**

- Show the 10 web nodes with the highest CPU utilization:  
  ```find("cpu_util", "and(service:web)") | top(10) ```

- Show the 10 accounts with the highest request counts:  
  ```find("request_count") | top(10) ```  
  This is assuming we have per-account request_count metrics available.

#### Labels

All output streams of CAQL statements carry a label.
Labels will be shown in graph legends, and can be used to name metrics in caql-checks.
CAQL tries to attach sensible labels by default, that convey information about the computation that led to the particular output.
You can manually control the label by using the `label()` function.

 * **`label(format[, format2, format3, ...])`** - Label output streams according to the provided format strings.
   Labels are applied to the input streams in the order.
   Any remaining input streams, past the number of available labels, will be formatted using the last label.
   In particular, if only a single format argument is provided, it is applied to all streams.
   - `format` - Format string. The syntax is explained in the next section.

**Format Syntax:**

Format strings are interpolated similarly to printf().
Supported parameters are:

- `%d` -> stream number
- `%n` -> metric name without tags, e.g. `duration`
- `%cn` -> canonical metric name (with tags), e.g. `duration|ST[dc:us/east]`
- `%t{$tagcat}` -> tagcat:tagvalue, e.g. `%t{dc}` -> `dc:us/east`
- `%tv{$tagcat}` -> tagvalue, e.g. `%tv{dc}` -> `us/east`

* Variants: 
  - With `$tagcat` = `*` this function will return output for all tags that do not lead with `__` (double underscore).
  - `%-t`, `%-tv` will act like `%t`, `%tv`, but only return output for fields that have vary among all output streams.
    This will suppress tags that are the same for all return streams, so that tag differences clearly stand-out the to a viewer.

**Examples:**

- Relabel a single metric:  
  ```metric(<uuid>,<name>) | label("Some static name")```

- Annotate histogram Percentiles:  
  ```histogram:percentile(50,95,99) | label("Median", "95th Percentile", "99th Percentile")```

- Enumerate output streams:  
  ```find("...") | label("This is output stream %d")```

- Label with name, and comma separated list of tags in brackets:  
  ```find("...") | label("%n [%t{*}]")```

- Label with name, and all tags that vary among the search results:   
  ```find("...") | label("%n %t-{*}")```
  
### Package `find`

The `find` package contains the main functions that should be used to retrieve data.
It enables searching for metrics based on metric names and tags.
The full search query syntax is documented in the section [Metric Search](/circonus/search/).

The main function in this package is:

* **`find(name_pattern, [tag_query], [limit=1000])`** - Search for metrics matching the provided search queries.
  - `name_pattern` - search for metrics whose name matches the provided pattern
  - `tag_query` - (optional) provide an additional search query expression that has to be matched.
  - `limit = 1000` - Maximal number of search results to return. The maximal allowable limit setting is 3000.

> **Note**: The numer of search results returned by find() is limited by default to 1000 results.
> If that limit is reached, a warning message will be showon on graphs.
> You can increase that limit up to 3000 by providing a limit parameter.
> Pleas contact support if you need process more search results at a time.

> **Note**: 
> The name of a metric can be referred to inside of a tag search query as `__name` tag.
> This is useful for excluding a sub-pattern of the name that might normally be matched.

**Examples:**

- Search for metrics whose name is "foo":  
  ```find("foo")```
- Globing: Search for metrics whose name starts with "foo":  
  ```find("foo*")```
- Search for metrics whose name matches a regular expression:  
  ```find("/^foo/")```
- Search for metrics that match a complex boolean tag search expressions:  
  ```find("foo","and(tag:value,or(thing:that,not(i:want)))")```

This package contains the following function, which allow `find()` to select different [DataTypes](/circonus/data-model/#data-types), like "counters" or "histograms":
  
 * **`find(name_pattern, [tag_query])`** - This is an alias for find:average().
 * **`find:count(name_pattern, [tag_query])`** - Return data kind "count" for the matching metrics.
 * **`find:average(name_pattern, [tag_query])`** - Return data kind "average" for the matching metrics.
 * **`find:stddev(name_pattern, [tag_query])`** - Return data kind "stddev" for the matching metrics.
 * **`find:counter(name_pattern, [tag_query])`** - Return data kind "counter" for the matching metrics.
 * **`find:counter_stddev(name_pattern, [tag_query])`** - Return data kind "counter_stddev" for the matching metrics.
 * **`find:derivative(name_pattern, [tag_query])`** - Return data kind "derivative" for the matching metrics.
 * **`find:derivative_stddev(name_pattern, [tag_query])`** - Return data kind "derivative_stddev" for the matching
   metrics.
 * **`find:histogram(name_pattern, [tag_query])`** - Return matching metrics of type histogram.
 * **`find:histogram_cum(name_pattern, [tag_query])`** - Return matching metrics of type histogram, in cumulative
   histogram mode.

### Package `metric`

The metric package allows to retrieve data from a specific metric identified by uuid and canonical metric name.

> **Note:** Generally `find()` is the preferred way to get data into CAQL.
> Use this function only if you want to bypass metric search, e.g. for debugging purposes.

The main function in this package is:

* **`metric(check_uuid, metric_name)`** - This is an alias for `metric:average()`.
  - `check_uuid` - uuid of the check the metric belongs to, e.g. `AC853FCC-5C29-4F9E-867C-69BC699C5DBF`
  - `metric_name` - canonical metric name, including tag information, e.g. `"duration|ST[service:www]"`

The following variants are supported, and allow to select different [DataTypes](/circonus/data-model/#data-types) for the given metric:

 * **`metric:count(check_uuid, metric_name)`** - Return data kind count for the specified metric, i.e. the number of samples recorded within
   the rollup period.
 * **`metric:average(check_uuid, metric_name)`** - Return data kind average.
 * **`metric:stddev(check_uuid, metric_name)`** Return data kind stddev.
 * **`metric:counter(check_uuid, metric_name)`** - Return data kind counter.
 * **`metric:counter_stddev(check_uuid, metric_name)`** - Return data kind counter_stddev.
 * **`metric:derivative(check_uuid, metric_name)`** - Return data kind derivative.
 * **`metric:derivative_stddev(check_uuid, metric_name)`** - Return data kind derivative_stddev.
 * **`metric:histogram(check_uuid, metric_name)`** - Return histogram data.
 * **`metric:histogram_cum(check_uuid, metric_name)`** - Return histogram data in cumulative mode.
 
 > **Note:** A histogram metric will return NULL values for the numeric types: average, stddev, counter, counter_stddev, deriative, derivative_stddev.
 > A numeric metric will return NULL values for the histogram types: histogram, histogram_cum.
 

### Package `stats`

The `stats` package contains function that aggregate data from multiple input streams.

Missing data is ignored by all functions, unless otherwise stated.

**Examples:**

- Find all `count` metrics with tags `service:www` and  `code:200` and aggregate them by summing each time-slice:  
  ```find("count", "and(service:www,code:200)") | stats:sum()```
  
- Get the maximal CPU utilization across all `www` servers:  
  ```find("cpu_util", "and(service:www,code:200)") | stats:max()```

- Cap a metric at value 100. This is done, by calculating the minimum of the metric value and 100, at each time-slice:
  ```metric($uuid, $name) | stats:min(100)```

Most functions in this package take an optional numeric argument `x`.
If present, this value will be included in the calculation.

The package contains the following functions:

 * **`stats:sum( [x] )`** - Returns sum of all input streams. Missing values are treated as 0.
 * **`stats:sub( [x] )`** - Returns the value of the first stream minus the sum of all remaining stream. Missing values are treated as 0.
 * **`stats:mean()`** - Return the mean of all input values.
 * **`stats:max( [x] )`** - Return the maximum of all input values.
 * **`stats:min( [x] )`** - Return the minimum of all input values.
 * **`stats:prod( [x] )`** - Returns product of all input streams. Missing values are treated as 1.
 * **`stats:div( [x] )`** - Returns quotient of the first stream by the product of all remaining streams. Missing values are treated as 1.
 * **`stats:percentile(p1, p2, ...)`** - Calculates an approximation of the given percentile, calculated across all
   input streams.

* **`stats:trim(n)`** (_Experimental_) - Discard samples at high and low end.
   - `n` - number of samples to discard.
 * **`stats:select(n)`** (_Experimental_) - Select a specific input stream.
   - `n` - index of stream to select

### Package `window`

The `window` package provides functions that allow you to aggregate data over time windows.

**Examples:**

- Count users over days in US/Pacific timezone:  
  ```find("users") | window:sum(1d, offset="US/Pacific")```

- Determine maximal request duration over the last 24 hours, advanced every hour:  
  ```find("duration") | window:max(1d, skip=1h)```

- Calculate aggregated percentiles over 1h windows, using histogram metrics:  
  ```find:histogram(...) | window:merge(1h) | histogram:percentile(99)```
  
Each function in the window package, supports the following parameters:

 - `window_duration` - duration of the time window.
 - `skip = window_duration` - duration after which to advance windows. default=window_duration
 - `offset = 0` - Align windows with given offset to UTC time. Either a duration literal (e.g. '2h') or a timezone string (e.g. 'US/Eastern').
   All timezone strings in the IANA tz-database are supported. 
   A list can be found on [Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
 - `align = "start"` - emit data at the start or end of the window. 
   In serial mode align is always set to "end".
 - `period = VIEW_PERIOD` - period to base computation on. default=VIEW_PERIOD

Aggregations are applied to all input streams independently.

> **Note:** By default `window:*` functions will operate on pre-aggregated data returned by the upstream CAQL
> functions.  E.g. When viewing the CAQL statement `find(...) | window:max(1h)` over 1 week on a graph, it will return a
> maximum computed over VIEW_PERIOD=10M averages.  If you want to compute aggregates over 1M data, you have to specify
> `period=1M` as a parameter.

> **Note:** The behaviour of `window:*` in caql-broker / `#serial`-mode is slightly different from the behaviour of
> those function when used in graphs.  In serial mode, at time `t`, CAQL only has data that arrived before `t` at its
> disposal.  Hence it can't compute the aggregates over a time window before that window has completed.  For this reason
> serial mode always uses the `align="end"` setting. When used in graphs, CAQL defaults to showing aggregates aligned
> with the start of the window.

This package contains the following functions:

 * **`window:sum(window_duration, ...)`** - The sum of all values in the specified time window.
 * **`window:count(window_duration, ...)`** - The number of non-missing values over the specified time window.
 * **`window:mean(window_duration, ...)`** - The arithmetic mean of the values over the specified time window.
 * **`window:stddev(window_duration, ...)`** - The (uncorrected) standard deviation of the values over the specified
   time window.
 * **`window:max(window_duration, ...)`** - The maximum of the values over the specified time window.
 * **`window:min(window_duration, ...)`** - The minimum of the values over the specified time window.
 * **`window:first(window_duration, ...)`** - Repeats the first datapoint in a window
 * **`window:percentile(window_duration, percentile, ...)`** - Calculates a percentile of values over the specified
   time window
   - `percentile` - the percentile to calculate. Valid range: 0 .. 100.
 * **`window:inverse_percentile(window_duration, threshold, ...)`** - Calculates the inverse percentile over the
   specified time window.
   - `threshold` - threshold for values (exclusive). Percentage of values below the threshold is calculated.
 * **`window:histogram(window_duration, ...)`** - Returns a histogram of all the values contained in the specified time
   window.
 * **`window:merge(window_duration, ...)`** - Merges all histogram values contained in the specified time window.

### Package `rolling`

The rolling package includes functions that operate on rolling time windows, which are advanced every minute.

**Examples:**

- Count users over the last rolling hour:  
  ```find("users") | rolling:sum(1h)```

- Maximal request duration over the last rolling 24 hours:  
  ```find("duration") | rolling:max(1d)```

These provided functions are identical to those in the `window` package, 
but have the `skip` parameter set to `1M` by default.  
See the [window section](#package-window) for a full list of supported parameters.

This package contains the following functions:

 * **`rolling:sum(window_duration, ...)`** - The sum of all values in the specified time window.
 * **`rolling:count(window_duration, ...)`** - The number of non-missing values over the specified time window.
 * **`rolling:mean(window_duration, ...)`** - The arithmetic mean of the values over the specified time window.
 * **`rolling:stddev(window_duration, ...)`** - The (uncorrected) standard deviation of the values over the specified time window.
 * **`rolling:max(window_duration, ...)`** - The maximum of the values over the specified time window.
 * **`rolling:min(window_duration, ...)`** - The minimum of the values over the specified time window.
 * **`rolling:first(window_duration, ...)`** - Repeats the first datapoint in a window
 * **`rolling:percentile(window_duration, percentile, ...)`** - Calculates a percentile of values over the specified time window
   - `percentile` - the percentile to calculate. Valid range: 0 .. 100.
 * **`rolling:inverse_percentile(window_duration, threshold, ...)`** - Calculates the inverse percentile over the specified time window.
   - `threshold` - threshold for values (exclusive). Percentage of values below the threshold is calculated.
 * **`rolling:histogram(window_duration, ...)`** - Returns a histogram of all the values contained in the specified time window.
 * **`rolling:merge(window_duration, ...)`** - Merges all histogram values contained in the specified time window.

### Package `aggregate`

The aggregate package, allows for fine-grained control over the data aggregation in graphing applications.

> **Context:** When viewing graphs on large time windows (>1day), the presented data will always be aggregated.  This is
> for the simple reason that there are not enough pixels on the screen to show values for 10K values recorded over
> a week.  By default CAQL will return an approximation of the mean value of data within the aggregation window.
> This behaviour can be altered with the `aggregate` package.

By default, functions in this package will request 1M data and aggregate data to the requested period (`VIEW_PERIOD`) of
the graph.  The period of the requested parameter can be changed with the `period` parameter.
All functions in this package take `period` as the first argument (optional).

**Examples:**

- Aggregate search results with max instead of taking the mean:  
  ```find(...) | aggregate:max()```

- Return search results, with a minimum granularity of 1h:  
  ```find(...) | aggregate:mean(1h)```

> **Warning:** Using `aggregate:*()` functions can increase the latency of the query substantially.

This package includes the following functions:

 * **`aggregate:count([period=1M])`** - The number of non-missing values over the aggregation window.
 * **`aggregate:histogram([period=1M])`** - Returns a histogram of all the values contained in the specified time window.
 * **`aggregate:max([period=1M])`** - The maximum of the values in the aggregation window.
 * **`aggregate:mean([period=1M])`** - The arithmetic mean of the values in the aggregation window.
 * **`aggregate:min([period=1M])`** - The minimum of the values over the specified time window.
 * **`aggregate:sum([period=1M])`** - The sum of the values in the aggregation window.
 

### Package `op`

This package contains function-versions of CAQL operators.  
The operator naming is inspired by the Unix `test(1)` command.
Operators in this package expect two input streams to be passed as source parameters.
Optionally the second input stream can be replace by a constant that is passed as a function argument (e.g. `op:leq(5)` will return 1 whenever the input stream is less than 5).
See the `each` package, for versions of these operations that apply to multiple streams.

All operators will return NULL if one of the input streams is NULL.
Use the `stats:*` functions if you want to ignore missing data.

Most of the functions, take an optional argument `x` that , if present, will replace the second input stream.

**Examples:**

- Determine if queue size is greater than 50:  
  ```metric("$uuid", "queue_length") | op:gt(50)```

The following functions are supported:

#### Arithmetic Operators

 * **`op:neg()`** - Operator `-`. Unary negation. Returns current value times -1.
 * **`op:sum( [x] )`** - Operator `+`. Returns sum of all input streams.
 * **`op:sub( [x] )`** - Operator `-`. Returns the value of the first input stream minus the sum of all remaining streams.
 * **`op:prod( [x] )`** - Operator `*`. Returns product of all input streams.
 * **`op:div( [x] )`** - Operator `/`. Returns quotient of the first input stream by the product of all remaining streams.
 * **`op:exp( [x] )`** - Operator `^`. Returns stream one raised the power of stream two.
 
#### Comparison Operators

 * **`op:eq( [x] )`** - Operator `==`. Test if input stream one equal to input stream two.
 * **`op:geq( [x] )`** - Operator `>=`. Test if input stream one is larger than or equal to input stream two.
 * **`op:gt( [x] )`** - Operator `>`. Test if input stream one is less than or equal to input stream two.
 * **`op:leq( [x] )`** - Operator `<=`. Test if input stream one is less than or equal to input stream two.
 * **`op:lt( [x] )`** - Operator `<`. Test if input stream one is less than or equal to input stream two.

See `each` package, for versions supporting multiple streams.

#### Boolean Operators

 * **`op:or()`** - Operator `or`. Returns 1 if one input stream is a non-zero number, else 0.
 * **`op:and()`** - Operator `and`. Returns 0 if one input stream is 0; else 1.
 * **`op:not()`** - Operator `!` and `not`. Returns the boolean negation of the current value.

### Package `each`

The `each` package is similar to the `op:*` package but provides functions that operate on multiple input streams.

**Example:**

- Convert bytes/sec to bits/sec:  
  ```find("ingress_bytes_per_sec") | each:mul(8)```

This package contains the following functions:

 * **`each:add(x)`** - Adds a given amount to all input streams
 * **`each:sub(x)`** - Subtracts a given amount from all input streams
 * **`each:mul(x)`** - Multiplies all input streams by a given number
 * **`each:div(x)`** - Divides all input streams by a given number
 * **`each:exp(x)`** - Raises all input streams to the power of a given number

 * **`each:eq(x)`** - Tests is each input stream is equal to a given number.
 * **`each:geq(x)`** - Tests is each input stream is greater than or equal to a given number.
 * **`each:gt(x)`** - Tests is each input stream is greater than a given number.
 * **`each:leq(x)`** - Tests is each input stream is less than or equal to a given number.
 * **`each:lt(x)`** - Tests is each input stream is less than a given number.

### Package `filter`

The `filter` package provides functions that allow the user to select streams based on numeric criteria.

**Examples:**

- Remove streams that consist entirely of missing values:  
  ```find("...") | filter:any:not:missing()```

- Only show streams with all values greater than 100:  
  ```find("...") | filter:all:gt(100)```

- Only show streams that have at least one value greater than 100:  
  ```find("...") | filter:any:gt(100)```

- Only show only values greater than 100. This means, replace all values less than or equal to 100 with NULL:  
  ```find("...") | filter:any:gt(100)```

Filter functions follow the general pattern: `filter:<mode>:<condition>`, where `<mode>` is either `all`, `any` or `values` and `<condition>` is one of `missing/lt/leq/eq/neq/geq/gt`. All conditions can be prefixed with `:not`, negating the condition.

Missing data is ignored in the numerical comparison functions `lt/leq/eq/neq/geq/gt`.

The package contains the following functions:

 * **`filter:<mode>:gt(x)`**  - Filters streams where values are greater than a given number.
 * **`filter:<mode>:geq(x)`** - Filters streams where values are greater than or equal to a given number.
 * **`filter:<mode>:eq(x)`**  - Filters streams where values are equal to a given number.
 * **`filter:<mode>:leq(x)`** - Filters streams where values are less than or equal to a given number.
 * **`filter:<mode>:lt(x)`**  - Filters streams where values are less than a given number.

For `<mode>` equal to `any` and `all` there is also:

* **`filter:<mode>:missing(x)`**  - Filters streams where all/any values are missing.

Only `filter:values:*` functions are supported in CAQL checks.

### Package `histogram`

The histogram package provides functions that operate on histogram data.

#### Histogram Construction Functions

* **`histogram()`** - This is an alias for histogram:create().
* **`histogram:create()`** - Creates histograms from numeric input streams e.g. `histogram:create{A,B}`.

**Example:**

- Create a histogram of all CPU utilization metrics in a cluster:  
  ```find("cpu_used", "and(service:www)") | histogram()``` 
  or  
  ```histogram{ find("cpu_used", "and(service:www)") }```

#### Histogram Aggregation Functions

* **`histogram:merge()`** - Merges all input histogram streams into a single output histogram stream.
* **`histogram:subtract()`** - Takes the first input stream, and subtracts all subsequent input streams. Inverse of `histogram:merge()`.
* **`histogram:rolling(window_duration)`** (_Deprecated_. Use `rolling:merge()`) - Aggregate a stream of histograms across a rolling window of given size
   - `window_duration` - duration of the time window.
* **`histogram:window(window_duration)`** (_Deprecated_. Use `window:merge()`) - Aggregates a stream of histograms to a new histogram of given window size
   - `window_duration` - duration of the time window.

**Example:**

- Aggregate duration histograms across different nodes, and calculate percentiles:  
  ```find:histogram("duration", "and(service:www)") | histogram:merge() | histogram:percentile(99)```

#### Histogram Counting Functions

* **`histogram:count()`** - Calculate the number of values represented by the histogram per minute.
* **`histogram:rate()`** - Calculates the number of values represented by the histogram each second. 
  This is equivalent to `histogram:count() / 60`
* **`histogram:count_above(t1, t2, ...)`** - Calculates the number of samples in buckets entirely above the given threshold values.
  - `t1, t2, ...` - threshold values, inclusive (x >= t)
* **`histogram:count_below(t1, t2, ...)`** - Calculates the number of samples in buckets entirely below the given threshold values.
  - `t1, t2, ...` - threshold values, inclusive (x <= t)
* **`histogram:count_bucket(t1, t2, ...)`** - Calculates the number of samples that are located in the same bucket as the provided values.
  - `t1, t2, ...` - bucket values
* **`histogram:ratio_above(t1, t2, ...)`** - Calculates the ratio of samples in buckets entirely above the given threshold values.
  - `t1, t2, ...` - threshold values, inclusive (x >= t)
* **`histogram:ratio_below(t1, t2, ...)`** - Calculates the ratio of samples in buckets entirely below the given threshold values.
* **`histogram:inverse_percentile(t1, t2, ...)`** - Calculates the inverse percentile over the specified time window.
   - `threshold` - threshold for values (exclusive). Percentage of values below the threshold is calculated.


#### Histogram Statistics

* **`histogram:min()`** - Calculates the minimum of all values contained in the histogram.
* **`histogram:max()`** - Calculates the maximum of all values contained in the histogram.
* **`histogram:mean()`** - Calculates the arithmetic mean of the histogram.
* **`histogram:median()`** - Calculates the median of the histogram, i.e. the 50th percentile.
* **`histogram:stddev()`** - Calculates the standard deviation of the histogram.
* **`histogram:sum()`** - Calculates the sum of all samples in the histogram.
* **`histogram:IQR([range])`** - Calculates the Interquartile Range (i.e. 75-percentile - 25-percentile) of the histogram.
  - `range` - (optional, default:`50`) Distance between quantiles to compute. I.e. `IQR(x)` contains x% of all samples. Valid range 0..100
* **`histogram:percentile(p1, p2, ...)`** - Calculates the given percentiles over a stream of histograms.
   - `p1, p2, ...` - percentiles to compute. Valid range: 0 .. 100

### Package `math`

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

### Package `tag`

The output streams of CAQL statements carry tag information.
By default CAQL will forward and merge tag information that is returned by metric selectors `find:*()` and `metric:*`.
More fine-grained control is provided by the following functions.

 * **`tag(t1, t2, ...)`** - Alias for `tag:add()`.
   - `t1, t2, ...` - tags to append in the form 'tag:value'
 * **`tag:add(t1, t2, ...)`** - Attach tags to all output streams.
   - `t1, t2, ...` - tags to append in the form 'tag:value'
 * **`tag:remove(category, [value])`** - Remove tags from all output streams.
   - `category` - tag category to remove
   - `value` - (optional) tag value to remove. If not provided, all tags of the given category will be removed.

**Examples:**

- Add a tag `find()` results to improve the labels/legend entries:  
  ```find("duration") | tag("service:www") | label("%cn")```

- Tag results of two different find queries before merging them for further processing:  
  ```pass{ find("...") | tag("group:A"), find("...") | tag("group:B") } | top(5)```

### Package `group_by`

The `group_by` package allows you to aggregate metrics by tags.

**Examples:**

- Sum requests by account:  
  ```find("request_count") | group_by:sum("account")```  
  This will aggregate `request_count` metrics for each `account` tag value.
  Metrics without `account`-tag will be grouped together.
  
- Mean cpu utilization by service name, and datacenter:  
  ```find("cpu_used") | group_by:mean("service", "dc")```
  
- Calculate latency percentiles per http code across a cluster:  
  ```find:histogram("latency", "and(service:www)") | group_by:merge("code") | histogram:percentile(90,99,99.9)```

This package provides the following functions:

 * **`group_by:count(tag1 [, tag2, ...])`** - Count metrics by tag
 * **`group_by:sum(tag1 [, tag2, ...])`** - Sum metrics by tag
 * **`group_by:mean(tag1 [, tag2, ...])`** - Average metrics by tag
 * **`group_by:max(tag1 [, tag2, ...])`** - Compute maximal metric values by tag
 * **`group_by:min(tag1 [, tag2, ...])`** - Compute minimal metric values by tag
 * **`group_by:merge(tag1 [, tag2, ...])`** - Merge histogram metrics by tag


### Package `integrate`

The `integrate` package allows the user to sum streams over time.

* **`integrate()`** - Computes a cumulative sum over all input streams.
  The starting point of the summation is unspecified and may vary between invocations, of the same statement. 

* **`integrate:while(condition)`** - While a condition on the first input slow is met, integrate the remaining inputs.
  - `condition` - optional. One of "constant" (default), "rising", "falling".


**Example:**

The typical use-case for integrate:while() are SLO computations involving longer time spans.
To sum all requests issued in the same month, one can use, the following query pattern:

```
integrate:while{ time:tz("US/Eastern", "month"), find("<request metric query>") )
```

### Package `time`

Functions that tell the time.

 * **`time:epoch()`** - Returns the current UNIX epoch in seconds
 * **`time:tz(timezone, field)`** - Timezone calculations
   - `timezone` - E.g. "UTC", "US/Eastern", "Europe/Berlin"
     All timezone strings in the IANA tz-database are supported. A list can be found on [Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
   - `field` - Field to compute. Valid fileds are: second, minute, hour, monthday, month, weekday, yearday, year

**Example:**

- Set metric to zero during US/Eastern noon hours:  
  ```if{ 12.00 < time:tz("US/Eastern", "hour") and time:tz("US/Eastern", "hour") < 14.00, 0, metric(....)}```

### Package `fill`

Functions for replacing missing data in streams:

 * **`fill(value)`** - Replace missing values with a given number.
   - `value` - for replacement
 * **`fill:forward()`** - Replace missing value with last non-missing value in the stream.

### Package `forecasting`

This package provides functions, that allow projections of time series into the future.

 * **`forecasting:auto(forecast_duration)`** Forecast all input streams into by a given amount to the future,
   This function performs a zero-configuration best-effort forecast.
   At the time of this writing, the function implements a regression model, that should be good-enough for
   simple forecasts for disk-space or memory. Expect improvements/changes of this method in the future.

 * **`forecasting:regression(forecast_duration, [model_duration], [step=?], [model="linear"])`** - Forecast values, by fitting a regression line.
   - `forecast_duration` - target duration to forecast into the future
   - `model_duration` - (optional, default:`10`) duration of time to base the model on
   - `step = 1` - specify interval, to recompute regression.
   - `model = "linear"` - linear/exp
 * **`forecasting:slope(forecast_duration, [model_duration], [step=1], [model="linear"])`** - Forecast values, by fitting a line through two points.
   - `forecast_duration` - target duration to forecast into the future.
   - `model_duration` - (optional, default:`10`) duration of time to base model on.
   - `step = 1` - specify interval to recompute fitting-line.
   - `model = "linear"` - linear/exp

 * **`forecasting:ewma(alpha, [fill=1])`** - Exponentially weighted moving average.
   - `alpha` - decay parameter, in `[0,1]`.
   - `fill = 1` - fill in missing values with forecast (fill=1). If fill=2, then only missing values will be replaced by the forecast. Non-missing values will be passed through.
* **`forecasting:dewma(alpha, beta, [fill=1], [forecast_duration=0])`** - Double exponentially weighted moving average.
   - `alpha` - decay parameter, in `[0,1]`.
   - `beta` - decay parameter slope, in `[0,1]`.
   - `fill = 1` - fill in missing values with forecast (fill=1). If fill=2, then only missing values will be replaced by the forecast. Non-missing values will be passed through.
   - `forecast_duration = 0` - return values forecasted by this duration to the future.
 * **`forecasting:holt_winters(alpha, beta, gamma, [forecast_duration=0], [fill=1], [period=1440])`** - Holt-Winters triple exponential weighted moving average.
   - `alpha` - decay parameter, in `[0,1]`.
   - `beta` - decay parameter for slope, in `[0,1]`.
   - `gamma` - decay parameter for period, in `[0,1]`.
   - `forecast_duration = 0` - return values forecasted by this duration to the future.
   - `fill = 1` - fill in missing values with forecast (fill=1). If fill=2, then only missing values will be replaced by the forecast. Non-missing values will be passed through.
   - `period = 1440` - duration of period. Default 1d

### Package `outlier`

Functions for identifying outlying metrics.

 * **`outlier:cluster_score([normalize=0])`** - Takes in multiple streams and computes an outlier score for each of the input metrics.
   Example: `find("db`*`request_rate") | outlier:cluster_score()`.
   This statement takes in the request rates of several nodes in a db cluster and outputs the outlier score for all of those nodes.
   - `normalize = 0` - normalize output a deviation measure (1) or a mean measure (2).
 * **`outlier:count([sensitivity=50])`** - Counts the number of outliers as displayed in the Outlier Report for a given point in time
   - `sensitivity = 50` - Sensitivity to outliers. Valid values (less outliers) 0 .. 100 (more outliers)
 * **`outlier:normal_range([sensitivity=50])`** - Normal range as displayed in the Outlier Report.
   - `sensitivity = 50` - Sensitivity to outliers. Valid values (large ranges) 0 .. 100 (small ranges)
 * **`outlier:std_score([trim=0], [show_model=0], [normalize=0])`** - Compute the standard-score of the first input stream, within context of all remaining streams.  The standard-score is defined the normalized distance of current value to the mean value to the normalized context:  $ std_score(y,c_1,...,c_N) = \frac{y - mean(c_1,...,c_N)}{ NORM } $  The parameter `normalize` allows several choices of the normalization. 
   - `trim = 0` - remove the N lowest and N highest values from the context values.
   - `show_model = 0` - output the mean value of the context instead of the outlier score model. 0/1
   - `normalize = 0` - normalize output by a deviation measure (1) or a mean measure (2). Setting normalized=0 disables normalization.

### Package `search` (Deprecated)

> **Warning:** This package is deprecated, and will be removed by 2020-01-31.
> Use functions in find:* instead.

The `search` package allows you to use [Circonus metric search v2 facilities](/circonus/search/) from within CAQL.

 * **`search:metric(pattern)`** - (deprecated) Shorthand for search:metric:average().
 * **`search:metric:average(pattern)`** - (deprecated) Search for metrics matching pattern of type 'average'.
 * **`search:metric:count(pattern)`** - (deprecated) Search for metrics matching pattern of type 'count'.
 * **`search:metric:counter(pattern)`** - (deprecated) Search for metrics matching pattern of type 'counter'.
 * **`search:metric:counter_stddev(pattern)`** - (deprecated) Search for metrics matching pattern of type 'counter_stddev'.
 * **`search:metric:derivative(pattern)`** - (deprecated) Search for metrics matching pattern of type 'derivative'.
 * **`search:metric:derivative_stddev(pattern)`** - (deprecated) Search for metrics matching pattern of type 'derivative_stddev'.
 * **`search:metric:histogram(pattern)`** - (deprecated) Search for metrics matching pattern of type 'histogram'.
 * **`search:metric:stddev(pattern)`** - (deprecated) Search for metrics matching pattern of type 'stddev'.

