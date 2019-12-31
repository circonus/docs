---
title:
draft: true
---

## Data Flow {#DataFlow}

[Brokers](/Roles/broker.md) are the collection points in Circonus.  They are designed to be lightweight and sit in the field, either in the datacenter with the servers to be monitored, in the NOC with the Circonus architecture, or in locations around the world, from where they provide perspectives from where your users might come.

The brokers support both the push and pull of data.  The majority of checks pull their data by reaching out over various protocols, connecting to the source hosts and extracting the metrics.  Pushing data can also be done with methods that support this, for instance statsd, collectd, and our HTTPTrap methods.

As data is collected by a broker, it is journaled to disk.  Subscribers of these journals, [stratcons](/Roles/stratcon.md), then receive a feed of the data, which feeds the Circonus [data storage](/Roles/data_storage.md) and [fault detection](/Roles/fault_detection.md).  This journaled data is automatically removed as subscribers read it. Should a broker become disconnected, the data is kept until it can reconnect and be read again, allowing for gaps (due to outages in graphs, for example) to be filled.

Stratcons are the aggregators of the brokers. Connections always go out from
the stratcons to the brokers and are SSL encrypted.  Once data reaches a
stratcon, it feeds it to the [data storage systems](/Roles/data_storage.md),
and also over the [Message Queue (MQ)](/Roles/mq.md), which feeds the real-time
services, fault detection, and [streaming](/Roles/web_stream.md).

The data stores house the data in 1 minute, 5 minute, 30 minute, 1 hour, and 1 day rollups (if configured).  This data is not removed automatically, and it is up to the operator to decide on a retention scheme.  Each rollup size is available in perpetuity, meaning that you can still pull 1 minute granularity after 4 years if needed.

Data sent over the MQ for web streaming is checked for any active viewers from the website. If none are found, the data is ignored.

Fault detection ignores data more than (>) 10 seconds old. This is to prevent previously disconnected brokers from causing outdated alerts.  This also means it is very important to keep your broker clocks in sync with the rest of the Circonus infrastructure.  Once data is analyzed by the fault detection system, it is forwarded over the MQ to the [notification engine](/Roles/notification.md).  From there, it is checked to see if this is a duplicate event, if an alert needs to be created, and if someone needs to be notified. If someone does need to be notified, then a message is passed on to various notification methods to send out the alert.

Data such as accounts, users, check configurations, alerts, and other items that power the website are stored in a Postgres database (the [Web DB](/Roles/web_db.md)).  Various services, such as the notification system, talk to the Web DB directly to create alerts, and the Web DB also talks to the MQ to provide information about changes to rules, checks, etc.
