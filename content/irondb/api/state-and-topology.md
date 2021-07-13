---
title: State and Topology
weight: 10
---

# State and Topology

## Getting Node State

This API call is for viewing the system state of the current node.

Data will be returned as a JSON document. The fields in this document are described below.

### Description

#### URI

`/state`

#### Method

GET

#### Output

 * `identity` : The UUID that identifies this node.
 * `current` : The current topology in which this node resides.
 * `next` : The next topology for this node.
 * `base_rollup` : The smallest period that is used for rolling up numeric data.
 * `rollups` : An array containing a list of all data periods stored on this node.
 * `nnt` : A container with information about NNT (Numeric) data storage.
   * `rollups` : An array containing a list of all NNT (numeric) data periods stored on this node.
   * `rollup_<period>` : Data for each configured rollup. There will be one of these entries per rollup period.
     * `fs` : Information about file system storage for this rollup.
       * `id` : The ID for this file system.
       * `totalMB` : Megabytes of data used for this file system.
       * `freeMB` : Megabytes of data available for this file system.
     * `put.calls` : The number of put calls for this numeric period.
     * `put.elapsed_us` : The number of microseconds spent putting data for this numeric period.
     * `get.calls` : The number of get calls for this numeric period.
     * `get.proxy_calls` : The number of proxy get calls for this numeric period.
     * `get.count` : The number of metrics retrieved for this numeric period.
     * `get.elapsed_us` : The number of microseconds spent getting data for this numeric period.
     * `extend.calls` : The number of extend calls for this numeric period. (The number of times the system needed to extend an NNT storage file from the beginning.)
   * `aggregate` : Aggregated data from all NNT (numeric) calls. Fields are the same as for each individual rollup.
 * `nnt_cache_size` :   The current size of the NNT file handle cache. When IRONdb opens an NNT file for reading or writing, it will maintain an open file descriptor for it and store it in an LRU cache.
 * `text` : A container with information about text data storage.
   * `fs` : Information about file system storage for text data.
     * `id` : The ID for this file system.
     * `totalMB` : Megabytes of data used for this file system.
     * `freeMB` : Megabytes of data available for this file system.
   * `get` : A container with information about text get calls.
     * `proxy_calls` : The number of text get proxy calls.
     * `err` : The number of text get errors.
     * `calls` : The number of text get calls.
     * `tuples` : The number of text get tuples.
     * `elapsed_us` : The number of microseconds spent getting text data.
   * `put` : A container with information about text put calls.
     * `err` : The number of text put errors.
     * `calls` : The number of text put calls.
     * `tuples` : The number of text put tuples.
     * `elapsed_us` : The number of microseconds spent putting text data.
 * `histogram` : A container with information about histogram data storage.   
   * `rollups` : An array containing a list of all histogram data periods stored on this node.
   * `rollup_<period>` : This describes data for each particular rollup. There will be one of these entries per rollup period.   
     * `fs` : Information about file system storage for this rollup.
       * `id` : The ID for this file system.
       * `totalMB` : Megabytes of data used for this file system.
       * `freeMB` : Megabytes of data available for this file system.
     * `put.calls` : The number of put calls for this histogram period.
     * `put.elapsed_us` : The number of microseconds spent putting data for this histogram period.
     * `get.calls` :   The number of get calls for this histogram period.
     * `get.proxy_calls` : The number of proxy get calls for this histogram period.
     * `get.count` : The number of metrics retrieved for this histogram period.
     * `get.elapsed_us` : The number of microseconds spent getting data for this histogram period.
   * `aggregate` : The aggregated data from all histogram calls. The fields displayed are the same as those listed for each individual rollup.
 * `rusage.utime` : Resource Usage: User CPU time used
 * `rusage.stime` : Resource Usage: System CPU time used
 * `rusage.maxrss` : Resource Usage: Maximum resident set size
 * `rusage.idrss` : Resource Usage: Integral shared memory size
 * `rusage.minflt` : Resource Usage: Page reclaims (soft page faults)
 * `rusage.majflt` : Resource Usage: Page faults (hard page faults)
 * `rusage.nswap` : Resource Usage: Swaps
 * `rusage.inblock` : Resource Usage: Block input operations
 * `rusage.oublock` : Resource Usage: Block output operations
 * `rusage.msgsnd` : Resource Usage: IPC messages sent
 * `rusage.msgrcv` : Resource Usage: IPC messages received
 * `rusage.nsignals` : Resource Usage: Signals received
 * `rusage.nvcsw` : Resource Usage: Voluntary context switches
 * `rusage.nivcsw` : Resource Usage: Involuntary context switches
 * `max_peer_lag` : The maximum amount, in seconds, by which the data on this node is behind any of the other IRONdb nodes.
 * `avg_peer_lag` : The average amount, in seconds,  by which the data on this node is behind any of the other IRONdb nodes.
 * `features` : The features that are enabled on this node.
   * `text:store` : Appears if text data storage is enabled on this node.
   * `histogram:store` : Appears if histogram data storage is enabled on this node.
   * `nnt:second_order` : Appears if second order derivatives for numeric data is enabled on this node.
   * `histogram:dynamic_rollups` : Appears if dynamic histogram rollups are enabled on this node.
   * `nnt:store` : Appears if numeric data storage is enabled on this node.
   * `features` : Appears if feature flagging is enabled on this node.
 * `version` : The version of the IRONdb software running on this node.
 * `application` : The name of this application.

