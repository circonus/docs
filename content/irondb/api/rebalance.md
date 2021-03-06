---
title: Rebalance
weight: 20
---

# Rebalance

## Activating a New Topology Rebalance

This API call is for rebalancing to a new topology.

### Description

#### URI

`/rebalance/activate/<hash>`

#### Method

POST

#### Inputs

 * `hash` : The hash of the new topology after the rebalance.

### Examples

```
curl -X POST \
  http://127.0.0.1:8112/rebalance/activate/0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

In this example:

 * `activate` : This is the command to activate a new topology rebalance.
 * `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` : This is the hash for the transition.

## Getting Topology Rebalance State

This API call is for viewing the current topology rebalance state.

Data will be returned as a JSON document. The fields in this document are described below.

### Description

#### URI

`/rebalance/state`

#### Method

GET

#### Output

 * `current` : The current topology in which this node resides.
 * `next` : The next topology for this node.
 * `state` : Current rebalance state for this node. Value is one of:
   * `TOPO_REBALANCE_IDLE` (no rebalance activity)
   * `TOPO_REBALANCE_VOTE` (establishing agreement on next hash across the cluster)
   * `TOPO_REBALANCE_REHASH` (relocating data)
   * `TOPO_REBALANCE_REHASH_VOTE` (waiting for data relocation completion on all nodes)
   * `TOPO_REBALANCE_CLEANUP` (removing data from old topology)
   * `TOPO_REBALANCE_COMPLETE` (local operations complete, switching to next
     topology)
   * `TOPO_REBALANCE_COMPLETE_VOTE` (waiting for all other nodes to complete
     and switch to the next topology)

During a rebalance operation, each node will proceed through the above states
in order, returning to `TOPO_REBALANCE_IDLE` when finished. The topology that
was listed as "next" is now "current", and "next" is now "-", meaning no next
topology.

### Examples

```
curl http://127.0.0.1:8112/rebalance/state
```

#### Example 1 Output

```json
{
  "current": "071b9fe756e07a8656273546d504dbc69c356c9ed525aacf898e3cceb3778755",
  "next": "8bd44d5240847b8aa67435492d0b93e334ee6e3725afe02ee83821aee60b803f",
  "state": "TOPO_REBALANCE_COMPLETE"
}
```

## Abort the Current in Progress Topology Rebalance

This API call is for aborting the current rebalancing to a new topology.

### Description

#### URI

`/rebalance/deactivate/<hash>`

#### Method

POST

#### Inputs

 * `hash` : The hash of the new topology after the rebalance.

### Examples

```
curl -X POST \
  http://127.0.0.1:8112/rebalance/deactivate/0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

In this example:

 * `deactivate` : This is the command to activate a new topology rebalance.
 * `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` : This is the hash for the transition.
