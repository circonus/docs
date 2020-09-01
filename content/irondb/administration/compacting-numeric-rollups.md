---
title: Compacting Numeric Rollups
weight: 55
---

# Compacting Numeric Rollups

Although numeric shards can be configured with [retention
windows](/irondb/getting-started/configuration/#nntbs), this only removes
entire shards once they are past the window. In cases where one has [fully
deleted](/irondb/api/data-deletion/#deleting-all-data-for-a-metric-or-a-set-of-metrics)
all data for a significant number of metrics, the storage space they occupy in
rollups may be recovered by performing a compaction of one or more NNTBS shards
using a map of active IDs from the [surrogate
database](/irondb/getting-started/configuration/#surrogate_database).

Compaction is performed by running the `shard_compactor` tool. It has two
required arguments:
* `-d <nntbs_dir>` - The path where NNTBS shards are stored. This is typically found
  under `/irondb/nntbs`, or `/snowth/nntbs` on Circonus Inside deployments. The
  directory name matches the node's cluster UUID.
* `-s <shard>` - The name of a shard to compact. Shards are named for the
  rollup period and the start and end timestamps that they represent. This
  option may be specified multiple times to compact more than one shard. Shards
  will be compacted serially.

Run `/opt/circonus/bin/shard_compactor --help` for full usage information. The
tool must be run as the unprivileged user that IRONdb runs as, typically
`nobody`.

This is an online operation (the IRONdb service must be running). Each shard
will be put into an "offline" mode while it is being compacted. Requests for
data within the shard will be redirected to other cluster nodes during the
operation.

## Caveats

* Compaction should only be performed on shards that are no longer getting new
  data. In other words, shards that are older than the raw database's
  `min_delete_age` plus `delete_after_quiescent_age`.
* A surrogate ID map is only valid for the host from which it was obtained, and
  should _never_ be used for compacting shards on a different host.
* Care should be taken to avoid compacting the same shard at the same time on
  multiple cluster nodes. Doing so may jeopardize the availability of metric
  data if too many of one shard are offline at once. Since compaction is a
  background maintenance task, it is preferable to run it on one node at a
  time.

## Example

Given an IRONdb node whose cluster ID is
`84d2979a-f233-47d3-9a15-d4f8885c9b7c`:

```
$ sudo -u nobody /opt/circonus/bin/shard_compactor \
    -d /irondb/nntbs/84d2979a-f233-47d3-9a15-d4f8885c9b7c \
    -s 60_1551432000-1552041600 \
    -s 60_1552041600-1552651200
```
