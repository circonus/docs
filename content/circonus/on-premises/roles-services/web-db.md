---
title: Web DB
weight: 130
---

# Web DB

The web database is a Postgres DB running on port 5432.  If you have multiple
nodes with this role, then the first node in the list is the primary and the
others are streaming replicas.

DB troubleshooting can be performed by an experienced Database Administrator
(DBA). For help in this matter, please contact Circonus Support
(support@circonus.com).

At times, it is necessary to log into the database to run requested queries.  To log in from the local machine, issue the following command:
```
/opt/pgsql/bin/psql -U circduown -d circonus
```

This will log you in as a non super user, but with the capability of running the appropriate queries.

The Postgres data directory is located at `/wdb/pgdata/9.2`

In this directory there is also a `pg_log` directly, which will contain log files useful for general debugging of database connectivity issues. It also contains some queries.

Note that any config files located in the data directory are managed by
Circonus. Any manual changes will not persist if `run-hooper` is used. Some
common tuning parameters can be changed via
[site.json](/circonus/on-premises/installation/installation/#web-db-attributes).
If you need additional customizations beyond what Hooper provides, please
contact Circonus Support (support@circonus.com).

## Web DB Failover

In the event of a database failure, it will be necessary to manually failover
to one of your replicas, which will become the new primary.  To do this, use the following steps.

 1. If the **current primary** is still running, stop the
    `circonus-postgres-circonus_wdb` service.
 1. On the **new primary**, make a copy of the file `/wdb/pgdata/9.2/recovery.conf`
    to a location outside of the `/wdb/pgdata` hierarchy, such as your home
    directory.
 1. If using an IP alias as the `connect_host`, relocate the IP/DNS name to the
    new primary. Otherwise, update `site.json`, setting a new hostname for
    `master` and `connect_host` in the `web_db` object.
 1. On the **new primary**, touch the file `/wdb/pgdata/9.2/failover.now`.
    * When the new primary completes its failover, the file `/wdb/pgdata/9.2/recovery.conf` will be renamed to "`recovery.done`".
    * After the renaming occurs, you can delete the `failover.now` file, if it
      is still present.
    * **If performing this failover as part of a multi-datacenter failover
      operation, stop here and return to the [datacenter
      failover](/circonus/on-premises/datacenter-failover/) steps.**
 1. Run Hooper on the **new primary** to ensure any configuration
    customizations are applied: `/opt/circonus/bin/run-hooper -m`, restarting
    the database if directed. Hooper will show the names and locations of
    services that must be manually restarted after a primary database restart.
    Complete those restarts before continuing.
 1. Distribute the updated `site.json` to all other hosts in your deployment,
    and perform a Hooper run (`/opt/circonus/bin/run-hooper -m`) across all
    hosts, following the order specified in the
    [initial installation](/circonus/on-premises/installation/installation/#installation-sequence)
    page.
 1. At this point, your deployment should be failed over to the new primary.
 1. Rebuild any other replicas off of the new primary. Follow these steps on
    each machine:
    1. Stop the `circonus-postgres-circonus_wdb` service.
    1. Run the command: `rm -rf /wdb/pgdata/9.2`
    1. Run the command: `mkdir /wdb/pgdata/9.2`
    1. Run the command: `chown postgres:postgres /wdb/pgdata/9.2`
    1. Run the command: `chmod 700 /wdb/pgdata/9.2`
    1. Run the command: `sudo -u postgres /opt/pgsql/bin/pg_basebackup -D /wdb/pgdata/9.2/ -h <new primary host/IP> -U replication`
    1. Edit the `recovery.conf` file from Step 2, changing the host in the
       `primary_conninfo` parameter to point to the new primary.
    1. Place the `recovery.conf` into the path `/wdb/pgdata/9.2/recovery.conf`,
       overwriting the current file in that path.
    1. Start the `circonus-postgres-circonus_wdb` service.
 1. If/when the problems with the **old primary** are addressed, make it into a
    replica by running the rebuild commands from the previous step on that
    machine.

## Web DB Restart

If certain configuration parameters are modified, Hooper will notify the operator that a database restart is required. Due to the potential disruption to related services, database restarts are not done automatically. If you need to restart the Web DB, execute one of the following commands, depending on the OS:
 * RHEL/CentOS: `systemctl restart circonus-postgres-circonus_wdb`

Then restart each of the services that we recommend restarting after a Web DB restart.  See [Service Dependencies](/circonus/on-premises/service-dependencies).

## ZFS Support

This role has the option of using [ZFS
filesystems](/circonus/on-premises/installation/installation/#install-zfs). If
configured, all PostgreSQL database files will be stored on ZFS, with
transparent compression that provides a significant reduction in storage
requirements.