### Examples

```
curl http://127.0.0.1:8112/state
```

#### Example 1 Output

```json
{
  "identity": "5b5ea6c5-bd98-4293-91ee-ecbdf9bfb0cc",
  "current": "0123456789012345678901234567890123456789012345678901234567890abcd",
  "next": "-",
  "base_rollup": 300,
  "rollups": [
    300,
    1800,
    10800,
    86400
  ],
  "nnt": {
    "rollups": [
      300,
      1800,
      10800,
      86400
    ],
    "rollup_300": {
      "fs": {
        "id": 12345678,
        "totalMb": 198981.20459,
        "availMb": 182572.629395
      },
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.calls": 0,
      "get.proxy_calls": 0,
      "get.count": 0,
      "get.elapsed_us": 0,
      "extend.calls": 0
    },
    "rollup_1800": {
      "fs": {
        "id": 12345678,
        "totalMb": 198981.20459,
        "availMb": 182572.629395
      },
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.calls": 252,
      "get.proxy_calls": 0,
      "get.count": 88140,
      "get.elapsed_us": 8342,
      "extend.calls": 0
    },
    "rollup_10800": {
      "fs": {
        "id": 12345678,
        "totalMb": 198981.20459,
        "availMb": 182572.629395
      },
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.calls": 0,
      "get.proxy_calls": 0,
      "get.count": 0,
      "get.elapsed_us": 0,
      "extend.calls": 0
    },
    "rollup_86400": {
      "fs": {
        "id": 12345678,
        "totalMb": 198981.20459,
        "availMb": 182572.629395
      },
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.calls": 0,
      "get.proxy_calls": 0,
      "get.count": 0,
      "get.elapsed_us": 0,
      "extend.calls": 0
    },
    "aggregate": {
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.calls": 255,
      "get.proxy_calls": 0,
      "get.count": 118653,
      "get.elapsed_us": 8829,
      "extend.calls": 0
    }
  },
  "nnt_cache_size": 76,
  "text": {
    "fs": {
      "id": 12345678,
      "totalMb": 182607.098633,
      "availMb": 182572.629395
    },
    "get": {
      "proxy_calls": 0,
      "err": 0,
      "calls": 9,
      "tuples": 9,
      "elapsed_us": 45997
    },
    "put": {
      "err": 0,
      "calls": 0,
      "tuples": 0,
      "elapsed_us": 0
    }
  },
  "histogram": {
    "rollups": [
      60,
      300,
      1800,
      10800,
      86400
    ],
    "rollup_60": {
      "fs": {
        "id": 12345678,
        "totalMb": 186335.980957,
        "availMb": 182572.629395
      },
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.proxy_calls": 0,
      "get.calls": 0,
      "get.count": 0,
      "get.elapsed_us": 0
    },
    "rollup_300": {
      "fs": {
        "id": 12345678,
        "totalMb": 186335.980957,
        "availMb": 182572.629395
      },
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.proxy_calls": 0,
      "get.calls": 0,
      "get.count": 0,
      "get.elapsed_us": 0
    },
    "rollup_1800": {
      "fs": {
        "id": 12345678,
        "totalMb": 186335.980957,
        "availMb": 182572.629395
      },
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.proxy_calls": 0,
      "get.calls": 29,
      "get.count": 8787,
      "get.elapsed_us": 173635
    },
    "rollup_10800": {
      "fs": {
        "id": 12345678,
        "totalMb": 186335.980957,
        "availMb": 182572.629395
      },
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.proxy_calls": 0,
      "get.calls": 1,
      "get.count": 1,
      "get.elapsed_us": 13427
    },
    "rollup_86400": {
      "fs": {
        "id": 12345678,
        "totalMb": 186335.980957,
        "availMb": 182572.629395
      },
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.proxy_calls": 0,
      "get.calls": 0,
      "get.count": 0,
      "get.elapsed_us": 0
    },
    "aggregate": {
      "put.calls": 0,
      "put.elapsed_us": 0,
      "get.proxy_calls": 0,
      "get.calls": 30,
      "get.count": 8788,
      "get.elapsed_us": 187062
    }
  },
  "rusage.utime": 9.716393,
  "rusage.stime": 6.044374,
  "rusage.maxrss": 0,
  "rusage.idrss": 0,
  "rusage.minflt": 0,
  "rusage.majflt": 0,
  "rusage.nswap": 0,
  "rusage.inblock": 0,
  "rusage.oublock": 0,
  "rusage.msgsnd": 23754,
  "rusage.msgrcv": 22521,
  "rusage.nsignals": 0,
  "rusage.nvcsw": 330493,
  "rusage.nivcsw": 2614,
  "max_peer_lag": 0,
  "features": {
    "text:store": "1",
    "histogram:store": "1",
    "nnt:second_order": "1",
    "histogram:dynamic_rollups": "1",
    "nnt:store": "1",
    "features": "1"
  },
  "version": "v307e4ccc03e73edee27f86da8d4faecd3220a93c/e63e3b5158b8508cef6a932df33279be43d1362c",
  "application": "snowth"
}
```

