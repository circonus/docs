---
title: Long Tail Storage
weight: 80
---

# Long Tail Storage

Long Tail Storage is designed to be a long term repository for processed data
from the [brokers](/circonus/on-premises/roles-services/broker), prior to
ingestion into IRONdb. It provides a disaster recovery option in the event that
the entire IRONdb cluster is lost, allowing historical data to be reimported.

It runs a single service: `circonus-ltstore-rsync`, which is an rsync daemon
that waits for syncs from the
[stratcon](/circonus/on-premises/roles-services/stratcon) machines.  Stratcon
syncs data over to this service once stratcon has completed its processing. A
local cron job collates this data into daily, tab-separated-value (TSV) files,
one per broker per day.

This role has the option of using [ZFS
filesystems](/circonus/on-premises/installation/installation/#install-zfs). If
used, the daily TSV files will be transparently compressed, providing a
significant reduction in disk space requirements.

You are free to handle the TSV files however you wish, leaving them in place on
the Long Tail Storage host, or archiving them elsewhere.
