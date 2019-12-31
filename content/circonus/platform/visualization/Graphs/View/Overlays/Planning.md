.

.

.

# Warning: {#Warning}
> This section of the manual is deprecated due to the release of new functionality and a new Graph Overlay interface. See [Capacity Planning](/Visualization/Graphs/View/Overlays/Analytics.md#CapacityPlanning) for a description of the new features.

.

.

.

# Planning and Forecasting {#PlanningandForecasting}
Planning and/or forecasting the future requires looking to the future.  The first step before using this overlay feature is to position your graph viewport to include a future timeframe for which you have no data.

![Image: 'graph_time_select_future.png'](/images/circonus/graph_time_select_future.png)

The easiest method is to use the date range selector to select the timeframe.  The date range should include both the data you wish to use to construct the planning model and the dates for which you would like forecast data.

**Advanced**:
> Another option is to view a satisfying amount of past data (like 2 weeks or 4 weeks) and use the keyboard hot-key '.' (period) to extend the end-date of the graph into the future by the desired amount (e.g. 1 year).

Once the correct range has been specified, you can navigate to add a planning overlay.

![Image: 'graph_view_forecast_add.png'](/images/circonus/graph_view_forecast_add.png)

Select 'Planning' and subselect 'Linear Regression' and then click 'Add Data Overlay'.

![Image: 'graph_view_forecast_values.png'](/images/circonus/graph_view_forecast_values.png)

This will add an overlay including the linear regression on each data point in the graph.  As you hover through time (including the future) you can see the values that are part of the selected regression model.

Sometimes, it can be useful to visualize the original data vs. the regression data more clearly by hovering over the A and B tabs to surface the visualized data.

![Image: 'graph_view_original_a.png'](/images/circonus/graph_view_original_a.png)

![Image: 'graph_view_linest_b.png'](/images/circonus/graph_view_linest_b.png)