## Retrieving Gossip JSON Data

This API call retrieves gossip information from a IRONdb node. Gossip data is information on how the nodes are communicating with each other and if any nodes are behind other nodes with regards to data replication.

Data will be returned as an array of JSON objects. The format of these objects is described below.

### Description

#### URI

`/gossip/json`

#### Method

GET

#### Inputs

none

#### Output

 * `id` : The UUID of the node whose gossip information follows.
 * `gossip_time` : The last time, in seconds, that this node received a gossip message.
 * `gossip_age` : The difference, in seconds, between the last time this node
   received a gossip message and the current time.
 * `topo_current` : The topology that is currently in use.
 * `topo_next` : The "next" topology to use.
 * `topo_state` : The state of the current topology.
 * `latency` : A JSON object that contains information on how far this node is
   lagging behind the other nodes. The entries will include the following:
   * `<uuid>` :  The UUID of the node to which the current node is being compared.
   * `<latency_seconds>` : The number of seconds that the current node is behind the specified node.

### Examples

```
curl http://127.0.0.1:8112/gossip/json
```

#### Example 1 Output

```json
[
  {
    "id":"1f846f26-0cfd-4df5-b4f1-e0930604e577",
    "gossip_time":"1409082055.744880",
    "gossip_age":"0.000000",
    "topo_current":"0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "topo_next":"-",
    "topo_state":"n/a",
    "latency": {
      "765ac4cc-1929-4642-9ef1-d194d08f9538":"0",
      "8c2fc7b8-c569-402d-a393-db433fb267aa":"0",
      "07fa2237-5744-4c28-a622-a99cfc1ac87e":"0"
    }
  },
  {
    "id":"765ac4cc-1929-4642-9ef1-d194d08f9538",
    "gossip_time":"1409082055.744880",
    "gossip_age":"0.000000",
    "topo_current":"0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "topo_next":"-",
    "topo_state":"n/a",
    "latency": {
      "1f846f26-0cfd-4df5-b4f1-e0930604e577":"0",
      "8c2fc7b8-c569-402d-a393-db433fb267aa":"0",
      "07fa2237-5744-4c28-a622-a99cfc1ac87e":"0"
     }
  },
  {
    "id":"8c2fc7b8-c569-402d-a393-db433fb267aa",
    "gossip_time":"1409082055.744880",
    "gossip_age":"0.000000",
    "topo_current":"0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "topo_next":"-",
    "topo_state":"n/a",
    "latency": {
      "765ac4cc-1929-4642-9ef1-d194d08f9538":"0",
      "1f846f26-0cfd-4df5-b4f1-e0930604e577":"0",
      "07fa2237-5744-4c28-a622-a99cfc1ac87e":"0"
     }
  },
  {
    "id":"07fa2237-5744-4c28-a622-a99cfc1ac87e",
    "gossip_time":"1409082055.744880",
    "gossip_age":"0.000000",
    "topo_current":"0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "topo_next":"-",
    "topo_state":"n/a",
    "latency": {
      "765ac4cc-1929-4642-9ef1-d194d08f9538":"0",
      "8c2fc7b8-c569-402d-a393-db433fb267aa":"0",
      "1f846f26-0cfd-4df5-b4f1-e0930604e577":"0"
     }
  }
]
```
## Retrieving Gossip XML Data

