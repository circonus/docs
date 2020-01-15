---
title:
---

# Sharing Graphs and Worksheets {#SharingGraphsandWorksheets}

Graphs and worksheets can be very useful to a plethora of users, and not only those that have accounts with Circonus.  If you need to share data with a business unit that doesn't normally have access, or perhaps a vendor to whom you want to point out a problem, Circonus allows you to share graphs and worksheets via an external link that requires no authentication.


## Sharing Graphs {#SharingGraphs}

To share a graph, first go to the "view" page for that graph and click on the "Menu" button.

![Image: 'graph_share_view3.png'](/images/circonus/graph_share_view3.png)

This opens a dialog with various options for how you want your shared version to look and act.  You can also manage other, existing shares from this dialog.

![Image: 'graph_share_new3.png'](/images/circonus/graph_share_new3.png)

The "Current Shared Versions:" option lets you select previously configured shares, or you can create a new one by providing a nickname.

The "Features:" options let you turn on and off various features of the graph.  You can choose to hide the title, the legend or either axis.

Locking the date range allows you to only share a portion of your data.  Leaving this off will allow users to select any date or timeframe of data to view.  Locking the date only gives them access to what you would like them to see.  The "Past" option lets you give them a sliding window of data, going from now into the past.  The "Range" option lets you specify an exact date / time range.

Once you select your options and click "Save New", you will see that the standalone and embeddable URL fields are populated.  From here and when editing any share, you can disable or remove the shared link to prevent users from accessing it further.

![Image: 'graph_share_saved3.png'](/images/circonus/graph_share_saved3.png)

The standalone URL is useful to hand out to users who just want to view one graph every now and then.  The embeddable URL works great with internal status pages or other sites that your users might go to and want a graph on.


## Sharing Worksheets {#SharingWorksheets}

Worksheet sharing works almost identically to graph sharing, just with slightly different features that can be enabled or disabled.  Like graphs, first navigate to the worksheet view page and click the "Share" button.

![Image: 'worksheet_share_new3.png'](/images/circonus/worksheet_share_new3.png)

Select the shared version you wish to edit, or select new and provide a nickname.

You can choose to hide the title of the worksheet, as well as to disable legends.  On worksheets, legends only show when you hover over each individual graph.

The "Columns:" option lets you specify how many columns of graphs to show (this will impact the width of the graphs). The more columns you want, the smaller the graphs will be.

Just like in graphs, you can lock the date range to a sliding window into the past, or to a particular date range.

Click "Save New" and your URLs will be populated and ready to hand out.  From here and when editing any share, you can disable or remove the shared link to prevent users from accessing it further.

![Image: 'worksheet_share_saved3.png'](/images/circonus/worksheet_share_saved3.png)
