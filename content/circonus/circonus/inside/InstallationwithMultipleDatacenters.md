## Installation with Multiple Datacenters {#InstallationwithMultipleDatacenters}

### General Concept {#GeneralConcept}
Circonus operates in what can be described as an active-passive setup, where the backup datacenter is a warm standby should the primary DC be unreachable.

In this setup, all services, except for brokers, are replicated between the two datacenters.  Circonus aggregation (stratcon) services actively connect to all brokers in the infrastructure and collect the same data in all datacenters.

When a datacenter fails, database services need to be cut over to the chosen backup, and alerting services turned on, all other services can remain running. See the [Datacenter Failover](/OperationManual/Failover.md) section in the operations manual for more information on this process.


### Configuring a backup datacenter {#Configuringabackupdatacenter}
Configuring a backup is nearly identical to setting up the primary datacenter. The site.json for each datacenter will contain a listing of all the nodes in both datacenters (see "`machinfo`"), and the "`_machlist`" attribute for all the services should contain all the nodes which will run them, again in both datacenters.  There are two exceptions to this:
 1. The CA service must only have the machine from the primary datacenter from which it operates.
 1. The data_storage service must only have the nodes for the particular datacenter for this file.

In addition to those two exceptions, take note of a few other items:
 * For the stratcon role, the groups attribute should describe the node grouping in each datacenter.  For example, if you had a single node for the role in each location, the groups would look like this:
```
"groups": [
  ["DC1server"],
  ["DC2server"]
]
```

 * All nodes in the infrastructure across datacenters need to have network access to the primary DB. For the other DBs, this is to receive replicated data; for other roles, various jobs need to run to look up information and record when they are complete.

 * All stratcon nodes will need access to port 43191 on all fault_detection nodes from all datacenters. The fault_detection role also functions as the composite broker, and all stratcons need to be able to connect to composite brokers just as they do normal brokers.

Other than the items above, you can install the services in all other datacenters in the same manner as the primary datacenter (refer to the installation instructions in this manual). Once this is complete on all nodes, you should have a functioning backup that is replicating from the primary and pulling metric information.

**NOTE:**
> If the backup datacenter is built some time after the primary has been operational, metric data in the backup will start from when the backup was brought online.  If you require older metric data to be present, please contact Circonus Support (support@circonus.com) for assistance.


### Disabling services in the backup datacenter {#Disablingservicesinthebackupdatacenter}
The following services should be disabled in the backup datacenter:
 * notification

There are several manual tasks that must be performed post failover. Refer to the [Datacenter Failover](/OperationManual/Failover.md) section in the the operations manual for this information.


### Checking Datacenter Status {#CheckingDatacenterStatus}
To check if a datacenter is active or in standby mode, visit `https://web_frontend_host/status`. This page will output either "ACTIVE" or "STANDBY".
