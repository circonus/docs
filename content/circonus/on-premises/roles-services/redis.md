---
title: Redis
weight: 110
---

# Redis {#Redis}

The Redis role runs the `circonus-redis` service, which in turn runs a single instance of `redis-server`.

Redis houses a data cache for the most recently seen data points as they flow in from the [brokers](/circonus/on-premises/roles-services/broker).  This cache is in memory only and can be restarted as desired. The cache will be hot once the checks run again, which typically happens within one minute.
