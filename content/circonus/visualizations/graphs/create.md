---
title: Creating
weight: 10
---

# Creating Graphs {#CreatingGraphs}
Circonus graphs are created and managed under the "Analytics" section.

![Image: 'trending_graphs_add3.png'](/images/circonus/trending_graphs_add3.png)

Clicking on the "New +" button will create a new graph.


## Finding Metrics {#FindingMetrics}
The first step of graph creation is to find and select a piece of data to visualize. As such, for new graphs, the data exploration tool is opened:

![Image: 'Add_Datapoint_dialog3.png'](/images/circonus/Add_Datapoint_dialog3.png)

You can create a new graph by adding a datapoint for a Metric, [Metric Cluster](/circonus/metrics/metric-clusters/), Guide, Composite, or [CAQL Statement](/CAQL). This section will cover finding Metrics.

![Image: 'graph_data_selection4.png'](/images/circonus/graph_data_selection4.png)

After clicking "Metric" in the Add Datapoint dialog, you can unfold the tree of metrics by clicking on the rightward facing triangles next to the check names.

![Image: 'metric_tree4.png'](/images/circonus/metric_tree4.png)

If there is only one child in the tree, it will auto-expand to the next level for your convenience.

Clicking the name of the metric will add that metric to the current graph. The first datapoint added to a new graph will prompt you to choose a title for the new graph:

![Image: 'set_graph_title.png'](/images/circonus/set_graph_title.png)

After setting the graph title, you will be returned to the edit screen where you can add more datapoints if you wish.

Once added, the metric will appear in the list with a star next to it:

![Image: 'metric_added.png'](/images/circonus/metric_added.png)

Scrolling down will show the graph that you are currently constructing:

![Image: 'initial_graph3.png'](/images/circonus/initial_graph3.png)

**Note:**
> To prevent accidental duplication, users are prevented from creating graphs with the same name as existing graphs.

If you wish to change the title of the graph after initial creation, open the Menu and choose "Edit Title".

![Image: 'edit_graph_title.png'](/images/circonus/edit_graph_title.png)


## Renaming Datapoints {#RenamingDatapoints}
Once a datapoint is added, you can click on the name to edit how it is presented in the legend.

![Image: 'graph_edit_datapoint_rename3.png'](/images/circonus/graph_edit_datapoint_rename3.png)

This does not rename anything about the datapoint or underlying data, just how it is presented in the legend.


## Advanced Adding {#AdvancedAdding}
When adding numeric data to a graph, you can use the numeric settings at the bottom of the metrics tree panel to set properties on the datapoint you're adding.

![Image: 'numeric_quick_add3.png'](/images/circonus/numeric_quick_add3.png)

The meaning of each of these options is discussed in the [numeric data section](/Visualization/Graph/Numeric).  Using this feature can turn the "add then modify" steps into a single step for most common datapoint manipulation needs.
