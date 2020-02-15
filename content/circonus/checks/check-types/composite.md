---
title: Composite
---

# Composite {#Composite}

 * **Category:** custom
 * **Dataflow:** pull
 * **Default Port:** N/A

Composite metrics allow you to create a metric that is a functional composition of other metrics, thereby allowing you to apply a formula to a group of metrics.

For example, you could use a Composite metric to find the sum of transaction rates across 100 web servers, the standard deviation of server access time, the average of a specific metric over a specified time window, or the average concurrency across a large cluster of databases.

Within Circonus, each composite metric is its own check and has exactly one metric. The name of that metric is chosen by the creator of the check.

Each composite metric has a formula that defines how the value is calculated.  Here is a simple example to calculate the average duration of requests for users:

```
(metric:average(1,"duration",60000) + metric:average(2,"duration",60000)) / metric:average(10,"users",60000)
```

The subsection below lists operators and functions available for use in the formula field.

## Composite Formulae {#CompositeFormulae}

 * `(` and `)` - The parenthesis operators are used to establish order of operations.  The composite formulae have left to right precedence for all expressions. For example, "A + B / 10" is equivalent to "( A + B ) / 10".  To achieve a "natural" precedence using the traditional order of operations, one would use "A + ( B / 10 )".
 * `+` - infix operator for addition, i.e. "`A + B`"
 * `-` - infix operator for subtraction, i.e. "`A - B`"
 * `*` - infix operator for multiplication, i.e. "`A * B`"
 * `/` - infix operator for division, i.e. "`A / B`"
 * `^` - infix operator for exponentiation, i.e. "`A ^ B`"
 * `<<` - infix operator for binary left shift, i.e. "`A << 2`"
 * `>>` - infix operator for binary right shift, i.e. "`A >> 2`"
 * `metric:average(<checkid>,<metricname>,<timewindow_ms>)` - the average of the specific metric over the specified time window
 * `metric:value(<checkid>,<metricname>,<timewindow_ms>)` - an alias for `metric:average`
 * `metric:count(<checkid>,<metricname>,<timewindow_ms>)` - the number of times the specified metric was seen in the specified time window
 * `metric:stddev(<checkid>,<metricname>,<timewindow_ms>)` - the standard deviation of the metric values over the specified time window
 * `metric:derivative(<checkid>,<metricname>,<timewindow_ms>)` - the rate of change (per second) of the metric over the specified time window
 * `metric:derivative_stddev(<checkid>,<metricname>,<timewindow_ms>)` - the standard deviation of the rate of change (derivative) of the metric values over the specified time window
 * `metric:counter(<checkid>,<metricname>,<timewindow_ms>)` - the positive rate of change (per second) of the metric over the specified time window.  This ignores rates less than 0 as though they do not exist.  This handles metrics that might reset or roll range-limited counter.
 * `metric:counter_stddev(<checkid>,<metricname>,<timewindow_ms>)` - the standard deviation of the positive rate of change (counter) of the metric values over the specified time window
 * `stats:q([0,1], <metric function>,<metric function>,...)` - Choose a quantile from a set of data.  All individual data points within the parameters are ordered and the quantile requested is returned (with linear interpolation between points).
 * `stats:min(<args>)` - an alias for `stats:q(0,<args>)`
 * `stats:max(<args>)` - an alias for `stats:q(1,<args>)`
 * `stats:sum(<metric function>,...)` - sum the arguments
 * `stats:mean(<metric function>,...)` - compute the arithmetic mean of the arguments
 * `stats:arithmetic_mean` - an alias for `stats:mean`
 * `stats:geometric_mean(<metric function>,...)` - compute the geometric mean of the arguments
 * `math:e()` - produce the value `E`
 * `math:pi()` - produce the value `PI`
 * `math:log(arg,base)` - the natural logarithm of `arg` divided by the natural logarithm of base
 * `math:log10(arg)` - an alias for `math:log(arg,10)`
 * `math:ln(arg)` - the natural logarithm of `arg`
 * `math:abs(arg)` - the absolute value of `arg`
 * `math:pow(arg,exp)` - arg raised to the power of `exp`
 * `math:exp(arg)` - `E` raised to the port of `arg`

Above, <metric function> refers to any metric:*(...) formula, but anything that results in a value could be used. For example, metric:counter(...) (see above) would be valid to use as a <metric function>, but you could also put "9" there as well, for the value 9.

## Composite Helper Toolbars {#CompositeHelperToolbars}

Helper toolbars are provided to assist in building composite formulas. The three main toolbars are shown by default when you focus on the text area, but other context-appropriate toolbars are shown if you select any of the following special placeholders: `<metric>`, `<checkid>`, or `<metricname>`. Double-clicking on a placeholder is the easiest way to select it.

If you do not want the toolbar to be showing, click the "f(x)" button to the right of the "Metric Formula" field. This will disable auto-showing for toolbars and they will remain hidden unless you click the "f(x)" button again to show them.

## Search by Tag or Attribute {#SearchbyTagorAttribute}

In addition to being able to specify the Check ID and metric name, you can also provide terms which Circonus will use to search for checks that match the criteria.  As you add and remove checks from your account, formulas that use these searches are automatically updated.

For example, if you want to sum all of the users currently connected to an internal application called "Foo" which are being checked with the JSON module, you would use this formula:
```
stats:sum(metric:average(tag:application:foo and module:json, "connected_users", 60000))
```

As we find checks that match the "tag + module" criteria, our `metric:average` function is expanded out to multiple functions, one per each Check ID, comma separated, as shown below:
```
stats:sum(metric:average(23, "connected_users", 60000),metric:average(101, "connected_users", 60000))
```

Therefore, searching on tags or attributes will work anywhere where this expansion is appropriate.

Currently, the following items can be used as search criteria:

 * tag
 * target host
 * module
 * any key in the "config" section of a `check_bundle` (as used in the API)
