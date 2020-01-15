---
title:
---

# Graphing Composite Numerics {#GraphingCompositeNumerics}

There are times when the element to visualize is actually a manipulation of several other data points.  A simple example is showing free disk space when you are only collecting total disk size and used disk space (i.e. you need to graph the difference).

As an example, we will attempt to graph the total time between the first byte received of an HTTP document retrieval and the time to receive the complete document.  This would be the "duration" minus the "tt_firstbyte" (or time-to-first-byte).

![Image: 'select_metrics_for_composite3.png'](/images/circonus/select_metrics_for_composite3.png)

Adding these two metrics to the graph will result in their presence in the legend.

![Image: 'add_composite3.png'](/images/circonus/add_composite3.png)

In the Menu at the top right of the graph is an 'Add Datapoint' item. Select the 'Composite' datapoint type.

![Image: 'composite_editor3.png'](/images/circonus/composite_editor3.png)

This adds a datapoint to the legend named 'Composite 1' with an equation editor available under 'advanced'.  Once the 'Data' field has focus, previous numeric datapoints in the graph will be assigned a letter for use in your equation.  Here we wish to subtract tt_firstbyte (B) from duration (A).

![Image: 'composite_configured3.png'](/images/circonus/composite_configured3.png)

We update the formula to reflect our desired equation and change the name of the data point from 'Composite 1' to 'payload time' (using click-to-edit on the 'Composite 1' name).

This completes the configuration of the composite, but we no longer wish to see the original data points in the graph.  By clicking on the disable (crossed-circle) icon next to each data point in the legend, they will be visually removed from the graph (yet remain available for the composite).  Completely removing them will result in the composite no longer working.

![Image: 'composite_others_disabled3.png'](/images/circonus/composite_others_disabled3.png)

Once you've clicked on the disable icon, the icon will change to a check mark, providing a path to add the metrics back into the visualization if you desire.
