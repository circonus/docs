---
title: Upgrading
weight: 40
---

# Upgrading

From time to time, it will be necessary to run Hooper on your Circonus Inside nodes to upgrade.  Please refer to the following guidelines to ensure a successful operation.

Upgrading a Circonus Inside deployment uses the same procedure as initial
installation, which is the `run-hooper` script.
```
/opt/circonus/bin/run-hooper
```

Updates must always be done in the same sequence as [initial
installation](/circonus/on-premises/installation/installation#installation-sequence), and on all nodes.
Upgrading some nodes and not others is not supported.

## Run On All Nodes

Unless specifically guided by Circonus Support, Hooper updates should be run across all of your Circonus Inside nodes.  This will ensure that related components that may be on separate nodes are upgraded close together.

**(EL7 only)** If desired, update the `baseurl` value in
`/etc/yum.repos.d/Circonus.repo` to the newer release version. See the
[Installing on CentOS](/circonus/on-premises/installation/installation)
page of the Circonus Inside Installation Manual for details on the URL format.

Care should also be taken to run Hooper in the same order as during the initial setup.  Please refer to the [Installation Sequence](/circonus/on-premises/installation/installation#installation-sequence) section of the Circonus Inside Installation Manual for the order in which to run updates.

### Role-Specific Notes

 * **data_storage:** After completing a Hooper run on a node in the data_storage role, if the `platform/snowth` package was updated, the operator should restart the `svc:/network/snowth:default` service. Restarting the service is intentionally not automated for reasons of cluster availability. See [Performing Cluster Restarts](/circonus/on-premises/roles-services/data-storage#performing-cluster-restarts) for details.
 * **data_storage:** You must run Hooper serially on snowth clusters, to allow them to warm up between runs.
 * **caql_broker:** When configured as a cluster, updates have to be performed serially, to avoid service downtime. See [caql_broker](/circonus/on-premises/roles-services/caql-broker/#Updates) for details.

## Note Warnings
After a successful run, Hooper will normally print any log messages of severity "WARN" or higher.  Warnings indicate non-fatal conditions that should be addressed, such as deprecated configuration options.

## Hooper Maintenance Mode
The run-hooper command supports an optional flag (-m) that suppresses all package updates, including Hooper itself, while still performing all other functions such as config file updates and service activation.  Using this option allows the operator to ensure that all services and other aspects of Circonus configuration are kept in good order without introducing code changes.  If desired, Hooper may be run in this mode periodically, in between regular updates to pull in upstream changes.

## Reconfiguration

Occasionally, changes to the product will require a reconfiguration of each
node in a Circonus Inside deployment. These are infrequent, but important
updates, encountered when there are changes to role run order or the removal of
obsolete roles.

The `run-hooper` script will check for new reconfiguration notices and notify
the operator if a re-run of `self-configure` is required on a node.
Reconfiguration is required if the node config file is older than one or more
notice dates.

### Reconfiguration Notices

 * 2021-01-11 Replace nad with circonus-agent
 * 2017-10-26 Remove deprecated redis, search roles
 * 2016-10-25 Remove deprecated logstream\* roles
 * 2015-05-11 Re-order run list to put release-mgmt first
 * 2013-10-08 Added release-mgmt role
