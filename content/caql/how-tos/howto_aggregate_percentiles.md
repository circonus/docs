+++
title = "How to Aggregate Percentiles"
+++

# How to Aggregate Percentiles

We are monitoring a set of 10 web-servers and want to collect latency statistics.  A common way to
do that is calculating percentiles, for each of the nodes with some sort of monitoring agent, or
instrumentation library.  To get global latency percentiles, you now have to aggregate those
percentile metrics across the fleet of 10 web-servers.

Unfortunately, calculating accurate global percentiles from percentile values is famously
impossible.  Once you have converted your raw data to percentiles, there is no meaningful way to
aggregate percentiles any further:

- Circonus, 2015 - https://www.circonus.com/2015/02/problem-math/
- Batey, 2016 - http://www.batey.info/percentiles-averages.html
- StackExchange, 2013 - https://math.stackexchange.com/questions/423535/way-to-aggregated-percentiles

At Circonus we have advocated Histogram Metrics as a solution to this problem for a long time:

- Circonus, 2012 - https://www.circonus.com/2012/09/understanding-data-with-histograms/
- Circonus, 2018 - https://www.circonus.com/2018/08/latency-slos-done-right/

Instead of calculating percentiles on the agent level, the agent published histogram summaries of
the raw data. Those histograms can be freely aggregated and contain enough information to calculate
accurate percentiles (typical error <0.1%, max error <5%).

In this How-To we will assume that the latency data is collected as Histograms in Circonus.

### Step 1: Select Metrics for Aggregation

The best way to select the metrics we want to aggregate is to use the Metric Explorer.
In our example, we use the following query to select latency data from a REST endpoint called
`ntt_get` on an IRONdb cluster identified by IP-range:

```
mtev`*`rest_nnt_get_asynch`latency and(__check_target:10.128.0.*)
```

![](/images/caql/CAQL_howto_percentiles_metric_explorer.png)

Note that we selected a total of 10 histogram metrics, with this search query.

### Step 2: Create a CAQL Statement

We will use CAQL to aggregate the histograms and calculate percentiles.
To so, we need to create a new graph, and add a CAQL Datapoint as explained in the [Getting Started](../getting_started) guide.

The first step is to convert the search query into a CAQL [find()](../reference/#Packagefind) statement like so:
```
find("mtev`*`rest_nnt_get_asynch`latency", "and(__check_target:10.128.0.*)")
```

**Catch** The first thing to note, is that we split the search query into two parts:
1. ```"mtev`*`rest_nnt_get_asynch`latency"``` -- name patter
2. ```and(__check_target:10.128.0.*)``` -- tag query

In the Metric Explorer those parts are simply space separated.
CAQL find() expects those parts to be passed as separate string arguments.

**Catch** This CAQL query will not work as expected, yet. In our case it returns a blank graph.
The reason for this is, that we are pulling numeric data not histogram data.
To change this, we use the `find:histogram()` function, instead of a plain `find()`:

```
find:histogram("mtev`*`rest_nnt_get_asynch`latency", "and(__check_target:10.128.0.*)")
```

**Catch** Also this CAQL query does not quite work as expected for us. The resulting data looks
"smeared-out" across the time axes.

![](/images/caql/CAQL_howto_percentiles_histogram_smeared.png)

The reason for this is, that the data was collected as a time-cumulative histogram.
We need to account for this by using the appropriate data selector `find:histogram_cum()`:


The resulting graph looks like this:

![](/images/caql/CAQL_howto_percentiles_histogram_graph.png)

> **Hint:** Use the mouse wheel, we set the y-axes to an interesting scale, when viewing histograms.

The 10 selected histogram metrics are indicated by different colors.

### Step 3: Aggregate Histogram Data

We use the [histogram:merge()](../reference/#Packagehistogram) function to merge the 10 histograms,
collected on the individual nodes, to a into a single one.

```
find:histogram_cum("mtev`*`rest_nnt_get_asynch`latency", "and(__check_target:10.128.0.*)")
| histogram:merge()
```

![](/images/caql/CAQL_howto_percentiles_histogram_merged.png)

### Step 4: Calculate Percentiles

To calculate percentiles on the aggregated histogram metric, we use the
[histogram:percentile()](../reference/#Packagehistogram) function.
We are interested in the p50, p90, p99 and p99.9:

```
find:histogram_cum("mtev`*`rest_nnt_get_asynch`latency", "and(__check_target:10.128.0.*)")
| histogram:merge()
| histogram:percentile(50,90,99,99.9)
```

Flipping the graph into view mode, we can read-off percentiles for individual 1M time windows:

![](/images/caql/CAQL_howto_percentiles_histogram_percentile_view.png)

### Step 5: Tune Aggregation Periods

In many cases we are not interested in percentiles calculated over 1M time windows, but those over longer time periods like days or weeks.
Histogram metrics can be aggregated over time with the CAQL function [window:merge()](../reference/#Packagewindow).

If we want to calculate percentiles over 1h windows, we would use the following CAQL query:

```
find:histogram_cum("mtev`*`rest_nnt_get_asynch`latency", "and(__check_target:10.128.0.*)")
| histogram:merge()
| window:merge(1h)
| histogram:percentile(50,90,99,99.9)
```

In view mode we can now read-off accurate Percentile values for 1h intervals:

![](/images/caql/CAQL_howto_percentiles_histogram_percentile_windowed.png)

> **Hint:** Use the Legend Formua in the edit view, to specify the precision of valued displayed in the legend. We used `=format("%.6f",VAL)` here.

> **Hint:** The window:merge() function supports a `skip` parameter. For example, `window:merge(1d, skip=1h)` will compute 1 day aggregations that are advanced every 1h.

> **Hint:** The window:merge() function supports an `offset` parameter. For example, `window:merge(1d, offset="US/Eastern")` will compute aggregations across days in the US/Eastern timezone.

In our case, we get the following percentile values for latency data aggregated over

| Global Percentile / 1h | Value (sec) |
|-|-|
| p50 | 0.000141 |
| p90 | 0.003898 |
| p99 | 0.00615|
| p99.9 | 1.25 |
