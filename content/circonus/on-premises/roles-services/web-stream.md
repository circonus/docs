---
title: Web Stream
weight: 150
---

## Web Stream {#WebStream}
`circonus-enzo` is a `Node.js` service that listens on port 9443 and provides a websocket interface to real-time data.  This service powers the data feeds for dashboards as well as real-time graphs (via the play button).

Web stream listens on the [MQ](/circonus/on-premises/roles-services/mq) for messages from [stratcon](/circonus/on-premises/roles-services/stratcon). If the message contains a metric that is currently being watched on the website, then it is fed back to the client over a websocket.  If the message is not being watched, it is ignored.

If the MQ becomes backed up with messages waiting for `enzo` to consume them, it may be necessary to restart the `circonus-enzo` service. If this continues contact Circonus Support (support@circonus.com).


### Web Stream PKI Files {#WebStreamPKIFiles}
 * `/opt/circonus/etc/enzo/ca.crt`
 * `/opt/circonus/etc/enzo/enzo.crt`
 * `/opt/circonus/etc/enzo/enzo.key`

**Note:**
>You will also see `stream.crt` and `stream.key`. These are the user facing certificates and not involved in internal SSL communication.
