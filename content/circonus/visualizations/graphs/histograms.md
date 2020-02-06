---
title: Histograms
weight: 60
---

# Histogram Visualizations {#HistogramVisualizations}
In addition to simple numeric data, Circonus can ingest data and retain histograms. On the Support Portal, you can find a [video](https://support.circonus.com/solution/articles/6000044550-video-all-about-histograms) describing histograms.

Histograms in Circonus maintain two digits of precision in base 10. 

For more information, refer to the overview in the [Histograms](/Visualization/Graphs/View/Histograms) section.


## Enabling histogram collection {#Enablinghistogramcollection}
In order to visualize data in histogram form, you must enable histogram collection for the numeric metric in which you are interested.

Navigate to the appropriate check, and from the Menu at top right, choose the "[Change Brokers & Metrics](/circonus/checks/edit/#Changingmetriccollection)" item. The stacked boxes (if available) allow you to enable collection of data in histogram form. Textual data cannot be collected in histogram form.


## Adding a histogram to a graph {#Addingahistogramtoagraph}
In the metric tree, histograms are denoted by a multi-bar icon.  Clicking "Add" will place a star on the metric and add it to the graph in a fashion similar to numeric data.

![Image: 'metric_tree_histogram3.png'](/images/circonus/metric_tree_histogram3.png)

Once the histogram is added, the graph will appear just as it does with numeric graph creation.

![Image: 'graph_histogram_initial3.png'](/images/circonus/graph_histogram_initial3.png)

The advanced section contains both formula and minimum resolution options identical to those for numeric data.

![Image: 'histogram_advanced3.png'](/images/circonus/histogram_advanced3.png)
