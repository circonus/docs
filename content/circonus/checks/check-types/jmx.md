---
title: JMX
---

# JMX {#JMX}

 * **Category:** agent
 * **Dataflow:** pull
 * **Default Port:** as specified, between 0 and 65535

This check type checks a JMX enabled service.

Circonus provides complete monitoring of JMX compatible applications for custom or Enterprise-level Java applications and is able to communicate natively with a Java JVM over JMX.

Circonus queries the JMX Application and pulls all available metrics. It collects any metrics that are available as MBeans. Many commercial Java products have statistics available as MBeans, such as JBoss and Tomcat.

To set up a JMX check, select a host and destination port between 0 and 65535. "Advanced Configuration" allows you to set server authorization information and specify MBean domains.
