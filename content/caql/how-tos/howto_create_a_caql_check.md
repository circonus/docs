---
title: How to create a CAQL Check
---

# How to create a CAQL Check

This guide explains best practices around creating CAQL Checks.

### 1. Create a new Graph and edit the CAQL query

Before creating a CAQL Check, it's usually a good idea to preview the CAQL statement on a graph,
to preview the results, and edit the query until the results match the expectations.

- Create a new Graph: Analytics > Graph > New
- Add a CAQL Datapoint
- Expand the query editor

... and start editing the query.

In our example, we will compute a few percentile values from a `find()` query.

![](/images/caql/CAQL_check_preview.png)

### 2. Label the output streams

By default CAQL metrics are named `output[$i]`, where `$i=1,2,...` is the index of the output stream.

CAQL check use labels for the metric name outputs.
The default labels are not suitable for this, since they are not guaranteed to stay consistent in the future.
We might come up with better ways to label default outputs.

Instead we need to explicitly set a label using the `label()` function in order to change the metric name.

```
find("duration") | histogram()
| histogram:percentile(90, 99, 100)
| label("duration-p90", "duration-p99", "duration-max")
```

The attached labels can be inspected in view mode:

![](/images/caql/CAQL_check_labels.png)

> **Note:** At the time of this writing, there is no way to attach tags to CAQL metrics.

### 3. Create the CAQL check.

Once we are happy with the data and labels on the graph, it's time to create the CAQL check.
To do so:

1. Copy the query from the CAQL input field on the graph

2. Visit: Integrations > Checks > CAQL > Add New

3. Select the default broker.

4. Paste the query into the input box. Click: Test

5. The next page should look similar to this:  
   ![](/images/caql/CAQL_check_test.png)
   - Check that the metric names are as expected.
   - Rename the check and attach units as desired
   - Click: Create

6. You should see a Po-pup window, with a link to the Check page for the newly created CAQL Check.
   Click on the link.

In the next few minutes you should see data appearing on the metrics within the CAQL check.

![](/images/caql/CAQL_check_data.png)

You can now use the newly created CAQL metrics for graphing and alerting.