This API call retrieves gossip information from a Snowth node. Gossip data is
information on how the nodes are communicating with each other and if any nodes
are behind other nodes with regards to data replication.

Data will be returned an XML object. The format of this object is described
below.

### Description

#### URI

`/gossip/xml`

#### Method

GET

#### Output


 * `<nodes>` : The top-level element for the topology.
   * `<node>` : The container for all the information for a single node in the cluster. There will x of these elements, where "x" is the number of nodes in the cluster.
     * Attributes:
       * `id` : The UUID of the node whose gossip information follows.
       * `gossip_time` : The last time, in seconds, that this node received a gossip message.
       * `gossip_age` :  The difference, in seconds, between the last time this node received a gossip message and the current time.
       * `topo_current` : The topology that is currently in use.
       * `topo_next` : The "next" topology to use.
       * `topo_state` : The state of the current topology.
     * `<latency>` : The element containing latency information for all non-local nodes. 
       * `<node>` : The element containing latency information for a non-local node.
         * Attributes:
           * `id` : The UUID of the node to which the current node is being compared.
           * `diff` : The number of seconds that the current node is behind the specified node.

### Examples

```
curl http://127.0.0.1:8112/gossip/xml
```

#### Example 1 Output

```xml
<nodes>
  <node id="1f846f26-0cfd-4df5-b4f1-e0930604e577"
        gossip_time="1409082055.744880"
        gossip_age="0.000000"
        topo_current="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
        topo_next="-"
        topo_state="unknown">
    <latency>
      <node id="765ac4cc-1929-4642-9ef1-d194d08f9538" diff="0"/>
      <node id="8c2fc7b8-c569-402d-a393-db433fb267aa" diff="0"/>
      <node id="07fa2237-5744-4c28-a622-a99cfc1ac87e" diff="0"/>
    </latency>
  </node>
  <node id="765ac4cc-1929-4642-9ef1-d194d08f9538"
        gossip_time="1409082055.744880" 
        gossip_age="0.000000" 
        topo_current="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" 
        topo_next="-" 
        topo_state="unknown">
    <latency>
      <node id="1f846f26-0cfd-4df5-b4f1-e0930604e577" diff="0"/>
      <node id="8c2fc7b8-c569-402d-a393-db433fb267aa" diff="0"/>
      <node id="07fa2237-5744-4c28-a622-a99cfc1ac87e" diff="0"/>
    </latency>
  </node>
  <node id="8c2fc7b8-c569-402d-a393-db433fb267aa"
        gossip_time="1409082055.744880"
        gossip_age="0.000000"
        topo_current="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
        topo_next="-"
        topo_state="unknown">
    <latency>
      <node id="765ac4cc-1929-4642-9ef1-d194d08f9538" diff="0"/>
      <node id="1f846f26-0cfd-4df5-b4f1-e0930604e577" diff="0"/>
      <node id="07fa2237-5744-4c28-a622-a99cfc1ac87e" diff="0"/>
    </latency>
  </node>
  <node id="07fa2237-5744-4c28-a622-a99cfc1ac87e"
        gossip_time="1409082055.744880"
        gossip_age="0.000000"
        topo_current="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
        topo_next="-"
        topo_state="unknown">
    <latency>
      <node id="765ac4cc-1929-4642-9ef1-d194d08f9538" diff="0"/>
      <node id="8c2fc7b8-c569-402d-a393-db433fb267aa" diff="0"/>
      <node id="1f846f26-0cfd-4df5-b4f1-e0930604e577" diff="0"/>
    </latency>
  </node>
</nodes>       
```
## Loading a New Topology

