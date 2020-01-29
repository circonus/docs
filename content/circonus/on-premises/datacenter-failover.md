---
title: Datacenter Failover
weight: 100
---

# Datacenter Failover {#DatacenterFailover}
Failing over to a backup datacenter is a manual process, but should result in minimal downtime for your users. Perform the following procedures:

 1. Failover your master database to a slave that exists in the new datacenter.  To do this, follow the database failover procedure outlined in the [Web DB Failover](/Roles/web_db#WebDBFailover) section.
 1. On the new primary [web_db](/Roles/web_db) node, we will update the active message queue by running the following command:
```
/www/bin/inside/failover.pl
```
 1. Start/restart the following services:
  1. [Fault Detection](/Roles/fault_detection)
  1. [Notification](/Roles/notification)
 1. If you use a shared IP/domain, point it to the new datacenter.  Users will need to reload the web UI to connect to the new datacenter.

Perform the following procedure on the new backup datacenter:

 1. Ensure the old master DB has been converted to a slave by following the instructions in the [Web DB Failover](/Roles/web_db#WebDBFailover) section.
 1. Stop the following services:
   1. [Fault Detection](/Roles/fault_detection)
   1. [Notification](/Roles/notification)

Any users connecting to the backup datacenter may be able to see the UI, but will not be able to make changes. It is advisable to always connect to the primary datacenter.


## CA Failover {#CAFailover}
>> **Note:** Currently, the install does not fully support a failover CA, therefore items in the `/opt/circonus/CA` directory on that node should be backed up. The most important items to backup before failover are the cert and key. Circonus Support can manually bring this up in the event of an emergency, but it is not required to be up for a running system to function, unless cert renewals are needed.

 1. The ca service should be duplicated from the primary DC site.json. Keep the machlist with the primary DC machine.
 1. In the web_db setup, the master and connect_host should be the primary DC master database machine. The Circonus nodes in the backup DC will need to have access to the primary DB.
 1. Add the primary DC master DB to the machinfo section so the backup DC can locate it.
 1. Run hooper in the backup environment until all nodes come up successfully.
 1. Once all the nodes run cleanly, edit the site.json again and set the web_db connect_host to the appropriate machine in the backup DB.
 1. Run hooper again until all nodes are successful. This will reset all the connections to the right database.  

Once this is done, the backup DC without the CA should be in place. Follow the further install instructions as normal.
