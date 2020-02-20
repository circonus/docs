---
title: FQ
weight: 160
---

# FQ

FQ is a brokered message queue from Circonus Labs using a publish subscribe model. FQ is fast and performance-oriented. Messages come in, FQ determines where to send them, and the messages go out.

Additional documentation about FQ can be found on the Circonus Labs [Github Repository](https://github.com/circonus-labs/fq).

## Interface

The FQ Interface can be accessed by visiting the node on port 8765 in your browser.

The auto-updating console has 3 tabs, Overview, Queues, and Routes.

### Overview

![Image: 'fq_interface_overview_3.png'](/images/circonus/fq_interface_overview_3.png)

The Overview tab lists the active
[exchanges](https://github.com/circonus-labs/fq#exchanges) as well as aggregate
statistics of all exchanges. In each panel, the first column of statistics is a
live snapshot of the rate of various events in the system, and the second is
the total seen since the FQ node booted.

> The only exchange used in Circonus Inside is `noit.firehose`.

### Queues

![Image: 'fq_interface_queues_3.png'](/images/circonus/fq_interface_queues_3.png)

The Queues tab lists the [queues](https://github.com/circonus-labs/fq#queues)
that have been established, one panel per queue. Each panel lists information
about the queue at the top, including an indicator bar of in-flight messages.
To the right of the indicator bar is a count of in-flight messages and the
total size of the queue.

**Warning:**
> If the bar fills up and changes from green to orange, this indicates that the
> queue is full and messages are being lost.

### Routes

![Image: 'fq_interface_routes_3.png'](/images/circonus/fq_interface_routes_3.png)

The Routes tab lists the known
[routes](https://github.com/circonus-labs/fq#routes-and-programs) that senders
have established.

## JSON Metric Outputs

Example FQ JSON Metric Output:
```
{
 "version": "0.9.0",
 "exchanges": {
  "noit.firehose": {
   "messages": 79935499,
   "octets": 37989734444,
   "no_route": 57518,
   "routed": 80546043,
   "dropped": 80465039,
   "routes": {
    "24": {
     "route_id": 24,
     "prefix": "check.",
     "queue": "655dd8dc-78f1-4921-80c4-83f6b9f3bcc1",
     "permanent": false,
     "invocations": 2543822,
     "avg_ns": 298,
     "program": "prefix:\"check.\""
    }
   ,"25": {
     "route_id": 25,
     "prefix": "",
     "queue": "655dd8dc-78f1-4921-80c4-83f6b9f3bcc1",
     "permanent": false,
     "invocations": 1381540,
     "avg_ns": 189,
     "program": "prefix:\"\""
    }
   }
  },
  "_aggregate": {
   "no_exchange": 18,
   "messages": 79935517,
   "octets": 37989747476,
   "no_route": 57536,
   "routed": 80546043,
   "dropped": 80465039
  }
 },
 "queues": {
  "655dd8dc-78f1-4921-80c4-83f6b9f3bcc1": 
{
  "private": true,
  "type": "mem",
  "policy": "drop",
  "backlog_limit": 16384,
  "backlog": 16384,
  "refcnt": 9,
  "clients": [    {
    "user": "ernie"
   ,"remote_addr": "10.8.20.52"
   ,"remote_port": "46335"
   ,"mode": "peer"
   ,"no_exchange": "0"
   ,"no_route": "0"
   ,"routed": "0"
   ,"dropped": "0"
   ,"msgs_in": "0"
   ,"msgs_out": "477"
   ,"octets_in": "0"
   ,"octets_out": "325879"
    }
]
} }
}
```

The "exchanges" section will have entries for all of the defined exchanges.
The "_aggregate" entry is additive of all the listed exchanges.

## Debugging FQ

FQ can be run in debug mode from the command line.

To run FQ in debug mode, kill any and all existing FQ processes, then enter the following command:
```
fq -g fq FQ_DEBUG=<flag values> <path to fqd>/fqd -D -c <path to fqd.sqlite>/fqd.sqlite -p <port number>
```

<flag values> determine debug output type and can have the following values:

```
FQ_DEBUG_MEM =     0x00000001,
FQ_DEBUG_MSG =     0x00000002,
FQ_DEBUG_ROUTE =   0x00000004,
FQ_DEBUG_IO =      0x00000008,
FQ_DEBUG_CONN =    0x00000010,
FQ_DEBUG_CONFIG =  0x00000020,
FQ_DEBUG        =  0x00000040,
FQ_DEBUG_PEER =    0x00000080,
FQ_DEBUG_HTTP =    0x00000100,
FQ_DEBUG_PANIC =   0x40000000
```

To debug more than one flag, simply OR the flag values. For example, to output connection, configuration, and route information, set `FQ_DEBUG` equal to `0x00000034 (FQ_DEBUG_CONFIG|FQ_DEBUG_CONN|FQ_DEBUG_ROUTE)`.

For example, you can run FQ in debug mode with the variables shown below to output configuration, connection, and route information to the console:
```
fq -g fq FQ_DEBUG=0x00000034  /opt/circonus/sbin/fqd -D -c /opt/circonus/var/lib/fq/fqd.sqlite -p 8765
```