This API call will load a new topology onto an IRONdb node. It will not
activate the topology; it will simply store and load it.

### Description

#### URI

`/topology/<hash>`

#### Method

POST

#### Inputs

* `hash` : The hash for the new topology to load.

#### XML Format

 * `<nodes>` : Top-Level element for the topology.
   * Attributes:
     * `n`: The number of nodes on which the data will be stored.
   * `<node>` : The container for all the information on a single node in the cluster. There will be up to x of these, where "x" is the number of nodes in the cluster.
     * Attributes:
       * `id` : The UUID of the node.
       * `address` : The IP Address of the node.
       * `port` : The port on which the node is listening.
       * `apiport` : The port on which the API is listening for the node.
       * `weight` : A value representing the relative preference weight of this
         node for metric ownership, compared to its peers.

### Examples

The following example uses a file, `data.xml`, containing the XML document below
and posts it to an IRONdb node.

```
curl -X POST \
     -d @data.xml \
     http://127.0.0.1:8112/topology/0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

In this example:

 * `topology` : The command to handle topology data.
 * `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` : This is
   the topology hash

`data.xml` contents:

```xml
<nodes n="2">
  <node id="1f846f26-0cfd-4df5-b4f1-e0930604e577"
        address="10.8.20.1"
        port="8112"
        apiport="8112"
        weight="32"/>
  <node id="765ac4cc-1929-4642-9ef1-d194d08f9538"
        address="10.8.20.2"
        port="8112"
        apiport="8112"
        weight="32"/>
  <node id="8c2fc7b8-c569-402d-a393-db433fb267aa"
        address="10.8.20.3"
        port="8112"
        apiport="8112"
        weight="32"/>
  <node id="07fa2237-5744-4c28-a622-a99cfc1ac87e"
        address="10.8.20.4"
        port="8112"
        apiport="8112"
        weight="32"/>
</nodes>
```
## Activating A New Topology

Switches a node to a new topology.

> **Caution**
>
> THIS IS A DANGEROUS CALL. DO NOT USE IT UNLESS YOU ARE SURE YOU KNOW WHAT YOU ARE DOING.

### Description

#### URI
`/activate/<hash>`

#### Method
GET

#### Inputs

 * `hash` : The hash of the new topology after the transition.

### Examples

```
curl http://127.0.0.1:8112/activate/0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

