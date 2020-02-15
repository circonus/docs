---
title: statsd
---

# statsd {#statsd}

 * **Category:** agent
 * **Dataflow:** push
 * **Default Port:** 8125

Like the HTTPTrap check type, the statsd check receives data passively, allowing your hosts to send information to Circonus Enterprise Brokers, rather than the Broker reaching out to the host to poll it.

Applications on systems on your network can submit metric data by sending statsd formatted UDP packets to port 8125 on your broker.  Because of various limitations in the statsd protocol, there is no authentication and no security. This is why the statsd check is limited to Enterprise Brokers only.

One downside of using statsd is that this information cannot be played in real-time, but it can be useful for metrics that may not have regular intervals of available information or which are particularly high volume.

## Configuring statsd checks {#Configuringstatsdchecks}

**Note:**
> The target host must be an IP address and the packets that arrive at the broker must have that IP address as the source address.

![Image: 'statsd_target3.png'](/images/circonus/statsd_target3.png)

Creating a statsd check requires choosing the statsd check and selecting a target host.

![Image: 'statsd_test_check3.png'](/images/circonus/statsd_test_check3.png)

The next step is optional. If you know the metrics you expect to see via statsd, you may enter them by clicking "add new metric".

![Image: 'statsd_metric_entry3.png'](/images/circonus/statsd_metric_entry3.png)

Enter the name of the metric and its check type.  You may repeat this process for multiple metrics.

**Note:**
> You may elect to collect no metrics at this time. Under normal operating conditions where data is being collected, you can view the check and see what metrics are arriving and available for collection  (this could take a few minutes). Using the "Update Metrics" feature on the "view check" page, you can enable any metric you see. This is the preferred method if you have more than a few metrics to collect.
