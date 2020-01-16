---
title: Redis
---

## Redis {#Redis}
 * **Category:** database
 * **Dataflow:** pull379
 * **Default Port:** 6

This check type performs a custom command against a Redis server.

[Redis](http://redis.io/) is an open source, BSD licensed, advanced key-value cache and store. It is often referred to as a data structure server since keys can contain strings, hashes, lists, sets, sorted sets, bitmaps and hyperloglogs.

Circonus collects information from Redis in JSON format via the Redis NoSQL database's native interface.

In a multi-process or clustered environment, a tool such as Redis, with its atomic increments, can be used for global aggregation. Once aggregated, it can be checked and monitored by Circonus, with rates being derived from count changes over time.