In this example:

 * `activate` : This is the command to activate a new topology.
 * `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` : The new topology's hash 
## Retrieving Topology JSON Data

This API call retrieves data for a given topology in JSON format.

Data will be returned as an array of JSON objects. The format of these objects is described below.

### Description

#### URI

`/topology/json/<hash>`

#### Method

GET

#### Inputs

 * `hash` : The hash of the topology for which to retrieve information.

#### Output

 * `id` : The UUID of the node.
 * `address` : The IP Address of the node.
 * `port` : The port on which the node is listening.
 * `apiport` : The port on which the API is listening for the node.
 * `weight` : A value representing how heavily the data to be stored on this node is weighted.
 * `n` : The number of nodes on this ring on which data is stored.

### Examples

```
curl http://127.0.0.1:8112/topology/json/0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

In this example:

 * `read` : This is the command to read topology data from the server.
 * `json` : This is the command to read data in JSON format.
 * `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` : This is the Topology Hash.

#### Example 1 Output

```json
[
  {
    "id": "1f846f26-0cfd-4df5-b4f1-e0930604e577",
    "address": "10.8.20.1",
    "port": 8112,
    "apiport": 8112,
    "weight": 32,
    "n": 2
  },
  {
    "id": "765ac4cc-1929-4642-9ef1-d194d08f9538",
    "address": "10.8.20.2",
    "port": 8112,
    "apiport": 8112,
    "weight": 32,
    "n": 2
  },
  {
    "id": "8c2fc7b8-c569-402d-a393-db433fb267aa",
    "address": "10.8.20.3",
    "port": 8112,
    "apiport": 8112,
    "weight": 32,
    "n": 2
  },
  {
    "id": "07fa2237-5744-4c28-a622-a99cfc1ac87e",
    "address": "10.8.20.4",
    "port": 8112,
    "apiport": 8112,
    "weight": 32,
    "n": 2
  }
]
```
## Retrieving Topology XML Data

This API call retrieves data for a given topology in XML format.

Data will be returned as an XML document. The format of this document is described below.

### Description

#### URI

`/topology/xml/<hash>`

#### Method

GET

#### Inputs

 * `hash` : The hash of the topology for which to retrieve information.

#### Output

* `<nodes>` : The Top-Level element for the topology.
  * Attributes:
    * `n` : The number of nodes on which the data will be stored.
 * `<node>` : The container for all the information on a single node in the
   cluster. There will be up to x of these, where "x" is the number of nodes in
   the cluster.
   * Attributes:
     * `id` : The UUID of the node.
     * `address` : The IP Address of the node.
     * `port` : The port on which the node is listening.
     * `apiport` : The port on which the API is listening for the node.
     * `weight` : A value representing how heavily the data to be stored on this node is weighted.

### Examples

```
curl http://127.0.0.1:8112/topology/xml/0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

In this example:

 * `topology` : This is the command to read topology data from the server.
 * `xml` : This is the command to read data in XML format.
 * `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` : This is the Topology Hash.

#### Example 1 Output

```xml
<nodes n="2">
  <node id="1f846f26-0cfd-4df5-b4f1-e0930604e577"
        address="10.8.20.1"
        port="8112"
        apiport="8112"
        weight="32"/>
  <node id="765ac4cc-1929-4642-9ef1-d194d08f9538"
        address="10.8.20.2"
        port="8112"
        apiport="8112"
        weight="32"/>
  <node id="8c2fc7b8-c569-402d-a393-db433fb267aa"
        address="10.8.20.3"
        port="8112"
        apiport="8112"
        weight="32"/>
  <node id="07fa2237-5744-4c28-a622-a99cfc1ac87e"
        address="10.8.20.4"
        port="8112"
        apiport="8112"
        weight="32"/>
</nodes>
```
## Retrieving Toporing JSON Data

This API call retrieves topology ring data for a given topology in JSON format.

Data will be returned as an array of JSON objects. The format of these objects is given below.

