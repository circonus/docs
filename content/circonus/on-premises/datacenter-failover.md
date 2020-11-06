---
title: Datacenter Failover
weight: 100
---

# Datacenter Failover

Failing over to a backup datacenter is a manual process, but should result in
minimal downtime for your users. Perform the following procedures:

1. Ensure that you have restored the latest [backup of the primary
   CA](/circonus/on-premises/roles-services/ca/) on the backup datacenter's CA
   host.
1. In the backup datacenter's `site.json`, change the following values and
   distribute the updated file to all backup datacenter hosts.
   * [active_datacenter](/circonus/on-premises/installation/installation/#top-level-attributes)
     changes from `false` to `true`.
   * ca [primary](/circonus/on-premises/installation/installation/#ca-attributes)
     changes to the hostname that is in the `ca` role in the backup datacenter.
   * data_storage [secondary_cluster](/circonus/on-premises/installation/installation/#data-storage-attributes)
     changes to the list of hosts in the original datacenter.
   * web_db [master](/circonus/on-premises/installation/installation/#web-db-attributes)
     changes to the hostname of the primary in the backup datacenter (the one
     that was already set as `connect_host`.)
1. Fail over your original primary database to the replica that is specified as
   the `connect_host` in the backup datacenter.  To do this, follow the first
   part of the database failover procedure outlined in the [Web DB
   Failover](/circonus/on-premises/roles-services/web-db#web-db-failover)
   section. Return here when directed.
1. On the new primary [web-db](/circonus/on-premises/roles-services/web-db)
   host, update the active message queue by running the following command:
   ```
   /www/bin/inside/failover.pl
   ```
1. On each backup datacenter host, perform a Hooper maintenance run
   (`/opt/circonus/bin/run-hooper -m`) in the standard [run
   order](/circonus/on-premises/installation/installation/#installation-sequence).
1. Point any necessary DNS and/or load-balancer resources to the backup
   datacenter.  Users will need to reload the web UI to connect to the new location.

Perform the following procedure on the original datacenter to make it a backup:

1. Change the following values in `site.json` for the original datacenter, and
   distribute the updated file to all original datacenter hosts.
   * [active_datacenter](/circonus/on-premises/installation/installation/#top-level-attributes)
     changes from `true` to `false`.
   * ca [primary](/circonus/on-premises/installation/installation/#ca-attributes)
     changes to the hostname that is in the `ca` role in the now-active
     datacenter.
   * data_storage [secondary_cluster](/circonus/on-premises/installation/installation/#data-storage-attributes)
     changes to the list of hosts in the now-active datacenter.
   * web_db [master](/circonus/on-premises/installation/installation/#web-db-attributes)
     changes to the hostname of the primary in the now-active datacenter.
1. Ensure the original primary DB has been converted to a replica by following
   the instructions in the [Web DB Failover](/circonus/on-premises/roles-services/web-db#web-db-failover)
   section.
1. On each original datacenter host, perform a Hooper maintenance run
   (`/opt/circonus/bin/run-hooper -m`) in the standard [run
   order](/circonus/on-premises/installation/installation/#installation-sequence).

Any users connecting to the backup datacenter may be able to see the UI, but will not be able to make changes. It is advisable to always connect to the primary datacenter.
