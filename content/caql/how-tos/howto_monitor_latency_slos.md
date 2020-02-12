---
title: Howto Monitor Latency SLOs
weight: 60
---

# Howto Monitor Latency SLOs

Latency SLOs quantify the performance of an API endpoint over long time periods.
A typical Latency SLO looks as follows:

> The proportion of valid requests served over the last 4 weeks, that were slower than 100ms, is less than 1%.

Here "valid" means, that the request did not trigger an error condition.

There are a number of challenges involved with monitoring SLOs like this:

1. The threshold value is arbitrary, and might be changed in the future.
2. Latency percentiles can not be aggregated, after they have been computed once.
3. Reporting periods of multiple months require long data retention.

In this Howto we will outline a few methods to monitor SLO targets of this form effectively using Circonus Histograms.

More in-depth treatment of Latency SLOs can be found in on our [blog](https://www.circonus.com/2018/08/latency-slos-done-right/), and [this talk](https://archive.fosdem.org/2019/schedule/event/latency_slos_done_right).

## Step 1: Aggregate Latency Data As Histogram

In this note we will assume, that the service is question is instrumented to emit histograms metrics.
In our example we have 10 database nodes, that emit histogram metrics named "latency", and tagged with service name (`service:www`) and HTTP status code (`status:200`, `status:500`, etc.).

We restrict our analysis to valid request by restricting our search to metrics with tag `status:2*`.
Then we use the `histogram:merge()` method, to aggregate histogram metrics captured from all nodes.

![](/images/caql/caql_slo_histogram-2.png)
```
find:histogram("latency", "and(service:www,status:2*)") | histogram:merge()
```

## Step 2: Count Good and Bad Requests

The next step in our analysis is to count good and bad requests as they occur.  Good requests are requests that were
served faster than our latency threshold of `100ms`.  Bad requests are all slower requests.  We can use the CAQL
functions `histogram:count_below()`, `histogram:count_below()` and `histogram:count()` to count, good, bad and total
requests made.

![](/images/caql/caql_slo_request_rates.png)
```
find:histogram("latency", "and(service:www,status:2*)") | histogram:merge() 
| histogram:count_below(0.100)
| label("Good Requests")
```

```
find:histogram("latency", "and(service:www,status:2*)") | histogram:merge() 
| histogram:count_above(0.100) | op:neg()
| label("Bad Requests")
```

## Step 3: Counting Requests over 4 weeks of time

The next step is aggregating the data across 4 weeks of time. 
This can be done on the histogram level, using `rolling:merge()` or at the rate level with `rolling:sum()`.
We use the first variant in the following CAQL query:

![](/images/caql/caql_slo_4w_request_counts.png)
```
find:histogram("latency", "and(service:www,status:2*)") | histogram:merge() 
| rolling:merge(4w, skip=1d)
| histogram:count_below(0.100)
| label("Good Requests / 4 weeks")
```

```
find:histogram("latency", "and(service:www,status:2*)") | histogram:merge()
| rolling:merge(4w, skip=1d)
| histogram:count_above(0.100)
| op:neg()
| label("Bad Requests / 4 weeks")
```

The parameter `skip=1d` as added for performance reasons. Otherwise, when zooming into the graph, we can run into
situations where 4 weeks of data are requested at `1M` resolution, which will result in time-outs or quota limits.

## Step 3: Calculating the Proportion of Bad Requests

Once we have aggregated the data as histograms across nodes and time, we can count the proportion of bad requests by
using the `histogram:ratio_above()` function, like so.

![](/images/caql/caql_slo_4w_request_proportion.png)
```
find:histogram("latency", "and(service:www,status:2*)") | histogram:merge()
| rolling:merge(4w, skip=1d)
| histogram:ratio_above(0.100)
| label("Prpoprtion of Bad Requests / 4 weeks")
```

We added a guide at the 1% threshold to the graph, and the current count of bad requests for context.

This graph can now be effectively be used for Monitoring Latency SLOs:
- If the green line is below the black guide, the SLO is met.
- If the green line is above the black guide we are in violation with the SLO.

## Alternative: Running Counts

The above calculation can be modified to output running counts over calendar months.
We need a few ingredients for this:

* `time:tz("UTC", "month")` will output the current month number in UTC time.

* `integrate:while()` will integrate the subsequent input slots, while the first slot is constant.

The following statement will count bad requests made in the current calendar month:

![](/images/caql/caql_slo_running_request_count.png)
```
integrate:while(prefill=4w){ time:tz("UTC", "month"), 
   find:histogram("latency", "and(service:www,status:2*)") | histogram:merge()
   | histogram:count_above(0.100)
} 
| label("Bad Requests in calendar month")
```

The `prefill` parameter to `integrate:while()`, will start the integration a given time before the selected view range.

We can normalize this number by the running request count over the last (running) 4 weeks, to get an estimate of our
error budget:


![](/images/caql/caql_slo_running_proportion.png)
```
integrate:while(prefill=4w){ time:tz("UTC", "month"), 
   find:histogram("latency", "and(service:www,status:2*)") | histogram:merge()
   | histogram:count_above(0.100)
} 
/
(
   find:histogram("latency", "and(service:www,status:2*)") | histogram:merge() 
   | rolling:merge(4w, skip=1d) 
   | histogram:count() 
   | op:prod(60) | op:prod(VIEW_PERIOD)
)
| label("Latency Budget spent this month")
```

The transformation `| op:prod(60) | op:prod(VIEW_PERIOD)`, is needed to convert between different aggregation modes used
by integrate and `rolling:merge()` / `histogram:count()`.
The need for this might go away in the future.

For the final version, we add a guide at the 1% SLO target, and the current count of bad requests as context:

![](/images/caql/caql_slo_running_final.png)

The blue area indicates how much of the latency budget is spent within this month already.
It must stay under the black line in order for the Latency SLO to be met in the current calendar month.
The red area indicates how many slow requests are produced at the moment.
