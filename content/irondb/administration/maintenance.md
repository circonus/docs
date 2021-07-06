---
title: Maintenance
weight: 60
---

# Maintenance

## NNTBS

## Getting The List of NNTBS Timeshards

This API call returns a list of all NNTBS timeshards on the node.

Data will be returned in either FlatBuffers or JSON format based on the HTTP header
`Accept` set by the client. Defaults to `"application/snowth-nnt"`.

### Description

#### URI

`/list_nntbs_shards`

#### Method

GET

#### Inputs

none

#### JSON Output

 * `period` : This field specifies the rollup period for each list of timeshard objects.
  * `shard` : A JSON array of objects containing the state of each timeshard, defined as follows:
    * `block_floor` : Timestamp key for the beginning of the timeshard.
    * `block_ceiling` : Timestamp key for the end of the timeshard.
    * `mode` : The current maintenance mode of the timeshard: `online|offline|offline (pending)`.

### Examples

```
curl -H 'Accept: application/json' http://127.0.0.1:8112/list_nntbs_shards
```

#### Example 1 Output

```
[
  {
    "period": 10,
    "shard": [
      {
        "block_floor": 1598218800,
        "block_ceiling": 1598234040,
        "mode": "online"
      },
      {
        "block_floor": 1598234040,
        "block_ceiling": 1598249280,
        "mode": "online"
      },
      {
        "block_floor": 1598264520,
        "block_ceiling": 1598279760,
        "mode": "online"
      }
    ]
  },
  {
    "period": 60,
    "shard": [
      {
        "block_floor": 1598188320,
        "block_ceiling": 1598279760,
        "mode": "offline"
      },
      {
        "block_floor": 1598279760,
        "block_ceiling": 1598371200,
        "mode": "online"
      }
    ]
  }
]
```

## Setting Maintenance Windows On NNTBS Timeshards 

This API requests a change to the maintenance mode of an NNTBS timeshard on the node.

Data will only be accessed on disk if the timeshard's maintenance mode is `online`.

### Description

#### URI

`/nntbs_shard_maintenance`

#### Method

POST

#### JSON Input

 * A JSON object containing the requested new state of the timeshard, defined as follows:
   * `period` : This field specifies the rollup period for the requested timeshard.
   * `block_floor` : Timestamp key for the beginning of the requested timeshard.
   * `block_ceiling` : Timestamp key for the end of the requested timeshard.
   * `mode` : The requested maintenance mode of the timeshard: `online|offline`.

### Examples

```
curl -d '{ "period": 60, "block_floor": 1598188320, "block_ceiling": 1598279760, "mode": "offline" }' http://localhost:8112/nntbs_shard_maintenance
```

#### Example 1 Output

```
{
  "records": 1,
  "updated": 1,
  "misdirected": 0,
  "errors": 0
}
```

