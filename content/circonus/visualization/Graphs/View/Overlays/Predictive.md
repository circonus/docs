---
title:
---

.

.

.

# Warning: {#Warning}
> This section of the manual is deprecated due to the release of new functionality and a new Graph Overlay interface. See [Capacity Planning](/Visualization/Graphs/View/Overlays/Analytics.md#CapacityPlanning) for a description of the new features.

.

.

.

# Prediction Overlays {#PredictionOverlays}
Predicting future behavior is the holy grail of numerical analysis.  The short story is that it is rarely perfect and never a silver bullet.  However, certain prediction models do a respectable job at short-term numerical prediction.

It is important to note the different between prediction and planning/forecasting.  Planning/forecasting uses a regression model to predict **long term** future behavior based on past trends.  Prediction uses a variety of techniques to best guess about reasonable expectations for the **immediate** future.  The idea of predicting tomorrow is very difficult, whereas setting expectations for the next 5 minutes or 1 hour is more within the capabilities of an online prediction system.

The first step in using prediction is to select a time range that is of interest. Again, going much more than 1 hour into the future will yield results that are likely radical and certainly meaningless.

![Image: 'graph_view_plus_small_future.png'](/images/circonus/graph_view_plus_small_future.png)

Here is a graph with about 1 hour of future included:

![Image: 'graph_view_predictive_add.png'](/images/circonus/graph_view_predictive_add.png)

Selecting the 'Predictive' overlay option and subselecting the prediction model 'Seasonal Additive' and then clicking 'Add Data Overlay' will add a prediction window overlay.

![Image: 'graph_view_overlay_predictive.png'](/images/circonus/graph_view_overlay_predictive.png)

Now we see an envelope of expected behavior over time.  Yellow bands are added to the visualization to assist in quickly determining specific time ranges that fall outside of the prediction model.


## Prediction Models {#PredictionModels}


### Seasonal Additive {#SeasonalAdditive}

The seasonal additive model uses a three season exponential regression model. Each season is weighted differently and added together.


### Seasonal Multiplicative {#SeasonalMultiplicative}

The seasonal multiplicative model uses a three season exponential regression model. Each season is weighted differently and multiplied together.
