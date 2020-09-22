---
title: Stratcon
weight: 110
---

# Stratcon

The stratcon role consists of a C application: `circonus-stratcon`

## `circonus-stratcon`

Stratcon is the aggregation point of all data coming from [brokers](/circonus/on-premises/roles-services/broker).  This service reaches out to each active and configured broker, makes itself a subscriber of the journaled data, and receives it as it is collected.

When data is received, it is again written to disk, as well as fed over the [Message Queue (MQ)](/circonus/on-premises/roles-services/mq) to the [fault detection](/circonus/on-premises/roles-services/fault-detection) and [streaming](/circonus/on-premises/roles-services/web-stream) services.

Like the broker, stratcon has 2 processes: a parent and child.  If the child does not heartbeat, the parent is the watchdog and will restart it.

Stratcon keeps a few logs files. Most of these files can be ignored despite their imposing names. Logs are kept in `/var/log/circonus` and the list of logs is as follows:

 * `stratcon.log` - General purpose log
 * `stratcon-access.log` - Logs any requests received over SSL port 43191
 * `stratcon-bad.data` - Can be ignored unless otherwise advised by Support.
 * `stratcon-data-error.log` - Like `bad.data`, can be ignored

Stratcon also has an interactive console similar to the broker.  This console
can be reached by telnetting to localhost port 32324.  The most commonly used
command in this mode is:
```
show noits
```

This command shows the current status of connected brokers.

Stratcon can be sensitive to IO and CPU starvation.  If you discover the child process is continually being restarted, check these resources.  Contact Support (support@circonus.com) if the problem persists.

### Stratcon PKI Files

 * `/opt/noit/prod/etc/ca.crt`
 * `/opt/noit/prod/etc/stratcon.crt`
 * `/opt/noit/prod/etc/stratcon.key`
 * `/opt/noit/web/stratcon/pki/ca.crl`

## Broker - Stratcon Connectivity Troubleshooting

In cases where a broker status is reporting that the storage feed is
disconnected or delayed, but the alerting feed looks OK, there could be an
issue with the state of the broker's write-ahead log (JLog).

First, verify that there is no issue with PKI connectivity. If this is not an
issue, then it is possible that the stratcon machine is stuck requesting and
waiting for data that is not available on the broker due to a missing file or
other corruption of jlog state.

See the [JLog troubleshooting
guide](/circonus/on-premises/jlog#troubleshooting) for details.

If JLog is not the issue, delayed feeds could be the result of job queue
limits. Stratcon uses a pool of threads (a `jobq` in libmtev terminology) for
submitting metrics into IRONdb. If this thread pool is overutilized, stratcon
may not be able to keep up with the rate of new metrics coming from brokers.
The size of the thread pool may be adjusted via the [irondb_put_concurrency
attribute](/circonus/on-premises/installation/installation/#stratcon-attributes)
in `site.json`.
