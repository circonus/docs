# Histograms {#Histograms}

Histogram visualizations in Circonus use a technique called "heat maps."  A typical histogram will take many values and place them into bins, representing those bins in a bar chart or pictogram.

On the Support Portal, you can find a [video](https://support.circonus.com/solution/articles/6000044550-video-all-about-histograms) describing histograms.

For more information on Histograms in Circonus, refer to the Support Portal and to the section on [Histogram Visualizations](/Visualization/Graph/Histograms.md) in this User Manual.


## What is a Histogram? {#Whatisahistogram}

Let's assume we have a set of numbers: {11, 17, 21, 21, 23, 26, 28, 29, 31, 31, 33, 34, 36, 36, 36, 41, 42, 43, 44, 47, 49, 49, 49, 50, 51, 51, 56, 57, 63, 64, 68, 73, 74, 78, 82, 85}.  We've witnessed these numbers over a period of 1 minute. (For example, let's say they are latencies on database queries in ms, or let's say they are the signal strength of connected wireless client, or let's say they are abandonment times for a website, etc.)

Understanding that the average (or arithmetic mean) of these numbers is 45.25 (their sum, 1629, divided by number of elements in the set, 36) and that the standard deviation is approximately 19.06 tells us something about the data set.  However, these number can be quite misleading. The standard deviation has strong and telling properties on *normal distributions* of data.  Real data, in complex systems, rarely presents itself as a normal distribution.

![Image: 'traditional_histogram.png'](/images/circonus/traditional_histogram.png) To better understand the distribution, we can use histograms.  By taking the above data and placing numbers in bins of 5 ([/10-15.md](/10-15.md), [/15-20.md](/15-20.md), [/20-25.md](/20-25.md), etc.), we can then plot the count of samples in each bin. We arrive at a traditional histogram.  This classic histogram is illustrated to the right.

This histogram shows the population distribution of the data in question.  Within Circonus, we wish to show this richness of data with time as an added dimension. This requires using a visual dimension other than height or width, so we choose color (or more specifically, saturation).

![Image: 'traditional_histogram_colored_rev1.png'](/images/circonus/traditional_histogram_colored_rev1.png) By coloring the histogram, we can provide a visual indicator based on something other than height.  In the sample illustration to the left, we can see that those bins with no data [and [90-95) are white and as you progress through each bin, the color (blue in this case) is more saturated when the bin contains more samples.  The darkest of the blues are for the 3 bins containing four samples each.  Each bin is assigned a color saturation level according to the number of samples it contains.

For the next step, we need to eliminate the use of height (so that we free up a graph dimension for the visualization of time).  As you can see, if we made all of the bars in the histogram the same height, we can still see the distribution of data based on color saturation.

[[Image(histogram_color_only_rev1.png,left)](/0-5).md)] The darker bars here have more samples.
It can take some practice to read this sort of output, but Circonus provides a heads-up display for translation to make this easy.

It is clear in this histogram, that we can no longer easily tell the exact frequency values (because humans can measure spacial differences more accurately than color differences).  As the height has no meaning, we can eliminate the height completely:

![Image: 'histogram_flat_rev1.png'](/images/circonus/histogram_flat_rev1.png)

This is often called a "sparkline" in the visualization world. This line of color points can be considered a terse visual representation of the population density of a given set of samples.


### Adding in Time {#Addingintime}

![Image: 'histogram_slice_rev1.png'](/images/circonus/histogram_slice_rev1.png)

In every Circonus view, time is presented as "progressing" along a horizontal axis; left is "before" right, right is "after" left (just like a timeline).  In order to show histograms over time, we need to rotate the histogram sparkline vertically.  Each of these vertical color strips represents a set of samples over a period of time.  Like the typical numeric graphs, that time period depends on your zoom level.

If you are zoomed out to a year view, those may be 1 day periods, if you are zoomed into a window covering only an few hours, those could be 1 minute periods.

Further details concerning how to understand these in Circonus graphs can be demonstrated in the context of actual histogram graphs.


## The Histogram View {#TheHistogramView}

![Image: 'histogram_view3.png'](/images/circonus/histogram_view3.png)

In the above screenshot, the mouse is hovering in the !4:00 to !8:00 time range of the graph.  The orange rectangle highlights one histogram represented vertically using color saturation (as described above).

The same histogram is represented in the heads-up display in the upper right portion of the viewport (highlighted by the purple rectangle).  As you move your mouse left and right along the axis representing time, this viewport will update with the traditional histogram representing the samples during the corresponding time period.

The axes in the traditional histogram are the frequency (number of samples in a bin) on the vertical axis (here listed as a maximum of 461) and  the numeric value of the metric being visualized on the horizontal axis (which is the same as the vertical axis in the primary graph viewport.

In other words, the process described in the [What Is a histogram](/Visualization/Graphs/View/Histograms.md#Whatisahistogram) section above is reversed to create the traditional histogram in the heads-up display (in the purple rectangle) from the vertical time period currently pointed to by the cursor (in the orange rectangle).


### The Legend {#Thelegend}

The legend displays information regarding the currently highlighted region of data.  As the cursor moves left and right through time, the legend will update with the corresponding date in the table title and update the value of the histogram datapoint in the legend itself.  Moving up and down through the metric value range will cause the legend to identify to which bin you are pointing ([- 1.4](/1.3.md) in the above example).

More information about the selected bucket is displayed next to the range, including the total number of samples collected over the time range and the number in the currently inspected bin (191 out of 1584 in the example). To the right of that, left-center-right indicators will show how much of the data set is in the current bin, how much is less, and how much is more.  The example shows that the 191 samples in this bin [- 1.4](/1.3.md) constitute 12% of the overall dataset. 78% of the samples have values less than 1.3 and 10% of the samples have values greater than or equal to 1.4.