### Description

#### URI

`/toporing/json/<hash>`

#### Method

GET

#### Inputs

 * `hash` : The hash of the topology to retrieve information for.

#### Output

 * `id` : The UUID of the node.
 * `idx` : The index of an entry in the toporing. This is a number between 1 and n, where "n" is the weight of the node.
 * `location` : The given location of the node.

### Examples

This example retrieves a simplified topology for a 3-node cluster, assuming a weight of 3.

```
curl http://127.0.0.1:8112/toporing/json/0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

In this example:

 * `toporing` : This is the command to read toporing data from the server.
 * `json` : This is the command to read data in JSON format.
 * `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` : This is the Topology Hash.

#### Example 1 Output

```json
[
   {"id":"1f846f26-0cfd-4df5-b4f1-e0930604e577","idx":1,"location":11.000000},
   {"id":"1f846f26-0cfd-4df5-b4f1-e0930604e577","idx":2,"location":22.000000},
   {"id":"1f846f26-0cfd-4df5-b4f1-e0930604e577","idx":3,"location":33.000000},
   {"id":"765ac4cc-1929-4642-9ef1-d194d08f9538","idx":1,"location":44.000000},
   {"id":"765ac4cc-1929-4642-9ef1-d194d08f9538","idx":2,"location":55.000000},
   {"id":"765ac4cc-1929-4642-9ef1-d194d08f9538","idx":3,"location":66.000000},
   {"id":"8c2fc7b8-c569-402d-a393-db433fb267aa","idx":1,"location":77.000000},
   {"id":"8c2fc7b8-c569-402d-a393-db433fb267aa","idx":2,"location":88.000000},
   {"id":"8c2fc7b8-c569-402d-a393-db433fb267aa","idx":3,"location":99.000000}
]
```
## Retrieving Toporing XML Data

This API call retrieves toporing data for a given topology in XML format.

Data will be returned as a XML object. The format of this object is given below.

### Description

#### URI

`/toporing/xml/<hash>`

#### Method

GET

#### Inputs

 * `hash` : The hash of the topology for which to retrieve information.

#### Output

 * `<vnodes>` : The Top-Level element for the topology.
   * Attributes:
     * `n` : The number of nodes on which the data will be stored.
   * `<vnode>` : The container for all the information for a single virtual node in the cluster.
     * Attributes:
       * `id` : The UUID of the node.
       * `idx` : The index of an entry in the toporing. This is a number between 1 and n, where "n" is the weight of the node.
       * `location` : The given location of the node.

### Examples

This example retrieves a simplified topology for a 3-node cluster, assuming a weight of 3.

```
curl http://127.0.0.1:8112/toporing/xml/0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

In this example:

 * `toporing` : This is the command to read toporing data from the server.
 * `xml` : This is the command to read data in XML format.
 * `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` : This is the Topology Hash.

#### Example 1 Output

```xml
<vnodes n="2">
  <vnode id="1f846f26-0cfd-4df5-b4f1-e0930604e577"
         idx="1"
         location="11.000000"/>
  <vnode id="1f846f26-0cfd-4df5-b4f1-e0930604e577"
         idx="2"
         location="22.000000"/>
  <vnode id="1f846f26-0cfd-4df5-b4f1-e0930604e577"
         idx="3"
         location="33.000000"/>
  <vnode id="765ac4cc-1929-4642-9ef1-d194d08f9538"
         idx="1"
         location="44.000000"/>
  <vnode id="765ac4cc-1929-4642-9ef1-d194d08f9538"
         idx="2"
         location="55.000000"/>
  <vnode id="765ac4cc-1929-4642-9ef1-d194d08f9538"
         idx="3"
         location="66.000000"/>
  <vnode id="8c2fc7b8-c569-402d-a393-db433fb267aa"
         idx="1"
         location="77.000000"/>
  <vnode id="8c2fc7b8-c569-402d-a393-db433fb267aa"
         idx="2"
         location="88.000000"/>
  <vnode id="8c2fc7b8-c569-402d-a393-db433fb267aa"
         idx="3"
         location="99.000000"/>
</nodes>
```
## Retrieving Data Location in JSON Format

