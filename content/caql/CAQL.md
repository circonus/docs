# Circonus Analytics Query Language (CAQL) {#CirconusAnalyticsQueryLanguageCAQL}
The Circonus Analytics Query Language (CAQL) allows the user to create customized transformations of the stream of incoming metrics. To do so, CAQL provides a set of primitive transformations (functions), that can be composed using a declarative dataflow programming language.

The primitive transformations include basic arithmetic, delays, and smoothing, as well as more complex transformations like anomaly detection. A complete set of built-in CAQL [functions](/caql_reference.md#FunctionTables) can be found in the [CAQL Reference Manual](/caql_reference.md) (a subsection of this user manual). This set of functions is constantly expanding as we are adding more functionality into the language.

Currently CAQL statements can only be applied to historic data displayed in graphs. CAQL based alerting is in development.


## Getting Started {#GettingStarted}
In addition to the instructions provided below, you can refer to the [CAQL Tutorial](https://support.circonus.com/solution/articles/6000055846-caql-v1-0-tutorial) on the Support Portal, which includes a video demo.

To create your first CAQL statement, create a new graph and select "CAQL" from the "Add Datapoint" menu. Expand the legend bar to see the CAQL input field. Clicking the "f(x)" link at the top right corner of the input field will bring up a tooltip that shows some of the most used CAQL functions.

![Image: 'CAQL_Tooltip3.png'](/assets/CAQL_Tooltip3.png?raw=true)

To add a data source into the CAQL statement, you need to add a metric statement of the form:

 * `metric:<kind>("<checkuuid>", "<metricname>")`

where `<kind>` describes the rollup kind (e.g. `average`, `derivative`, `counter`, or `histogram`). The first row of the tooltip can be used to add the appropriate template string.

If the statement is valid, you should be able to see the data appearing on the graph. If not, an error message will appear with hints about the problem with the statement. You can press Shift+Enter to test the query while remaining in the input box.


#### Examples: {#Examples}
Now that you have successfully added some data into the graph, try one of the following example cases:

 * `metric:<kind>("<checkuuid>", "<metricname>") | delay(1h)` - This statement delays the data by 1h.

 * `metric:<kind>("<checkuuid>", "<metricname>") | rolling:mean(3h)` - This statement displays the arithmetic mean of the preceding values in a specified time window, in this case 3 hours.

 * `metric:<kind>("<checkuuid>", "<metricname>") | anomaly_detection(50)` - This statement applies anomaly detection to the preceding data. This time, it shows the default sensitivity of 50%.

 * `metric:<kind>("<checkuuid>", "<metricname>") | ismissing()` - This statement returns 1 if there is a missing datapoint in the preceding data, and returns a 0 otherwise.


### Handling Histogram Data {#HandlingHistogramData}
When handling histogram data, it is important to note that only the `histogram:*` methods (refer to the table of Functions below) apply directly to histogram data, and transform it into numeric values.

Conversely, you can can convert a numeric metric into a histogram using `window:histogram()`.

At first, it is best to get your data into the graph using a single `metric:histogram` statement. If you select a time range of no more than a 2 days duration, you should be able to see the plain histogram data on your graph.


## Known Issues in CAQL {#KnownIssuesinCAQL}
CAQL datapoints do not show up in a graph overview page.

 * This can occur if the selected time range is too large, due to a timeout or resource limit. The current limits are 1 day for histograms and 4 weeks for numeric data. Try selecting a shorter time period.

Statements involving the window function are lagging behind the actual data.

 * Windowed methods always operate on the most recent fully completed window. Therefore, they lag behind the incoming data by a delay up to the window size.


## Additional CAQL Information {#AdditionalCAQLInformation}

 * [Reference Manual](/caql_reference.md) - Refer to the CAQL Reference Manual page in this User Manual for more information, including a detailed description of CAQL functions.

 * Overlays - The "[Graph Overlays](/Visualization/Graphs/View/Overlays.md)" Overview section and [Analytics Overlays](/Alerting/Transforms.md)" section in this User Manual describe how to add Overlays to Graphs, and CAQL expands on that functionality.

 * [CAQL Articles](https://support.circonus.com/support/solutions/folders/6000191056) - These articles on the Support Portal provide recipes and other tips for using CAQL, including the [CAQL Tutorial](https://support.circonus.com/solution/articles/6000055846-caql-v1-0-tutorial)
