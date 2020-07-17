---
title: Web Stream
weight: 150
---

# Web Stream

Web Stream is a service that listens on ports 9080 and 9443, and provides a
websocket interface to real-time data.  This service powers the data feeds for
dashboards as well as real-time graphs (via the play button).

Web stream listens on the [MQ](/circonus/on-premises/roles-services/mq) for
messages from [stratcon](/circonus/on-premises/roles-services/stratcon). If the
message contains a metric that is currently being watched on the website, then
it is fed back to the client over a websocket.  If the message is not being
watched, it is ignored.

If the MQ becomes backed up with messages waiting for Enzo to consume them, it
may be necessary to restart the service. If this continues, contact Circonus
Support (support@circonus.com).

## Service

`circonus-enzo-c`

## Web Stream PKI Files

Server:
* `/opt/circonus/etc/enzo/stream.crt`
* `/opt/circonus/etc/enzo/stream.key`

Client, for connecting to brokers/stratcon:
* `/opt/circonus/etc/enzo/enzo.crt`
* `/opt/circonus/etc/enzo/enzo.key`

Certificate Authority:
* `/opt/circonus/etc/enzo/ca.crt`
