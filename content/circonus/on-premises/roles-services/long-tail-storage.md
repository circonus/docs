---
title: Long Tail Storage
weight: 80
---

# Long Tail Storage {#LongTailStorage}

Long Tail Storage is designed to be a long term repository for processed data from the [brokers](/circonus/on-premises/roles-services/broker).

It runs a single service: `circonus-ltstore-rsync`, which is an rsync daemon that waits for syncs from the [stratcon](/circonus/on-premises/roles-services/stratcon) machines.  Stratcon syncs data over to this service once stratcon has completed its processing.

You are free to handle this storage however you wish.