This API call retrieves a list of all of the nodes on which a metric resides.

Data will be returned as a JSON object. The format of this object is described below.

### Description

#### URI

`/locate/json/<uuid>/<metric>`

#### Method

GET

#### Inputs

 * `uuid` : The UUID of the check to which the metric belongs.
 * `metric` : The name of the metric to locate.

#### Output

 * `key` : The key used to locate the metric. It is in the form `<UUID>-<metric>`.
 * `location` : An array of JSON objects representing the nodes on which the
   data resides. The format of each object in the array is as follows:
   * `id` : The UUID of the node.
   * `address` : The IP Address of the node.
   * `port` : The port on which the node is listening.
   * `apiport` : The port on which the API is listening for the node.
   * `weight` : A value representing the relative preference weight of this
     node for metric ownership, compared to its peers.
   * `n` : The number of nodes in the topology on which data is stored.

### Examples

```
curl http://127.0.0.1:8112/locate/json/6f6bdc73-2352-4bdc-ab0e-72f66d0dee12/example
```

In this example:

 * `locate` : This is the command to locate a check/metric.
 * `json` : This is the command to read data in JSON format.
 * `6f6bdc73-2352-4bdc-ab0e-72f66d0dee12` : This is the Check UUID.
 * `example` : This is the Metric.

#### Example 1 Output

```json
{
  "key": "6f6bdc73-2352-4bdc-ab0e-72f66d0dee12-example",
  "location": [
    {
      "id": "1f846f26-0cfd-4df5-b4f1-e0930604e577",
      "address": "10.8.20.1",
      "port": 8112,
      "apiport": 8112,
      "weight": 32,
      "n": 2
    },
    {
      "id": "07fa2237-5744-4c28-a622-a99cfc1ac87e",
      "address": "10.8.20.4",
      "port": 8112,
      "apiport": 8112,
      "weight": 32,
      "n": 2
    }
  ]
}
```
## Retrieving Data Location in XML Format

This API call retrieves a list of all of the nodes on which a metric resides.

Data will be returned as an XML document. The format of this document is described below.

### Description

#### URI

`/locate/xml/<uuid>/<metric>`

#### Method

GET

#### Inputs

 * `uuid` : The UUID of the check to which the metric belongs.
 * `metric` : The name of the metric to locate.

#### Output

 * `<nodes>` : The Top-Level XML for the topology.
  * Attributes:
    * `n` : The number of nodes on which the data will be stored.
  * `<node>` : The container for all the information on a single node in the
    cluster. There will be up to x of these, where "x" is the number of nodes
    in the cluster.
    * Attributes:
      * `id` : The UUID of the node.
      * `address` : The IP Address of the node.
      * `port` : The port on which the node is listening.
      * `apiport` : The port on which the API is listening for the node.
      * `weight` : A value representing the relative preference weight of this
        node for metric ownership, compared to its peers.

### Examples

```
curl http://127.0.0.1:8112/locate/xml/6f6bdc73-2352-4bdc-ab0e-72f66d0dee12/example
```

In this example:

 * `locate` : This is the command to locate a check/metric.
 * `xml` : This is the command to read data in XML format.
 * `6f6bdc73-2352-4bdc-ab0e-72f66d0dee12` : This is the Check UUID.
 * `example` : This is the Metric.

#### Example 1 Output

```xml
<nodes n="2">
  <node id="1f846f26-0cfd-4df5-b4f1-e0930604e577"
           address="10.8.20.1"
           port="8112"
           apiport="8112"
           weight="32"/>
  <node id="07fa2237-5744-4c28-a622-a99cfc1ac87e"
           address="10.8.20.4"
           port="8112"
           apiport="8112"
           weight="32"/>
</nodes>
```
