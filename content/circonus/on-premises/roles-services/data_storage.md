---
title: Data Storage
weight: 50
---

## Data Storage {#DataStorage}
This component is now branded as IRONdb&reg;, though for historical reasons its
service name retains the "snowth" terminology.

IRONdb&reg; has its own
[documentation](https://login.circonus.com/resources/docs/irondb/) and will be
referenced from this document, but there are differences when it is employed as
part of a full Circonus deployment, so any specifics documented here supersede
the IRONdb manual.

The following are important differences from standalone IRONdb:

 * IRONdb&reg; runs as the service `circonus-snowth` (EL7) or
   `svc:/network/snowth:default` (OmniOS), listening externally on port 8112
   and locally on port 32322.  Like other libmtev-based applications, this
   service has two processes: a child and a parent, which serves as watchdog
   for the child.
 * The config file is `snowth.conf`, and is managed by Hooper. Local changes
   will be lost on the next Hooper run, so this file should only be modified at
   the direction of Circonus Support or during troubleshooting. All
   configurable options are in
   [site.json](https://login.circonus.com/resources/docs/inside/InstallGeneral.html#data_storageAttributes).

IRONdb&reg; is sensitive to CPU and IO limits. If either resource is limited,
you may see child processes being killed off by the parent when they do not
heartbeat on time.

Log files are located under `/snowth/logs` and include the following files:

 * `accesslog`
 * `errorlog`
 * `startuplog`

The access logs are useful to verify activity going to the server in question.
Error logs will contain any errors the operator should be aware of, and startup
logs may contain debugging information for Support personnel.

If the snowthd child process becomes unstable, verify that the host is not
starved for resources (CPU, IO, memory).  Hardware disk errors can also impact
snowth's performance. On OmniOS, run `iostat -zxne` and look for non-zero
counts in the `h/w` column. On EL7, install
[smartmontools](https://www.smartmontools.org/) and run `smartctl` on each
disk, looking for uncorrected errors. If in doubt, contact Circonus Support
(support@circonus.com) for assistance.

If instability continues, you can run snowth in the foreground.  First, determine the node's ID by doing an:
```
ls /snowth/data/
```

Then, run the following as root:
```
/opt/circonus/sbin/snowthd -D -d \
  -u nobody \
  -g nobody \
  -c /opt/circonus/etc/snowth.conf \
  -i <nodeid from previous command>
```

Like the broker, running snowth in the foreground should allow you to capture a core dump, which Circonus Support can use to diagnose your problem.


### Operations Dashboard {#OperationsDashboard}
IRONdb&reg; comes with built-in operational dashboard accessible from any data
storage host on port 8112 in your browser, e.g., http://snowthhost:8112. This
interface provides real-time information about the data storage cluster.  

See the [IRONdb
manual](https://login.circonus.com/resources/docs/irondb/operations.html#operations-dashboard)
for details on the dashboard.

### Performing Cluster Restarts {#PerformingClusterRestarts}
Any planned maintenance that requires restarting of a IRONdb&reg; node (such as
a host reboot, but also including a Hooper run that updates the
`platform/snowth` package) should be performed with care to let the cluster
"settle" after each node restart.  Restarting too many nodes too quickly can
cause a cascade of additional work that will dramatically lengthen the time
required to return to a normal operating state and may adversely impact the
availability of the entire cluster.

**Note:**
> The general rule of thumb is to allow about two minutes between Hooper runs
> or any other disruptive maintenance on `data_storage` machines, subject to
> observation of the replication latency described below.

Watch the "Replication Latency" tab of the Operations Dashboard during the restart process, noting the restarted node's lag relative to the others. It normally takes 30-60 seconds for the cluster to settle after a single node restart, but this may vary depending on the ingestion rate (how busy your cluster is).  Do not restart the next node until the replication latency of the restarted node returns to green relative to all the other nodes.



## Snowth ZFS Condensing {#SnowthZFSCondensing}
Circonus Engineering has identified an issue that stems from the specific write
workload placed on the system by the Data Storage application (IRONdb&reg;).
Over time, this may lead to severely reduced write performance and cluster
instability. This issue primarily affects clusters running on OmniOS that have
been installed for more than 6 months.

To prevent this issue from occurring, Circonus recommends that cluster
operators periodically rewrite the numeric storage portion of the data
on each cluster node. This condenses the space allocations and prevents the
performance problem.

**Note:**
> This maintenance should be performed every 6 months, or until Circonus
> Engineering devises a permanent fix in IRONdb&reg; to prevent this issue. It
> should be performed on one node at a time, allowing the node to completely
> recover and catch up with its peers before continuing to the next node. The
> procedure is described below.

While this maintenance is being performed on a node, it will be unavailable to
receive new incoming metric data. Metric data destined for this node will be
journaled on other nodes in the cluster and replayed to it when it is returned
to service.

Because this procedure involves copying the bulk of the stored metric data,
there must be sufficient space available on the node. If the overall zpool
usage is more than 45% of the total size of the pool, the node should instead
be [reconstituted](../ReconstitutingaSnowthnode.md).

If you have any questions concerning this issue, please contact Circonus
Support (support@circonus.com).


### Reallocation Procedure {#ReallocationProcedure}

**NOTE:**
> If the application is running in a non-global zone, then this procedure
> should be performed within that zone.

These steps are to be performed by a privileged user, and due to the length of time some commands take, it is recommended to use tmux or screen.

 1. Stop the snowth service.
        svcadm disable snowth
    
 2. Identify the numeric metric data dataset.  Hereafter, this will be referred to as `<snowth-data>`. Use the actual dataset in the commands below.
        zfs list -H -o name /snowth/data

 1. Create a source snapshot.
        zfs snapshot <snowth-data>@condense

 1. Estimate the stream send size.  Note both the size and the unit of measure (typically, 'G' or 'T'). This is only an estimate; the actual send size may be slightly larger.
        zfs send -nv <snowth-data>@condense

 1. Perform the send/recv operation, using `/usr/bin/pv` (pipe-viewer) to measure progress.  Here, `<size>` is the number from the stream estimate plus the unit of measure, such as "900G".  pv will display, from left to right, a count of bytes transferred, an elapsed timer, the current transfer rate, the average transfer rate since start, and an ETA for completion.
        zfs send -p <snowth-data>@condense | \
          pv -r -a -b -t -e -s <size> -B 512m | \
          zfs recv <snowth-data>-new
 
 1. Destroy the source snapshot.
        zfs destroy <snowth-data>@condense

 1. Destroy the old dataset.
        zfs destroy <snowth-data>
 
 1. Note that even though the previous command returns quickly, the actual freeing of data from the pool takes much longer and happens in the background.  Do not proceed to the next step until the old data is finished being freed.  You can monitor the freeing process with this command:
        zpool get freeing

 1. When the above command reports 0 data freeing for the pool containing the Snowth datasets, rename the new dataset to the old name.
        zfs rename <snowth-data>-new <snowth-data>

 1. Destroy the destination snapshot.
        zfs destroy <snowth-data>@condense

 1. Run Hooper in its maintenance mode to make sure all settings are correct and then enable snowth.
        /opt/circonus/bin/run-hooper -m

 1. Monitor the replay process using the Snowth Operations Dashboard.  The node that has just been condensed will be receiving journal batches from all the other nodes.  When its replication latency relative to all other nodes has returned to green, it is safe to proceed to the next node in the cluster.

## Delete Sweep Snowth API {#DeleteSweepSnowthAPI}
Delete Sweep is a procedure that allows users to quickly remove large amounts
of data from storage using the IRONdb&reg; API. It is useful in implementing a
retention policy, as it can remove all data prior to a given date.

See the [IRONdb API
manual](https://login.circonus.com/resources/docs/irondb/api/delete-sweep.html)
for details.


## Snowth Troubleshooting {#SnowthTroubleshooting}
Refer to the [Snowth
Troubleshooting](/Troubleshooting.md#SnowthTroubleshooting) section for
additional Data Storage troubleshooting instructions.


### Reconstituting a Data Storage Node {#ReconstitutingaDataStorageNode}
For instructions, refer to the section "[Reconstituting a Data Storage
node](/ReconstitutingaSnowthnode.md)". This procedure is only used in
circumstances where the node's data is completely unrecoverable, or when there
is not enough space for a [condense](#SnowthZFSCondensing). Always contact
Circonus Support (support@circonus.com) before attempting these procedures.
