---
title: Data Submission
weight: 40
---

# Data Submission

## Writing Raw Data {##write-raw}

In contrast to the other submission APIs ([numeric](##write-nnt),
[text](##write-text), [histogram](##write-histogram)), which accept
specifically-typed data, the raw API accepts direct input of measurement data
at arbitrary frequencies. It stores every measurement as it was received, for a
configurable amount of time, before aging it out to a rollup format.

Metric records are in one of several formats, and are accepted as either
tab-separated values or as FlatBuffer messages.

### Metric Record Formats
Raw metric records may be submitted in one of several formats, depending on the
type of metric data contained within.

#### TSV Format

##### TSV URI

`/raw`

##### TSV Method

PUT | POST

##### TSV Numeric Or Text Metric Format

Individual numeric or text metrics submitted to the raw endpoint as lines of
ASCII characters use the following format, referred to as an `M` record:

```
M TIMESTAMP UUID NAME TYPE VALUE
```

Components are separated by TAB characters. Multiple records may be sent in the
same operation, separated by newline (`\n`).

 * `M` : Denotes an `M` record.
 * `TIMESTAMP` : An epoch timestamp recording the time of the observation, with
   milliseconds. In terms of format, it is `%lu.%03lu`, i.e., `1516820826.120`.
   **While this might look like a float,** it is, in fact, a strict textual
   format that requires exactly three digits after the decimal point. These
   must always be included, even if they are `000`.
 * `UUID` : An identifier of the account and check to which this metric
 * belongs. Despite its name, this identifier must be in the form:
   ```
TARGET`MODULE`CIRCONUS_NAME`lower-cased-uuid
   ```
   * `TARGET` is conventionally the IP address of the check target, but may be
     any meaningful string identifying the subject of the check.
   * `MODULE` is conventionally the name of the [Reconnoiter check module](https://github.com/circonus-labs/reconnoiter/tree/master/src/modules).
   * `CIRCONUS_NAME` is what determines both the account and check to which this
     metric belongs. It has the form `c_ACCOUNT-ID_CHECK-BUNDLE-ID::MODULE`.
     `ACCOUNT-ID` is the most significant, as this is how metric data is partitioned
     within IRONdb.
   * `lower-cased-uuid` is the check UUID, lower-cased.
 * `NAME` : The name of this metric. The conventional format for hierarchical
   naming is "name\`subname\`subsubname\`etc."
 * `TYPE` : The type of data that the `VALUE` represents:
   * `i`: int32
   * `I`: uint32
   * `l`: int64
   * `L`: uint64
   * `n`: double
   * `s`: string
 * `VALUE` : The value observed. `VALUE` is always a string or `[[null]]`
   (never encoded/packed).

> Numeric measurements which collide on TIMESTAMP/UUID/NAME will store the
> largest absolute value for that time period, by default. This behavior is
> [configurable](../irondb/getting-started/configuration/##rawdatabase-conflictresolver).

A sample `M` record:

```
M	1512691226.137	example.com`http`c_123_987654::http`1b988fd7-d1e1-48ec-848e-55709511d43f	duration	I	1
```

This is a metric, `duration`, on account `123`, for the HTTP check
`1b988fd7-d1e1-48ec-848e-55709511d43f` with a TYPE of uint32 (`I`) and a VALUE
of `1`.

##### TSV Histogram Metric Format

Histogram submission is similar to `M` records above, but instead of a
single-value payload, a base64-encoded serialization of the histogram structure
is used. This is referred to as an `H1` record. As with `M` records, the
components are tab-separated.

```
H1 TIMESTAMP UUID NAME HISTOGRAM
```

 * `TIMESTAMP` : Same as with `M` records above.
 * `UUID` : Same as with `M` records above.
 * `NAME` : Same as with `M` records above.
 * `HISTOGRAM` : A base64-encoded, serialized histogram. See the
   `hist_serialize()` function in
   [libcircllhist](https://github.com/circonus-labs/libcircllhist/blob/master/src/circllhist.c),
   the reference implementation of histograms in Circonus.

A sample `H1` record:

```
H1	1512691200.000	example.com`ping_icmp`c_123_45678::ping_icmp`c50361d8-7565-4f04-8128-3cd2613dbc82	maximum	AAFQ/gAB
```

This is a histogram of values for the metric `maximum`, on an ICMP check for
account `123`.

#### FlatBuffer Format

##### FlatBuffer URI

`/raw`

##### FlatBuffer Method

POST

##### FlatBuffer Format

A FlatBuffer metric payload is submitted as a `MetricList` as specified in the
[Reconnoiter FlatBuffer
source](https://github.com/circonus-labs/reconnoiter/blob/master/src/flatbuffers/metric_list.fbs).

When submitting FlatBuffer-encoded metrics, a client must set the HTTP header
`Content-Type` to `application/x-circonus-metric-list-flatbuffer` and set the
HTTP header `X-Snowth-Datapoints` to the number of data points within the raw
submission.

## Writing Text Data {##write-text}

*This is legacy endpoint.  It is recommended to use the [Raw Data](##write-raw) submission endpoint to submit text data.*

This API call is for writing text data into the IRONdb cluster. It sends a JSON object containing the data to be added to the cluster.

### Description

#### URI

`/write/text`

#### Method

PUT | POST

#### JSON Format

 * `metric` : The name of the metric for which data is added.
 * `id` : The UUID of the check for the metric for which data is added.
 * `offset` : The timestamp, represented in time since the epoch, for which data added.
 * `value` : The text string to add to the IRONdb cluster.

### Examples

The following example uses a file, data.json, containing the JSON object below
and posts it to an IRONdb node.

```
curl -X POST \
     -d @data.json \
     http://127.0.0.1:8112/write/text
```

The JSON object below will add data to the IRONdb cluster for two text metrics,
named "textexample1" and "textexample2". The data will be added at offset
1408724400 (August 22, 2014, 12:20:00 GMT).

`data.json` contents:

```json
[
  {
    "offset": "1408724400",
    "id": "ae0f7f90-2a6b-481c-9cf5-21a31837020e",
    "metric": "textexample1",
    "value": "this_is_a_test"
  },
  {
    "offset": "1408724400",
    "id": "ae0f7f90-2a6b-481c-9cf5-21a31837020e",
    "metric": "textexample2",
    "value": "this_is_also_a_test"
  }
]
```

## Writing Histogram Data {##write-histogram}

*This is legacy endpoint.  It is recommended to use the [Raw Data](##write-raw) submission endpoint to submit histogram data.*

This API call is for writing histogram data into the IRONdb cluster. The data will be sent as a JSON object containing the data to be added to the cluster.  

### Description

#### URI

`/histogram/write`

#### Method

PUT | POST

#### JSON Format

 * `metric` : The name of the metric for which data is added.
 * `id` : The UUID of the check for the metric for which data is added.
 * `offset` : The timestamp, represented in time since the epoch, for which data is added.
 * `period` : The period for which to add the histogram data. Typically, this will be the smallest histogram period configured on the IRONdb cluster.
 * `histogram` : A base64-encoded compressed representation of the histogram data for this time period.

### Examples

The following example uses a file, `data.json`, containing the JSON object
below and posts it to an IRONdb node.

```
curl -X POST \
     -d @data.json \
     http://127.0.0.1:8112/histogram/write
```

The example JSON object below will add data to the IRONdb cluster for two
histogram metrics, named "example1" and "example2". The data will be added at
offset 1408724400 (August 22, 2014, 12:20:00 GMT).

`data.json` contents:

```json
[
  {
    "offset": 1408724400,
    "id": "ae0f7f90-2a6b-481c-9cf5-21a31837020e",
    "metric": "example1",
    "period": 60,
    "histogram": "AAA="
  },
  {
    "offset": 1408724400,
    "id": "ae0f7f90-2a6b-481c-9cf5-21a31837020e",
    "metric": "example2",
    "period": 60,
    "histogram": "AAA="
  }
]
```

## Writing Numeric Data {##write-nnt}

*This is legacy endpoint.  It is recommended to use the [Raw Data](##write-raw) submission endpoint to submit numeric data.*

This API call is for writing NNT (numeric) data into the IRONdb cluster. It will send a JSON object containing the data to be added to the cluster.

Data should be added for the smallest rollup that exists on the IRONdb node. For example, if the smallest rollup on the cluster is 300 seconds (five minutes), five minute data should be added.

### Description

#### URI

`/write/nnt`

#### Method

PUT | POST

#### JSON Format

 * `metric` : The name of the metric for which data is added.
 * `id` : The UUID of the check for the metric for which data is added.
 * `offset` : The timestamp, represented in time since the epoch, for which data is added.
 * `count` : The number of data points received for the metric over the specified time period.
 * `value` : The average value for the metric over the specified time period.
 * `derivative` : The derivative value for the metric over the specified time period.
 * `counter` : The counter value for the metric over the specified time period.
 * `stddev` : The standard deviation of the average value for the metric over the specified time period.
 * `derivative_stddev` : The standard deviation of the derivative value for the metric over the specified time period.
 * `counter_stddev` : The standard deviation of the counter value for the metric over the specified time period.
 * `parts` : An optional array that contains the raw values that were used to
   calculate the values used above. The data is in the form of a tuple: the
   period (in seconds) that makes up the partial data, and an array of JSON
   objects that contains all of the fields above, except for "offset",
   "metric", and "id". The period value should be the values that are used to
   make up the smallest rollup. For example, if the smallest rollup is 300
   seconds (five minutes) and that data was formed using 60 second (one minute)
   data, the "parts" data should have a period of 60, followed by five JSON
   objects describing the data at each interval.

### Examples

The following example uses a file, data.json, containing the JSON object below and posts it to an IRONdb node.

```
curl -X POST \
     -d @data.json \
     http://127.0.0.1:8112/write/nnt
```

The JSON object below will add data to the IRONdb cluster for two metrics, named "example1" and "example2". It assumes a smallest rollup value of 300 seconds and includes part data on 60 second intervals. The data will be added at offset 1408724400 (August 22, 2014, 12:20:00 GMT).

`data.json` contents:

```json
[
  {
    "derivative": 0,
    "counter": 0,
    "value": 100,
    "count": 5,
    "stddev": 0,
    "derivative_stddev": 0,
    "counter_stddev": 0,
    "offset": 1408724400,
    "id": "ae0f7f90-2a6b-481c-9cf5-21a31837020e",
    "metric": "example1",
    "parts": [
      60,
      [
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        },
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        },
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        },
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        },
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        }
      ]
    ]
  },
  {
    "derivative": 0,
    "counter": 0,
    "value": 100,
    "count": 5,
    "stddev": 0,
    "derivative_stddev": 0,
    "counter_stddev": 0,
    "offset": 1408724400,
    "id": "ae0f7f90-2a6b-481c-9cf5-21a31837020e",
    "metric": "example2",
    "parts": [
      60,
      [
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        },
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        },
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        },
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        },
        {
          "derivative": 0,
          "counter": 0,
          "value": 100,
          "count": 1,
          "stddev": 0,
          "derivative_stddev": 0,
          "counter_stddev": 0
        }
      ]
    ]
  }
]
```
