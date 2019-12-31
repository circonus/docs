.

.

.

# Warning: {#Warning}
> This section of the manual is deprecated due to the release of new functionality and a new Graph Overlay interface. See [Graph Comparison](/Visualization/Graphs/View/Overlays/Analytics.md#GraphComparison) for a description of the new features.

.

.

.

# Multi-graph Overlays {#MultigraphOverlays}
Overlaying one graph atop another is a straightforward concept and exercise.

![Image: 'graph_view_pre_graph_overlay.png'](/images/circonus/graph_view_pre_graph_overlay.png)

From the view of a single graph, click on the overlay plus ('+') button.

![Image: 'graph_graph_overlay_add.png'](/images/circonus/graph_graph_overlay_add.png)

Select 'Existing Graph' and subselect the graph which should be overlaid.  Click 'Add Data Overlay' and the graph will be placed in front of the original graph in the graph viewport.

![Image: 'graph_view_post_overlay.png'](/images/circonus/graph_view_post_overlay.png)

As these graphs do not share metrics, we can see a sparse data layout in the legend.  Two metrics have values in the A column, but not the B column. The datapoint from the second graph exists in the B column, but not the A column.

**Note**:
> Requiring the Y-axis to align would make this feature almost unusable.  Comparing values from different graphs is a less common use-case than comparing trends.  The Y-axis from the A graph and the B graph are **not** the same.  This can be seen clearly by hovering over the A and B tabs as the graph-appropriate Y-axis labels will appear.
