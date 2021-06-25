---
title: CAQL Broker
weight: 40
---

# CAQL Broker

The CAQL Broker provides the ability to set up rules for and alert on values derived from Circonus Analytics Query Language (CAQL) transforms.

## Updates

This section details the recommended update process as part of a full [Hooper update](/circonus/on-premises/installation/upgrading/) of an Inside Deployment.
caql-broker updates should be done particularly carefully, since downtime leads to gaps in all caql-metrics.

**Do not attempt to update caql-broker in isolation unless directed by Circonus Support**.

If you run into any problems during the update process, contact the Circonus Support.

### Single Node Update

The update for a single-node setup is straight forward:

1. Update caql-broker via [hooper](/circonus/on-premises/installation/upgrading/) (`/opt/circonus/bin/run-hooper`).

1. Check the error log for errors starting up (`tail -f /opt/noit/prod/log/error.log`).
   Address any errors that occur.

1. Wait until caql-broker is fully initialized.
   The initialization status is reported per thread in the error log.
   By default there are 10 threads.
   During the initialization phase, there will be messages like these every 10 seconds:
   ```
   [19868/1] Awaiting statement initialization total=468 done=467 (99%) failed=0 (0%)
   ```
   When the initialization is completed for one thread, there will be a message like this:
   ```
   {"pid":"19868/1","event":"Initialization completed","statement_count":468}
   ```
   Wait until all threads have been initialized.

1. Check that CAQL metrics are flowing as expected.

### Clustered Update

A clustered setup allows for zero-downtime updates.
caql-broker cluster have a single leader and multiple followers.
The leader is the node with the longest uptime.
For maximal safety, we recommend the following update procedure:

Pick a caql-broker node to be first to update, and proceed as follows:

1. Restart the caql-broker service (`sudo systemctl restart caql-broker` on el7).
   This will make sure the current node is in fallback mode and another one has the cluster lead.
   Make sure CAQL metrics are still flowing, and check the logs for errors on startup.
   Address any errors before continuing with the update.

1. Update caql-broker via [hooper](/circonus/on-premises/installation/upgrading/) (`/opt/circonus/bin/run-hooper`).

1. Check the error log for errors starting up. (`tail -f /opt/noit/prod/log/error.log`)
   Address any errors before continuing with the update.

1. Wait until caql-broker is fully initialized, as above.

1. Restart all other cluster nodes. This will ensure that the current node is in the master role.
   Check that CAQL metrics are flowing as expected.
   If not, restart this node again to yield the lead role, and investigate further.

The remaining cluster nodes can be updated with a simplified procedure following steps 2,3.

## Configuration

The caql-broker configuration files are located in `/opt/noit/prod/etc/`.

The high-level application configuration is contained in the file: `circonus-caql-broker.conf`

This is the only file, that should be modified by the user.

Example circonus-caql-broker.conf

```
<?xml version="1.0" encoding="utf8"?>
<network>
  <in>
    <mq type="fq">
      <!-- Incoming messages are read from fq. Configure the host + exchange here -->
      <host>mq3.dev.circonus.net</host>
      <port>8765</port>
      <user>caql-broker</user>
      <pass>secret-caql-broker-pass</pass>
      <exchange>noit.firehose</exchange>
      <program>prefix:"check."</program>
    </mq>
  </in>
</network>
<caqlbroker>
  <!-- After startup the CAQL states are initialized using data fetched from snowth (IRONdb) -->
  <snowth>
    <node address="10.8.20.26" port="8112"/>
    <node address="10.8.20.27" port="8112"/>
    <node address="10.8.20.28" port="8112"/>
    <node address="10.8.20.29" port="8112"/>
  </snowth>
  <!-- Searches and metricclusters are resolve via the Circonus API -->
  <!-- Configure the interval in which searche results should be refreshed for each CAQL query -->
  <api search_refresh_seconds="600">
    <token>21f651e6-d66b-48c5-b2f2-00bd5ecbee51</token>
    <app_name>caql-broker</app_name>
    <host>api.dev.circonus.net</host>
    <address>10.8.20.111</address>
    <port>8080</port>
  </api>
</caqlbroker>
```

Here is a complete list of supported configuration options as xpath selectors:

*  ```//caqlbroker/@window_timeout```
  Grace period to wait before closing a window in seconds. Allows for late arriving data to be included.
  Defaults to 30.
*  ``` //caqlbroker/api/@batch_size```
  Number of search results to pull in one page. Defaults to the maximum allowed page size of 1000.
*  ```//caqlbroker/api/@global_concurrency```
  Maximal number of concurrent HTTP requests against the API.
  Defaults to 10.
*  ```//caqlbroker/api/@search_refresh_seconds```
  caql-broker regularly reaches out to the circonus-api to refresh the results of all CAQL search() queries.
  This parameter allows you to specify the refresh interval.
  Defaults to 300.
*  ```//caqlbroker/api/@timeout```
  Timeout of API requests. Defaults to 30.
*  ```//caqlbroker/api/app_name```
  App name to connect to the API.
*  ```//caqlbroker/api/node/@address```
  API node IP address.
*  ```//caqlbroker/api/node/@host```
  HTTP host to use when making API requests.
*  ```//caqlbroker/api/node/@port```
  API node port.
*  ```//caqlbroker/api/token```
  Super token for the web API.
*  ```//caqlbroker/snowth/@concurrency```
  Number of concurrent snowth requests per lua thread (not global). Default = 3.
  By default there are 10 active lua threads.
*  ```//caqlbroker/snowth/@timeout```
  Timeout of requests against a snowth node. Default 30.
*  ```//caqlbroker/snowth/node/@address```
  IP address of bootstrap snowth node.
*  ```//caqlbroker/snowth/node/@host```
  HTTP host to use in requests to bootstrap snowth node
*  ```//caqlbroker/snowth/node/@port```
  Port of bootstrap snowth node

## Logs

We use a number of mtev-log outlets to log run-time information about the caql-broker process:

* `/opt/noit/prod/log/error.log` error messages that indicate problems,
  that should be addressed by the operator.

* `/opt/noit/prod/log/warn.log` warnings messages that indicate unusual events, that are likely tolerable.

* `/opt/noit/prod/log/caql.log` results of all caql operations that have been performed.

* `/opt/noit/prod/log/caqlbroker.log` debug information about caql-broker processing logic,
  e.g. search resolutions, metric dispatching.

* `/opt/noit/prod/log/messages.log` (disabled by default) log all incoming messages

* `/opt/noit/prod/log/cluster.log` (disabled by default) clustering information

Logging can be configured in /opt/noit/prod/etc/circonus-logs.conf

## Metrics

caql-broker exports a number of application-level metrics over the REST endpoint `https://$CAQL_HOST:8081/mtev/stats.json`

There are a significant number of metrics exposed, including the following:

*  ```caqlbroker`messages`count```
  Number of messages that have been processed by caql-broker since boot.
  Messages that are processed in multiple lua threads are counted multiple times.
  This is a measure for the amount of work performed by caql-broker.

*  ```caqlbroker`messages`delay`{M,H}```
  Observed delay between time of event time and processing time of arriving M,H messages.

*  ```caqlbroker`messages`duration```
  Message processing durations, including error cases.

*  ```caqlbroker`messages`err```
  Count of message processing errors.

*  ```caqlbroker`messages`tagsearch`cache_size```
  The total number of cached tag-search results.
  A large cache is a possible reason for running out of memory.

*  ```caqlbroker`metric`subscriptions```
  The total number of metrics we are subscribed to.
