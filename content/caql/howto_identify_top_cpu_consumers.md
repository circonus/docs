# How to Identify Top CPU Consumers

In this document we consider the following problem of identifying hosts or services that consume the most CPU resources.

# Version 1: find() and Mouse Selection

In case you are only monitoring a few dozen hosts, this task can be effectively solved using a simple find query:

```
find:counter("cpu`idle")
```

This will output all "cpu`idle" metrics in your account.
Now, change the "Graph Fill Type" to "Line" in the "Options" menu, and switch the graph to "View Mode" and you will see a graph of all metrics.
By hovering over individual lines and holding down the "s"-key you can pick-out metrics with the lowest CPU idle percentages, i.e. largest cpu utilization.

![](/images/caql/CAQL_topk_cpu_1.png)

# Version 2: Improve labels and values

There are multiple immediate shortcomings with the first version:

1. The legend labels only include the metric name, which is not helpful

2. We are interested in the cpu utilization not the cpu`idle percentage.

We address this shortcomings with the following CAQL statement:

```
find:counter("cpu`idle") | each:neg() | each:add("100") | label("%tv{__check_target} cpu utilization")
```

The expression `... | each:neg() | each:add("100")` will apply the transformation `x --> -x + 100` to each stream,
which is suitable for converting idle percentages into utilization metrics.

The expression `... | label("%tv{__check_target} / %n")` will add a label consisting of the check target (=host name), and the string "cpu utilization".

![](/images/caql/CAQL_topk_cpu_2.png)

This method becomes impractical when too many results are returned.

# Version 3: Use top-k to filter results

In order to narrow down the results to the most relevant metrics we can use the `top()` function, as follows:

```
find:counter("cpu`idle")
| each:neg() | each:add("100") // convert to utilization
| top(5, method="max")        // filter top results
| label("%tv{__check_target} cpu utilization")
```

We added `method="max"` as parameter, since we are interested in the highest CPU spikes.
If we would have been interested in the highest average CPU utilization we could have left this parameter out, or set it to `"mean"`.

The results look like this:
![](/images/caql/CAQL_topk_cpu_3.png)

We can easily pick out the top CPU consumers in our account.

# Version 4: Group-by service tag

In some cases, we might not be interested in individual hosts, but want to identify services provided by groups of hosts, that have a high CPU utilization.

In this case, we can use the [`group_by:*`](../reference/#Packagegroupby) functions to aggregate data by tag.

```
find:counter("cpu`idle")
| group_by:mean("component")
| label("%tv{component} / %n")
```

This CAQL statement will average cpu`idle percentage over the component tag.
Metrics which have the same value for the component tag, will be grouped together and averaged.
If a metric does not have a tag "component", it will be put into the category "uncateogrized".

**Hint:** It's possible to group by multiple dimensions by supplying multiple arguments to group_by, e.g. `group_by:mean("component", "datacenter")`

As label we choose to select the value of the component tag `%tv{component}` ("tv" stands for "tag value"), and append the metric name with "%n".

**Hint:** Use the label-pattern `%t-{*}` to show all tags that vary across the output results.

Once we switch the graph to view mode we will see the following output:

![](/images/caql/CAQL_topk_cpu_4.png)
