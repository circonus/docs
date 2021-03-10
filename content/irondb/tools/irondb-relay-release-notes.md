---
title: IRONdb Relay Release Notes
weight: 35
---

# IRONdb-relay Release Notes

## 0.0.46

2021-03-10

* Add new debug log at `debug/parsing` to assist in debugging input parsing
  issues.

## 0.0.45

2020-12-23

* Adopt new Reconnoiter FlatBuffers implementation. **Requires IRONdb 0.19.15
  or later.**


## 0.0.44

2020-10-26

* Add new configuration option for HTTP compression. To enable compression, set
  the attribute `compressed="true"` in the `<send>` XML node in
  `irondb-relay.conf`. The default is `false` if not specified.


## 0.0.43

2020-07-23

* Use safer string manipulation.
* Fix NPE in watchdog config.


## 0.0.42

2020-04-09

* Introduce a watchdog heartbeat on aggregator threads. Default is 300s
  timeout, but this can be controlled via a module config parameter,
  `watchdog_timeout`, which is a floating point value number of seconds.


## 0.0.41

2020-03-16

* Adopt new libmtev 1.10 configuration read functions.

