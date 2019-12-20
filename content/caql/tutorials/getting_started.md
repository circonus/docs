---
title: Getting Started with CAQL
---

# Getting Started with CAQL {#CirconusAnalyticsQueryLanguageCAQL}

CAQL is the Circonus Analytics Query Language.
It lets you retrieve and aggregate metric data as well as compose complex data transformations.

CAQL can be used to visualize data on graphs, and for driving alerting rules (using [CAQL checks](/Data/CheckTyels/CAQLCheck)).

Here are a few examples, to get a rough idea of what to expect:

* Basic Arithmetic:  
  ```
  1+2
  ```

* Data Aggregation:  
  ```
  find("requests_total", "and(service:www)")
  | stats:sum()
  ```

* Complex Data Transformations:  
  ```
  find("queue_size", "and(service:rabbit)")
  | rolling:max(1h)
  | top(5)
  ```

By the end of this text, you should understand what those queries do and how to create queries like this yourself.

## Creating a first CAQL Query

To create your first CAQL query, create a new graph, click on "Add Datapoint" and select "CAQL" from the pop-up menu. 
Expand the legend bar to see the CAQL input field.
Type `1 + 2` into the input filed, and hit `[Shift]+[Return]` to evaluate the query.

You should see a graph like this:

![Image:CAQL 1 + 2](/images/caql/CAQL_1.png)

Congratulations! You have just evaluated your first CAQL query.

> **Note:** If you run into any problems with this or any other CAQL query, please don't hesitate to reach out to us.
> We are available on [Slack](http://slack.s.circonus.com/), or via email to [support@circonus.com](mailto:support@circonus.com).

## Selecting Metrics

Now let's try to get some metric data into CAQL.

The account we are using in this guide has some HTTP checks setup against various host.
We will use data from those checks here, by using the following query:

```
find("duration")
```

This will select all metrics from your account that have the name "duration".
In our case this looks like this:

![Image:CAQL find()](/images/caql/CAQL_2.png)

The `find()` function let's you run general [searches](./SearchingV3.md) from within CAQL.
For example you can select metrics that start with the string "cpu" as follows:

```
find("cpu*")
```

If you have a large number of hosts, you will probably get back a lot of cpu metrics.
We will need a way to filter down that data to the set with the tags we are looking for.
The can be done using [tag filters](./SearchingV3.md), submitted as a second parameter:

```
find("cpu*", "and(source:circonus-agent)") 
```

This will select all metrics which have the "source" tag set to "circonus-agent".
The general find() syntax is explained in the [reference manual](./caql_reference.md#Packagefind).

To see which metrics you selected, hit "Menu" > "View Graph".
In view mode, the graph will have a legend populated with the canonical metric names of the selected metrics:

![Image:CAQL find(cpu*)](/images/caql/CAQL_3.png)

## Changing Labels

The legend entries in the graph for CAQL outputs can be controlled with the `label()` function.
To change the legend entry of our first example to "three", you would use:
```
1 + 2 | label("three")
```

The label function supports formats that get interpolated based on meta-data attached to the metric inputs.
The `%n` specifier expands to the metric name.
The `%tv{...}` specifier expands to the tag value of the provided category argument.
We can use this to show the hostnames in the legend.  These are available via the auto-generated `__check_target` tag.

```
find("cpu*", "and(source:circonus-agent)") | label("%tv{__check_target} / %n")
```

Depending on which metrics you have in your account, the legend should look something like this:

![Image:CAQL Legend](/images/caql/CAQL_4.png)

More details about the `label()` function can be found in the [reference manual](./caql_reference.md#labels).

## Aggregating Data

For the next example, we are going to aggregate request rate metrics across a cluster of web nodes.
The request rate metrics in our example follow the pattern "<endpoint>`count`ok". 
Let's start by selecting some metrics:

```
find:counter("*`count`ok")
```

We use the "counter"-variant of find retrieve request rates, instead of total request counts.
The output looks like this:

![](/images/caql/CAQL_5.png)

To select only the top-5 metrics with the highest request rates, we can use

```
find:counter("*`count`ok") | top(5)
```

> **Tip:** While in view mode, holding down the `s` key will cause the legend to only show the entry of the
> line you are currently hovering over.

To produce the total request rate across all nodes and endpoints, we pipe the `find()` output to the `stats:sum()`
function:

```
find:counter("*`count`ok") | stats:sum()
```

Let's take it one step further, and calculate the total number of requests served within the selected time window.
We can use the `integrate()` function to convert rates into total counts.

```
find:counter("*`count`ok") | stats:sum() | op:prod(60) | integrate()
```

The `op:prod(60)` function we snuck into the last statement, will convert the per-second request rates into
per-minute request rates (multiplying by 60), which `integrate()` expects as input.

Flipping this graph into view mode, and hovering over the last value, we can read the total request count off the legend.

![Image:CAQL integrate()](/images/caql/CAQL_6.png)

In this example, we have served 59.2K requests over the last two days.

Note how the default label displayed in the legend resembles the CAQL query used to create the output.

## Further Reading

A complete set of built-in CAQL functions can be found in the [CAQL Reference Manual](/caql_reference.md#FunctionTables).
