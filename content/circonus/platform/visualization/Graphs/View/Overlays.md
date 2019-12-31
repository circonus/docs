# Graph Overlays {#GraphOverlays}
Graph overlays allow you to view data related to a graph atop the graph itself.  One of the questions constantly faced by data analysts is "what did this look like last week?"  When answering that question in most tools, the approach is to rewind the time window by 7 days and "take a guess" or draw both graphs (current view and current view minus seven days) side-by-side. Graph overlays allow you to view both graphs in the same viewport and directly compare the data visually and numerically via the legend.


## Adding Graph Overlays {#AddingGraphOverlays}

![Image: 'graph_view_overlay_plus3.png'](/images/circonus/graph_view_overlay_plus3.png)

Graph overlays are accessed in the standalone graph view of every graph via the plus button above the upper right corner of the graph viewport.

![Image: 'graph_view_time_overlay_add3.png'](/images/circonus/graph_view_time_overlay_add3.png)

Adding an overlay requires selecting the type of overlay and completing any selection requirements.  Here, we'll select a 'Comparison' type and add a time overlay with a '1 week prior' offset.

![Image: 'graph_view_overlay_compare3.png'](/images/circonus/graph_view_overlay_compare3.png)

Once an overlay has been added to a graph, tabs (A, B, C, etc.) will appear directly above the viewport indicating each of the overlays added.  If you do not like the ordering, you can drag-and-drop the tabs to reorder them.


## Removing Graph Overlays {#RemovingGraphOverlays}

There is an 'x' on the right side of every overlay tab (except the reference graph itself).  Clicking this 'x' removes the tab.


## Reading Graph Overlays {#ReadingGraphOverlays}

The legend has titles that include both the date (useful for understanding time comparisons) and the tab letter indicator (A, B, C, etc.).  This helps keep the frame of reference so we know which column is which.

As you hover, the legend auto-updates with the current values with an additional indicator describing the variance between the two graphs for each corresponding data point. An icon pointing up or down indicates if the value is above or below the reference value. A percentage difference is available below the icon.  Additionally, the intensity of the arrow will change (becoming darker or lighter) as the difference increases or decreases.

The graphs are overlaid from left to right (B "on top of" A and so on).  This means that the right-most tab will be the clearest graph and each subsequent graph "underneath" it will be faded.  This can lead to difficulty determining which graph is which.  To help pull graph data to the front, you can hover over a tab and it will intensify only that graph overlay.

![Image: 'graph_view_overlay_highlight_a3.png'](/images/circonus/graph_view_overlay_highlight_a3.png)

![Image: 'graph_view_overlay_highlight_b3.png'](/images/circonus/graph_view_overlay_highlight_b3.png)


## Saving Graph Overlay Sets {#SavingGraphOverlaySets}

Once a graph overlay set (one or many) have been configured, you can save the configuration for quick recall.

![Image: 'graph_view_overlay_save3.png'](/images/circonus/graph_view_overlay_save3.png)

Click on the menu button next to the plus button to manage your overlay sets. Name the overlay and click save.

![Image: 'graph_view_overlay_recall3.png'](/images/circonus/graph_view_overlay_recall3.png)

Later, upon returning to the graph, you can click the same menu button and your named overlay will be available for view (or removal).

**Note**:
> Overlay sets modify the URL in a way that can be bookmarked in your browser.  This makes it possible to use traditional browser bookmarks to jump directly to graphs of interest with the overlay sets already in place.
