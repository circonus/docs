---
title: System Updates
weight: 90
---

# System Updates

From time to time, it will be necessary to run Hooper on your Circonus Inside nodes to get updates.  Please refer to the following guidelines to ensure a successful operation.

## Run On All Nodes

Unless specifically guided by Circonus Support, Hooper updates should be run across all of your Circonus Inside nodes.  This will ensure that related components that may be on separate nodes are upgraded close together.

**(OmniOS only)** If desired, update the value of the "circonus_version" attribute in site.json on all nodes to allow moving to a version you have tested in a separate environment. Please refer to the [General Installation](/circonus/on-premises/installation/installation) section of the Circonus Inside Installation Manual for details on using this attribute.

**(EL7 only)** If desired, update the `baseurl` value in
`/etc/yum.repos.d/Circonus.repo` to the newer release version. See the
[Installing on CentOS](/circonus/on-premises/installation/installation)
page of the Circonus Inside Installation Manual for details on the URL format.

Care should also be taken to run Hooper in the same order as during the initial setup.  Please refer to the [Installation Sequence](/circonus/on-premises/installation/installation#InstallationSequence) section of the Circonus Inside Installation Manual for the order in which to run updates.

### Role-Specific Notes {#Role-SpecificNotes}

 * **data_storage:** After completing a Hooper run on a node in the data_storage role, if the `platform/snowth` package was updated, the operator should restart the `svc:/network/snowth:default` service. Restarting the service is intentionally not automated for reasons of cluster availability. See [Performing Cluster Restarts](/circonus/on-premises/roles-services/data-storage#PerformingClusterRestarts) for details.
 * **data_storage:** You must run Hooper serially on snowth clusters, to allow them to warm up between runs.
 * **caql_broker:** When configured as a cluster, updates have to be performed serially, to avoid service downtime. See [caql_broker](/circonus/on-premises/roles-services/caql-broker/#Updates) for details.

## Note Warnings {#NoteWarnings}
After a successful run, Hooper will normally print any log messages of severity "WARN" or higher.  Warnings indicate non-fatal conditions that should be addressed, such as deprecated configuration options.

## Hooper Maintenance Mode {#HooperMaintenanceMode}
The run-hooper command supports an optional flag (-m) that suppresses all package updates, including Hooper itself, while still performing all other functions such as config file updates and service activation.  Using this option allows the operator to ensure that all services and other aspects of Circonus configuration are kept in good order without introducing code changes.  If desired, Hooper may be run in this mode periodically, in between regular updates to pull in upstream changes.
