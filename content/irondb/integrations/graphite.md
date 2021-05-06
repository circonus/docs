---
title: Graphite
---

# Graphite

## Overview

IRONdb is a drop-in replacement for Graphite's Whisper database, and supports
ingestion from Carbon sources like carbon-relay and carbon-c-relay. 
[Graphite-irondb](https://docs.circonus.com/irondb/tools/irondb-graphite/) is a
storage finder plugin that allows IRONdb to seamlessly integrate with an
organization's existing Graphite-web deployment.

The [IRONdb Relay](/irondb/tools/irondb-relay/) is a scalable, drop-in replacement for
carbon-relay or carbon-c-relay.

## Graphite Ingestion

The format for ingestion is the typical Carbon plaintext format:

`dot.separated.metric.name<space>12345.56<space>1480371755\n`

If you desire higher resolution data capture, IRONdb does support a variant of
the unix epoch timestamp (3rd field) where you can suffix the timestamp with a
period, followed by the number of milliseconds in the second. For example:

`dot.separated.metric.name<space>12345.56<space>1480371964.123\n`

This example means `123 milliseconds` into the timestamp `1480371964` or
`November 28, 2016 10:26:04 and 123ms PM UTC`

** Note that, while it resembles a floating point number, this is not a float. **

Starting with IRONdb release `0.12` you can also ingest *tagged* graphite data.
Tagged graphite data has the following format:

`dot.separated.metric.name;category1=value1;category2=value2`

Where tags are appended to the normal name and are separated by semicolons (`;`).

For more info on the graphite tag format see: [Graphite Tag Support](http://graphite.readthedocs.io/en/latest/tags.html).

## Namespacing

Graphite ingestion into IRONdb requires namespacing your graphite data. This
lets you associate a UUID/Name and numeric identifier with the incoming
metrics. This is useful, for example, if you want to use a single IRONdb
installation to service multiple different internal groups in your organization
but keep metrics hidden across the various groups.

All metrics live under a numeric identifier (you can think of this like an
account_id). Metric names can only be associated with an "account_id". This
allows you have separate graphite-web or Grafana instances that segregate
queries for metric names, or combine them all together under a single
"account_id", or even separate your internal groups but recombine them under
graphite-web/Grafana for visualization purposes. It's really up to you.

## Optional Configuration

Graphite ingestion will, by default, accept timestamps up to 1 year in the
past. When retrieving Graphite data, a floor of 1-minute resolution is used, to
prevent gaps if the requested period is shorter. These values may be changed
through
[configuration](/irondb/getting-started/configuration/#graphite-config).

## Writing Graphite Data with Network Listener

The network listener requires that we associate an account_id, uuid, and name
with a network port. This is added to the [IRONdb configuration
file](/irondb/getting-started/configuration/#graphite-listener) during initial installation, for the
default Graphite text protocol port (2003). Additional stanzas may be added,
associating different IDs with different ports to segregate incoming traffic.

```
    <listener address="*" port="2004" type="graphite">
      <config>
        <check_uuid>8c01e252-e0ed-40bd-d4a3-dc9c7ed3a9b2</check_uuid>
        <account_id>1</account_id>
      </config>
    </listener>
```

You can then use:

```
echo "my.metric.name.one 1 `date +%s`" | nc 2004
```

to send metrics to IRONdb.

See also the [IRONDB-relay](/irondb/tools/irondb-relay/)

## Graphite Rendering

IRONdb has a graphite-web Storage Backend which makes the following Graphite Rendering seamless with an existing graphite-web installation. The Storage Backend requires graphite 0.10 or newer and can be obtained
[here](https://docs.circonus.com/irondb/tools/irondb-graphite/):

Follow the instructions in the README in that repo to install and utilize the IRONdb graphite storage backend.

That Storage Backend plugin simply utilizes the endpoints described below.

## Query Result Limits

All query results are subject to limits to control the number of results
returned. If not otherwise specified, queries will be limited to the first
10,000 results returned.

This limit may be changed by setting a request header,
`x-snowth-advisory-limit`, with one of the following values:
 * A positive integer representing the desired limit
 * -1 or "none" to remove the limit

If the header contains any other value or is not present, the default of 10,000
will be used.

## Searching for Metric Names

Graphite metrics can be fetched (rendered) from IRONdb using the following endpoints. Glob style wildcards are supported.

`http://<host:port>/graphite/<account_id>/<optional_query_prefix>/metrics/find?query=foo.*`

This will return a JSON document with metrics matching the prefix: `foo.` which terminate at that level.  Continuing on the example in Graphite Ingestion, the above example could return the following:

```
[
        {"leaf": false, "name":"foo.dev"},
        {"leaf": false, "name":"foo.prod"}
]
```   

When a metric is a leaf node, `leaf` will be true and that metric will be queryable for actual datapoints.

The `optional_query_prefix` can be used to simplify metric names.  You can place any non-glob part of the prefix of a query into the `optional_query_prefix` and that prefix will be auto-prefixed to any incoming query for metric names. For example:

`http://<host:port>/graphite/1/foo./metrics/find?query=*`

Will return:

```
[
        {"leaf": false, "name":"dev"},
        {"leaf": false, "name":"prod"}
]
```   

Note that the `optional_query_prefix` is omitted from the response json. You
would use this feature to simplify all metric names in graphite-web or Grafana.

If you do not want to utilize the `optional_query_prefix` you can leave it off the URL:

`http://<host:port>/graphite/1/metrics/find?query=foo.*`

```
[
        {"leaf": false, "name":"foo.dev"},
        {"leaf": false, "name":"foo.prod"}
]
```

## Searching for Tags

Graphite metrics can be fetched (rendered) from IRONdb using multi-dimensional tag queries.

`http://<host:port>/graphite/<account_id>/<optional_query_prefix>/tags/find?query=<tag query>`

This will return a JSON document with metrics matching the `<tag query>`.  Tag query syntax
is the same as supported by Graphite version >= 1.1.  See [Graphite Tag Querying](http://graphite.readthedocs.io/en/latest/tags.html#querying)

The syntax is:

    tag=spec    tag value exactly matches spec
    tag!=spec   tag value does not exactly match spec
    tag=~value  tag value matches the regular expression spec
    tag!=~spec  tag value does not match the regular expression spec
    
`http://<host:port>/graphite/1/tags/find?query=category1=value1`


```
[
        {"leaf": false, "name":"graphite.dev;category1=value1", "leaf_data": {...}},
        {"leaf": false, "name":"graphite.prod;category1=value1", "leaf_data": {...}}
]
```   

## Retrieving Datapoints

There are 2 methods for retrieving datapoints from IRONdb. A GET and a POST.

### GET

For retrieving an individual metric name, use:

`http://<host:port>/graphite/<account_id>/<optional_query_prefix>/series?start=<start_timestamp&end=<end_timestamp>&name=<metric_name>`

where `<start_timestamp>` and `<end_timestamp>` are expressed in unix epoch seconds, and `<metric_name>` is the originally ingested leaf node returned from the `/metrics/find` query above. `optional_query_prefix` 
follows the same rules as described in the prior section.

### POST

For fetching batches of time series data all at once, IRONdb provide a POST interface to send multiple names at the same time. To use this, POST a json document of `Content-type: application/json` to the following url:

`http://<host:port>/graphite/<account_id>/<optional_query_prefix>/series_multi`

The document format:

```
{
        "start": <start_timestamp>,
        "end" : <end_timestamp>,
        "names" : [ "graphite.dev.metric.one", "graphite.prod.metric.two"]
}
```

`optional_query_prefix` follows the same rules as the prior sections. If you provide an `optional_query_prefix` you would omit that portion of the metric name from the names in the JSON document. For example:

`http://<host:port>/graphite/1/graphite./series_multi`

The document format:

```
{
        "start": 0,
        "end" : 12345,
        "names" : [ "dev.metric.one", "prod.metric.two"]
}
```

## Native Whisper Read Support

IRONdb has the capability of reading Whisper database files directly, making
historical Graphite data available to be queried. Writing new data to Whisper
format is not supported.

To make an existing hierarchy of Whisper content available, the starting
directory must be made available to all IRONdb nodes. Depending on operator
preference, this may involve copying the directory structure and its files to
each IRONdb node, or making a shared mountpoint available over a networked
filesystem such as NFS, and mounting it on each IRONdb node.

Multiple collections of Whisper data are also supported, such as from disparate
Graphite installations. Each collection can be exposed to IRONdb individually,
and may be segregated from one another using different IRONdb check UUIDs
and/or account IDs. See [Namespacing](#namespacing) above for details on how
check UUIDs and account IDs are used.

To configure one or more Whisper directories, see [Graphite
Configuration](/irondb/getting-started/configuration/#graphite-config).
