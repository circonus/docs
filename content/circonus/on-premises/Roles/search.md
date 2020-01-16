---
title:
---

## Search {#Search}
The Circonus search service is the `circonus-elasticsearch` service and it runs a copy of elasticsearch on each box configured for the search role.  The elasticsearch cluster runs under the grover name.

Logs for this service can be found in `/opt/circonus/elasticsearch/logs`. While you may see exceptions in this location, these exceptions are not always significant to day-to-day operations.  If in doubt that items in elasticsearch are up to date, refer to the `circonus-grover_queue` service described in the  [hub](/Roles/hub.md#circonus-grover_queue) role section.

The elasticsearch instances can be restarted without an impact on other services.


### UI Not Updating {#UINotUpdating}
If you make a change via either the UI or the API and you do not see the changes appear in the interface within a few seconds, then it might be necessary to restart (or "clear" on OmniOS) the services that push data from the database into elasticsearch.

On the hub node, find the services listed below and make sure they are running.

In the list below, "`X`" is an integer that is the internal ID of the cluster to which those services push.

Linux services:
```
circonus-grover-queueX
circonus-grover-queueX-low
```

OmniOS services:
```
circonus/grover_queueX:high
circonus/grover_queueX:low
```


### Reindexing {#Reindexing}
If it becomes necessary to reload the elasticsearch index, such as when items on the UI are not updating properly or after a datacenter failover, issue the following command from a node running the hub role:
```
/www/bin/grover/reindex_elasticsearch.pl
```

This command can take some time to complete.


### Node Connectivity Troubleshooting {#NodeConnectivityTroubleshooting}
Each `elasticsearch` node should automatically reconnect with the other nodes in your `elasticsearch` cluster upon startup.

If `elasticsearch` nodes appear to be running, but not communicating with each other, you can check the logs in `/opt/circonus/elasticsearch/log/grover??.log` to verify connectivity. It is possible that only the "main" node in each cluster is receiving updates. This would cause you to see out-of-date data approximately half of the time when hitting a web node.

Most issues should be resolved simply by restarting `elasticsearch`.

On the hub node, verify that the `circonus-grover-queueX` jobs are running. These jobs keep `elasticsearch` up-to-date. As long as these jobs are running, it should be unnecessary to rebuild the index after the restart.

You can use these commands in the Web DB to verify that the count of the queue backlog is going down:

```
select count(*) from grover_queue;
select count(*) from grover_low_priority_queue;
```
