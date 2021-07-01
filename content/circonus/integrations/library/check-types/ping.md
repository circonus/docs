---
title: Ping
---

# Ping

 * **Category:** general
 * **Dataflow:** pull
 * **Default Port:** N/A

This check type checks system availability and network latency.

The Ping utility tests the availability of a host on a network and measures the round-trip time for messages exchanged with that host. Ping sends Internet Control Message Protocol (ICMP) echo request packets to the target host and then waits for an ICMP response. It also measures the time passed between the initial transmission and receiving the response (the round-trip time) and records any packet loss.

In Circonus, a Ping check allows you to choose from up to 5 different metrics that can be gathered from pinging a target:
 * available - the percent of total available capacity
 * average - the average round-trip time
 * count - the number of packets sent (This can be changed under "Advanced Configuration".)
 * maximum - the maximum round-trip time
 * minimum - the minimum round-trip time
