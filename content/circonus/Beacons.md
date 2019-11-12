From the User Manual Index:

  1. Beacons: Working with Beacons (Real-Time OLAP)
   1. [Overview](/Data/Beacons.md)
   1. [Adding and Removing Beacons](/Data/Beacons/Add.md)
   1. [Beacons on Web Data](/Data/Beacons/WebHits.md)
    1. [Ingesting Web Data from Logs](/Data/Beacons/WebHits.md#IngestingWebDatafromLogs)
   1. [Ingesting Ad-Hoc Event Data with Beacons](/Data/Beacons/AdHoc.md)
    1. [Using circ-beacon-log](/Data/Beacons/AdHoc.md#Usingcirc-beacon-log)
   1. [Building Queries](/Data/Beacons/Queries.md)
    1. [Query Options](/Data/Beacons/Queries.md#QueryOptions)
    1. [Selecting Metrics and Filters](/Data/Beacons/Queries.md#SelectingMetricsandFilters)
    1. [Sharing Your Visualization](/Data/Beacons/Queries.md#SharingYourVisualization)
   1. [Sending data from a browser to a metric with beacons](/Data/Beacons/BrowsertoMetric.md)


# Beacons {#Beacons}

**Warning**
> Beacons are currently in beta and not fully supported.


## Overview {#Overview}
Beacons are Circonus's way of dealing with multi-dimensional, real-time data. Typical metric data comes in as numbers over which Circonus can build time-windowed statistical aggregates, or histograms.  Occasionally, data is too complex for this simple treatment, and so Beacons are used to handle this data.

A common web-based example and a more systems-oriented database query example are outlined below and will help illustrate the type of information handled with Beacons.


### Web-based Example {#WebbasedExample}
Each time a user visits your website, there is a variety of information available regarding the user's system, location, and interest, as well as telemetry such as performance characteristics. Concrete examples of each of these are the type and version of the user's browser, the user's IP address, geographic location, and ISP, the page the user is viewing, the referring site, and all of the measurements from the web timing specification.

Using Beacons, you can collect this information from visitors and apply real-time, complex queries to that data.


### Database Query Example {#DatabaseQueryExample}
Circonus Beacons do not care about the specific dimensions of your data. While in the above example we use dimensions very specific to web browsing, we could instead use database specific dimensions. Using beacons we can track every database request, the type of request (SELECT/UPDATE/DELETE), the client that issued the request, the number of tuples involved, and the duration of the statement.

As in the web example, we can use the Beacon tools to build complex real-time queries against this data.

**Note:**
> This example assumes that your database has the ability to log all such information.  Obviously, Circonus can only process data it can see.


# Adding and Removing Beacons {#AddingandRemovingBeacons}

**Warning**
> Beacons are currently in beta and not fully supported.

![Image: 'beacon_plus.png'](/assets/beacon_plus.png?raw=true)

Click the 'New Beacon' button to add a beacon to the system.  This will open a dialog wherein you name your beacon.  This should be a short, concise name for the new beacon.

![Image: 'beacon_add.png'](/assets/beacon_add.png?raw=true)

Once added, the beacon will show in the list of beacons.  Here we added a beacon called "Main Website".

![Image: 'beacon_added.png'](/assets/beacon_added.png?raw=true)

The ID of the beacon ('zhezhc' in the above example) is the unique identifier for this beacon and is used to connect external services, scripts, and tools to this beacon.

![Image: 'beacon_delete.png'](/assets/beacon_delete.png?raw=true)

To delete a beacon, expand the row and hover over the bomb icon to access the 'Delete Beacon' button.


# Beacons on Web Data {#BeaconsonWebData}

**Warning**
> Beacons are currently in beta and not fully supported.

The most common way to submit Beacon data from your site is with Javascript. Simply insert the following code before the closing `</body>` tag of each page:

```
<script type="text/javascript">
<!-- 
var _lsb_token = 'TOKEN';
(function() {
  var _lsb_script = document.createElement('script');
  _lsb_script.type = 'text/javascript'; _lsb_script.async = true;
  _lsb_script.src = document.location.protocol + '//b.circonus.net/b.js';
  var _lsb_s = document.getElementsByTagName('script')[0];
  _lsb_s.parentNode.insertBefore(_lsb_script, _lsb_s);
})();
-->
</script>
```

Simply replace "TOKEN" with the ID of the Beacon which is collecting the data. To view code snippets which are ready for you to copy & paste into your pages, use the “show embed” links below.


## Ingesting Web Data from Logs {#IngestingWebDatafromLogs}
While less robust, interesting data can be taken from server logs. The server cannot see how long a page took to deliver, only how long it took to generate. It also cannot measure other client-side timings, such as any of the [W3C Resource Timings](http://www.w3.org/TR/2011/WD-resource-timing-20110524/) that are available in the Javascript embedding method above. Still, if there is some reason that the Javascript method cannot be employed, real-time web server log data can be massaged into Beacon data.


### Installing circ-beacon-log {#Installingcircbeaconlog}
The tool for submitting log data is called `circ-beacon-log`. It is available for download from github here: [https://github.com/omniti-labs/circ-beacon-log](https://github.com/omniti-labs/circ-beacon-log). This tool requires the `node.js` runtime which can be downloaded from [http://nodejs.org/](http://nodejs.org/).

The `circ-beacon-log` tool uses a plug-in style log processor, allowing you to read new and proprietary log formats. A plugin called `apache-clf` ships with the tool and is used as both an example and as a working processor for the Apache Common Log Format.

**Note:**
> If your `node` interpreter was installed in a location other than `/usr/bin/node`, you may need to update the first line of the `circ-beacon-log` script to reflect the correct `node.js` install location.


### Setting up Apache {#SettingupApache}
Put `circ-beacon-log` and `apache-clf` somewhere convenient (in the example below they have been 
placed in `/www/bin`) and put the following two lines in your Apache conﬁguration 
ﬁle:
```
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\" %D" circonus
CustomLog "|/usr/bin/node /www/bin/circ-beacon-log -t TOKEN -p apacheclf -b hit" circonus
```

**Note:**
> The %D argument is only available on Apache 2.2 and later. This argument is optional, so you can leave it off if you're using 2.0 or earlier.

**Note:**
> The LogFormat and CustomLog lines are each a single line, but may have been  wrapped for formatting purposes.

You'll need to replace "TOKEN" with your Circonus beacon token, and you may need to 
change the invocation "`/usr/bin/node`" to reﬂect where you have `node.js` installed.
If you want to use the [event type](/Data/Beacons/AdHoc.md) (rather than hit) in your beacon query, change the -b argument to "event" in the CustomLog command line.


## Histogram Data Directly From Beacons {#HistogramDataDirectlyFromBeacons}
It is possible to automatically generate [histograms](/Visualization/Graphs/View/Histograms.md) of web data from Beacons.

First, create an [HTTPTrap check](/Data/CheckTypes.md#HTTPTrap). The check will be assigned a `check_id`. This is the number in the URL which you will see when you visit that check in the UI.

Next, you will need to create a [beacon token](/Data/Beacons/Add.md), unless you choose to use an existing one.

Your web page should already include the `//b.circonus.net/b.js` load. Add the following to your web page:

```
var ev2 = new LSBeacon('//<TOKEN>.b.circonus.net/_', false);
ev2.trigger('check', {
  id: '<CHECKID>',
  metric: '<METRICNAME>',
  _type: 'n',
  _value: '<VALUE>'
});
```

Replace the following variables in the above example with the appropriate values:
 * <TOKEN> - This is your beacon token.
 * <CHECKID> - This is the ID the HTTPTrap to which the data will be proxied.
 * <METRICNAME> - Select and appropriate name for your metric here.
 * <VALUE> - This is a numeric value.

Once this change is pushed live on your web page, the browser will hit Circonus's beacon server and push that data to your HTTPTrap check and the metric will be collected.

You can now enable [histogram collection](/Visualization/Graph/Histograms.md) for that metric. You can push as much data to it as you like and Circonus will create histograms. If you have sufficient data volume, you can also utilize the real-time features.


# Ingesting Ad-Hoc Event Data with Beacons {#IngestingAdHocEventDatawithBeacons}

**Warning**
> Beacons are currently in beta and not fully supported.

The Beacon system allows submission of data in two forms.  The first is a rigid format called "hit" which represents aspects of a web request and was covered in the previous section.  The second form of data is called an "event" and is designed to accommodate ad-hoc data.


### Event Beacon Fields {#EventBeaconFields}

| event type | numeric data | text data |
|---|---|---|
| key | value_numeric | value_text |
| | u1_numeric | u1_text|
| | u2_numeric | u2_text|
| | u3_numeric | u3_text|
| | u4_numeric | u4_text|
| | u5_numeric | u5_text|

The "event" form has several fields that are available for arbitrary use. The `key` field is designed to be a descriptor of the event itself. It should describe the "type" of the event you are sending.  Coupled with that are 6 numeric fields and 6 text fields for your use.  These fields can be used in any way you see fit, but must be consistent for a given value of `key`.


## Ad-hoc Data from Web Clients {#AdhocDatafromWebClients}

The Javascript API can be used to trigger ad-hoc events to the Beacon service.

```javascript
<script type="text/javascript" 
        src="http//b.circonus.net/b.js"></script>
<script type="text/javascript">

  // Create a "hit" and send it to the server
  var hit = new LSBeacon('TOKEN/hit', true);

  // Create a new "event" and postpone sending it
  var ev1 = new LSBeacon('TOKEN/event', false);
  // Set some dimensions
  ev1.add('key', 'some_event');
  ev1.add('value_numeric', 1000);
  // Send it up
  ev1.send();

  // Repeat again with another event.
  var ev2 = new LSBeacon('TOKEN/event', false);
  ev2.add('key', 'another_event');
  ev2.add('value_text', '3 seconds');
  ev2.send();

</script>
```

The above example is the manual form of web data. Line 6 will trigger a regular user hit with all of the regular information associated with a "hit."  The two following examples are custom "events" that indicate something of interest happening on your site.


## Using `circ-beacon-log` {#Usingcircbeaconlog}

If you do not have circ-beacon-log installed, follow the instructions in [Installing circ-beacon-log](/Data/Beacons/WebHits.md#Installingcirc-beacon-log) before continuing on.

That section will cover how to write a circ-beacon-log plugin and how to leverage the "event" type in Beacons to represent that data.  The purpose of a circ-beacon-log plugin is to translate log messages into a Javascript object with [event keys](/Data/Beacons/AdHoc.md#Eventbeaconfields).



# Building Queries {#BuildingQueries}

Once a beacon is created and data is being submitted to it, you need to build a query to visualize what is going on.

**Warning**
> Beacons are currently in beta and not fully supported.

Go to the Beacons page. Expand the beacon you are using and you will see an "Add Query" button.

![Image: 'beacon_add_query.png'](/assets/beacon_add_query.png?raw=true)

Clicking this button will take you to the query editor, where you can build two types of visualizations; maps and tables.  The setup process for both types is very similar:

 1. Select the visualization type.
 1. Select your query options.
 1. Configure your metrics and filters.


## Query Options {#QueryOptions}

There are 2 main items to select in the query options.

First is the data type. This is the data that you are feeding into the beacon and it can be either [page hit data](/Data/Beacons/WebHits.md) or [custom events](/Data/Beacons/AdHoc.md).

Next is the timeframe.  This creates a sliding window showing either 1 minute or 30 minutes of your data.  As the data ages older than the window, it falls out of scope and is no longer used.  For high volume data we recommend 1 minute windows.  The data you see in your visualization is a snapshot that occurs every 5 seconds of this window.

Table visualization types have a 3rd option which is simply the number of results to show.


## Selecting Metrics and Filters {#SelectingMetricsandFilters}

Step 3 asks you to choose which metrics you want to display.  Think of the metrics like a select list in an SQL query.

Maps limit you to 2 metrics.  The primary metric controls the intensity (or opacity) of the highlighted country / state.  If we assume impressions, the system takes the number of impressions for a highlighted region, compares that to your total impressions and then creates an opacity percentage based on that.  The secondary metric controls the color.  By default this is green to red, but it can be configured while viewing the map (see below).  Following the impressions example, the second metric would be the average page load time for all visitors from the highlighted area.

Tables allow you to select as many metrics as you want; each metric is another column on the table.

Filters allow you to refine the data you want to visualize.  These are like a where clause in SQL.  Simply select the metrics from the drop down, and then select the operator and enter a value.

Examples of configuration screens for each type:


### Maps {#Maps}

![Image: 'beacon_map_query.png'](/assets/beacon_map_query.png?raw=true)


### Tables {#Tables}

![Image: 'beacon_table_query.png'](/assets/beacon_table_query.png?raw=true)


## Changing Map Colors {#ChangingMapColors}

If you don't like the default green to red color transition on maps, you can select any color and thresholds you like.  First, open up the view page for the map.  In the upper right you will see an Edit Colors button.

![Image: 'beacon_view_options.png'](/assets/beacon_view_options.png?raw=true)

Clicking this button opens a dialog with a color gradient and values showing where the colors transition.

![Image: 'beacon_map_edit_colors.png'](/assets/beacon_map_edit_colors.png?raw=true)

You can click on the values and edit them, moving them up and down the color range.  If you hover over the bar that corresponds to each value, it will expand into a box. Click that box and a color picker will open, allowing you to select the color you want.

![Image: 'beacon_map_colorpicker.png'](/assets/beacon_map_colorpicker.png?raw=true)


## Sharing Your Visualization {#SharingYourVisualization}

Beacon visualizations can be shared, just like graphs and worksheets, with users without Circonus logins.  To do so, go to the view page of your visualization and you will see a Share button in the upper right.

![Image: 'beacon_share.png'](/assets/beacon_share.png?raw=true)

Clicking the button opens a share dialog.

![Image: 'beacon_share_dialog.png'](/assets/beacon_share_dialog.png?raw=true)

Simply give the shared version a name and click Save.  This will populate a link in the field below in the "Existing Shares" section. You can hand out this link.  Click Remove, located beside the link, to revoke it.



## Sending Data from a Browser to a Metric with Beacons {#SendingDatafromaBrowsertoaMetricwithBeacons}

**Warning**
> Beacons are currently in beta and not fully supported.


 1. Setup an httptrap check and note the check_id in your web page to load the beacon javascript.
```
var token = ‘hdfu4tgobygm4a'
var ev4 = new LSBeacon(token + '/_', false);
ev4.trigger('check', {'id’:checkid,'metric':'webmetric','_type':'n',’_value’:  value});
```
 1. Replace the token with your beacon token.
 1. Replace checkid with the checkid of the httptrap check.
 1. Change the metric name from the default "webmetric" to an individualized name.

The data will be fed into the httptrap check's metrics.
