---
title: Editing
weight: 30
---

# Editing a Check {#EditingaCheck}

## Navigating to the Check {#NavigatingtotheCheck}

Throughout the interface, metric and check information will be combined into graphs, worksheets, and alerting information.  Any place you see a link labeled "view check", you will be delivered to the Primary Check View for that check (see below)

The most straight forward way to navigate to the primary view for a check is to click _Checks_ from the _Integrations_ section of the main menu. That will take you to the grid of our service integrations. Use the search field at the top to search across all integrations, or click the integration type of the check you're looking for and you'll be taken to the specific Integration module page where you can find your check.

![Image: 'data_checks4.png'](/images/circonus/data_checks4.png)

Click the "View" button on the check in the list to go to the Primary Check View.

### Primary Check View {#PrimaryCheckView}

![Image: 'primary_check_view3.png'](/images/circonus/primary_check_view3.png)

The primary view gives all the pertinent metadata about the check, including key aspects of its configuration, the broker it runs on, time of last modification, and its current status. Below this is a list of metrics being collected or available for collection.

The Status column has up to two icons for each metric, indicating the following information:

![Image: 'numeric_off_rev1.png'](/images/circonus/numeric_off_rev1.png) This metric is not being collected by Circonus.  
![Image: 'numeric_on_rev1.png'](/images/circonus/numeric_on_rev1.png) This metric is being collected in text or numeric form (whichever is appropriate).  
![Image: 'hist_off_rev1.png'](/images/circonus/hist_off_rev1.png) Histogram collection is available for this metric, but is not enabled.  
![Image: 'hist_on_rev1.png'](/images/circonus/hist_on_rev1.png) Histogram collection has been enabled for this metric.

Metrics that have no histogram icon are text metrics, so histogram collection is not applicable.

## Change Check Name {#ChangeCheckName}

![Image: 'primary_check_view_name3.png'](/images/circonus/primary_check_view_name3.png)

The name of the check may be changed by choosing "Edit Title" from the Menu at top right.  Click "Save" to save the new name.

## Changing Configuration {#ChangingConfiguration}

![Image: 'primary_check_view_edit3.png'](/images/circonus/primary_check_view_edit3.png)

Choosing "Configure Check" from the Menu at top right will take you back through the config wizard.

## Changing Metric Collection {#Changingmetriccollection}

![Image: 'primary_check_view_brokers3.png'](/images/circonus/primary_check_view_brokers3.png)

To instantiate this check on a new broker and/or change which metrics are collected, choose "Change Brokers & Metrics" from the Menu at top right. The available Metrics list is replaced with a three-column view showing the available Brokers, the selected Metrics, and a Total Usage calculation. The total number of metrics is the product of the number of brokers and the number of metrics to collect.

The net change in metrics collected will be noted in the Total Usage column.

**Note:**
> Metrics from checks are unique based on their perspective.  If you move a check from one broker to another you are actually enabling a new check on a broker and disabling the old one.  You will find two sets of metrics in the system (one for each broker) and they will require individual treatment with respect to visualization and alerting.

To change brokers, select or deselect brokers in the leftmost column.

![Image: 'primary_check_change_brokers3.png'](/images/circonus/primary_check_change_brokers3.png)

To activate or deactivate collection of one or more metrics, click one of the selection icons next to its name. Numeric metrics may be collected as a single value per measurement or as a histogram. They may not be collected as both concurrently.

![Image: 'primary_check_change_metrics3.png'](/images/circonus/primary_check_change_metrics3.png)

## Metric Details {#Metricdetails}

Each of the metrics in the "Metrics" section has a "View" button for accessing details for the metric.

![Image: 'primary_check_metric_detail_view3.png'](/images/circonus/primary_check_metric_detail_view3.png)

The details page includes much of the same metadata as the primary check view, as well as a graph of the metric's value over time, if it is being collected.

![Image: 'primary_check_metric_detail3.png'](/images/circonus/primary_check_metric_detail3.png)

The Menu at top right contains options for working with this metric:

* "Set Rules" will allow you to configure rules for alerting on this metric.
* "Quick Graph" will create a new graph with this data point in it that can be subsequently saved and manipulated.

Select "View Check" to return to the Primary Check View.
