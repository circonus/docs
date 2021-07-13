---
title: Reconstituting a Snowth Node
weight: 110
---

# Reconstituting a Snowth Node

**Warning:**
>This procedure is only used in circumstances where the node's data is completely unrecoverable. **Always** contact Circonus Support (support@circonus.com) before attempting these procedures.

## Building A Node Within The Same Cluster

This procedure is covered in detail in the [IRONdb Operations
manual](/irondb/administration/rebuilding-nodes).
However, there are some important differences when performing this within the
context of a Circonus Inside deployment:
 * No manual package installation is required. Hooper takes care of installing
   all of the necessary packages.
 * The service name is `circonus-snowth`.
 * Filesystem paths start with `/snowth` instead of `/irondb`, but descendant
   directory structure is the same.
   * When getting the name of the base dataset, use
     ```
     BASE_DATASET=`zfs list -H -o name /snowth`
     ```
 * Use the following command to start the reconstitute or to resume after an
   interruption:
   ```
   sudo /opt/circonus/bin/snowth-start -B
   ```

## Building a Node in a New Cluster from the Old Cluster

> This is a complex task. If you have questions or need assistance, please
> contact Circonus Support (support@circonus.com).

This procedure is covered in detail in the [IRONdb Operations manual](/irondb/administration/migrating-clusters/).
However, there are some important differences when performing this within the
context of a Circonus Inside deployment:
 * No manual package installation is required. Hooper takes care of installing
   all of the necessary packages.
 * The service name is `circonus-snowth`.
 * Filesystem paths start with `/snowth` instead of `/irondb`, but descendant
   directory structure is the same.
 * Use the following command to start the reconstitute or to resume after an
   interruption:
   ```
   sudo /opt/circonus/bin/snowth-start -B \
       -T <source_cluster_topo_hash> \
       -O <source_cluster_node_ip>:<port>
   ```
