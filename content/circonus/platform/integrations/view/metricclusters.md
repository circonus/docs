---
title:
draft: true
---

# Metric Clusters {#MetricClusters}
A metric cluster is a dynamic groups of metrics that includes all metrics in the system that meet some set criteria which defines that metric cluster. Metric Clusters are used to add all metrics which match a search query to one graph, offering a way to group metrics for correlation and other algorithmic evaluations.

![Image: 'metrics_clusters3.png'](/images/circonus/metrics_clusters3.png)


## Create Cluster {#CreateCluster}

To create a Metric Cluster, navigate to the Analytics:Metric Clusters page and click "New +".

![Image: 'metrics_clusters_new3.png'](/images/circonus/metrics_clusters_new3.png)

You must add one or more search queries to determine which metrics will be members of the new cluster. Each query defines a search on the name of the metric (for example, maximum for all maximum ping times). The metrics which are currently matched by the search queries are called Member Metrics because they are members of this metric cluster.

If you enter more than one query, each query will be run separately and the results will be added to the member metrics. You may use wildcards (`*`). Also, you may choose how each query's metric values will be treated and rendered on a graph by choosing from among different types of data in the drop down menu (gauge, derive, etc.).

Each query is an "or" operation. For example, having a query for maximum and another query for minimum will result in a metric cluster containing all metrics either named maximum or named minimum.

![Image: 'metrics_clusters_example3.png'](/images/circonus/metrics_clusters_example3.png)

Once queries are defined, the cluster can be used in a graph.


## Editing Existing Graphs {#EditingExistingGraphs}
You can add an existing metric cluster to an existing graph by editing the graph navigating to the screen to edit the graph and clicking "Add Datapoint +". You can then select "+ Metric Cluster" and Circonus will list all metric clusters that you've used.

How the selected metric cluster will display on the graph varies between edit and view mode. When viewing a graph, there will be a line and entry in the graph for each metric that matched the cluster and a corresponding entry in the legend below. While editing a graph, there will be as a single datapoint in the legend, but multiple lines will appear on the graph.


## Cluster Health {#ClusterHealth}
Each member metric in a Metric Cluster has a Cluster Health value measured as a percentage. This measurement reflects how much the current signal resembles the majority of signals over the past 2 hours.

Clusters can be added to a dashboard by choosing the "Cluster Health" widget. This allows users to set a minimum threshold for this health percentage. The Cluster Health will appear as green when it is over the threshold and red when it is below the threshold. 


#### The Cluster Health Algorithm {#TheClusterHealthAlgorithm}
Cluster Health is calculated using a single algorithm. It takes 2 hours of time series data from each of the metrics and runs a linear correlation against them. It then walks the matrix to determine the covariance and uses a voting algorithm to allow metrics that are highly correlated to vote that other metrics are "bad."

**Note:**
> Cluster Health is being refined and this measurement may be replaced with a more sophisticated algorithm.
