---
title: Data Storage
weight: 50
---

# Data Storage

This component is now branded as IRONdb&reg;, though for historical reasons its
service name retains the "snowth" terminology.

IRONdb&reg; has its own
[documentation](/irondb/) and will be
referenced from this document, but there are differences when it is employed as
part of a full Circonus deployment, so any specifics documented here supersede
the IRONdb manual.

The following are important differences from standalone IRONdb:

 * IRONdb&reg; runs as the service `circonus-snowth` (EL7), listening
   externally on port 8112 and locally on port 32322.  Like other libmtev-based
   applications, this service has two processes: a child and a parent, which
   serves as watchdog for the child.
 * The config file is `snowth.conf`, and is managed by Hooper. Local changes
   will be lost on the next Hooper run, so this file should only be modified at
   the direction of Circonus Support or during troubleshooting. All
   configurable options are in
   [site.json](/circonus/on-premises/installation/installation#data_storage-attributes).

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
snowth's performance. On EL7, install
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

## Operations Dashboard

IRONdb&reg; comes with built-in operational dashboard accessible from any data
storage host on port 8112 in your browser, e.g., http://snowthhost:8112. This
interface provides real-time information about the data storage cluster.  

See the [IRONdb manual](/irondb/administration/operations)
for details on the dashboard.

## Performing Cluster Restarts

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

## Delete Sweep Snowth API

Delete Sweep is a procedure that allows users to quickly remove large amounts
of data from storage using the IRONdb&reg; API. It is useful in implementing a
retention policy, as it can remove all data prior to a given date.

See the [IRONdb API manual](/circonus/on-premises/roles-services/data-storage#delete-sweep-snowth-api)
for details.

## Snowth Troubleshooting

Refer to the [Snowth
Troubleshooting](/circonus/on-premises/troubleshooting/#snowth-troubleshooting) section for
additional Data Storage troubleshooting instructions.

### Reconstituting a Data Storage Node

For instructions, refer to the section "[Reconstituting a Data Storage node](/circonus/on-premises/reconstituting-a-snowth-node)". This procedure is only used in
circumstances where the node's data is completely unrecoverable. Always contact Circonus Support (support@circonus.com) before attempting these procedures.
