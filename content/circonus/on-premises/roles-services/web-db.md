---
title: Web DB
weight: 130
---

# Web DB {#WebDB}

The web database is a Postgres DB running on port 5432.  If you have multiple nodes with this role, then the first node in the list is the master and the others are streaming slaves.

DB troubleshooting can be performed by an experienced Database Administrator (DBA). For help in this matter, please contact Circonus Support (support@circonus.com) to reach a DBA.

At times, it is necessary to log into the database to run requested queries.  To log in from the local machine, issue the following command:
```
/opt/pgsql/bin/psql -U circduown -d circonus
```

This will log you in as a non super user, but with the capability of running the appropriate queries.

The Postgres data directory is located at `/wdb/pgdata/9.2`

In this directory there is also a `pg_log` directly, which will contain log files useful for general debugging of database connectivity issues. It also contains some queries.

Note that any config files located in the data directory are managed by Circonus. Any changes will not persist if `run-hooper` is used.  If you find yourself needing specialized configs, please contact Circonus Support (support@circonus.com).

## Web DB Failover {#WebDBFailover}

In the event of a database failure, it will be necessary to manually failover to one of your slaves, which will become the new master.  To do this, use the following steps.

 1. If the current master is still running, shut it down.
 1. On the new master, make a copy of the file `/wdb/pgdata/9.2/recovery.conf`.
 1. Relocate the floating IP/DNS name to the new master.
 1. On the new master, touch the file `/wdb/pgdata/9.2/failover.now`.
  1. When the new master completes its failover, the file `/wdb/pgdata/9.2/recovery.conf` will be renamed to "`recovery.done`".
  1. After the renaming occurs, you can delete the `failover.now` file.
 1. Rebuild the other slaves. Follow these steps on each machine: 
  1. Stop the postgres service.
  1. Run the command: `rm -rf /wdb/pgdata/9.2`
  1. Run the command: `mkdir /wdb/pgdata/9.2`
  1. Run the command: `chown postgres:postgres /wdb/pgdata/9.2`
  1. Run the command: `chmod 700 /wdb/pgdata/9.2`
  1. Run the command: `sudo -u postgres /opt/pgsql/bin/pg_basebackup -D /wdb/pgdata/9.2/ -h <new master IP> -U replication`
  1. Edit the `recovery.conf` file from Step 2, changing the host in the primary_conninfo parameter to point to the new master.
  1. Place the `recovery.conf` into the path `/wdb/pgdata/9.2/recovery.conf`, overwriting the current file in that path.
  1. Start the postgres service.
 1. When the old master comes back online, make it into a slave by running the rebuild commands from Step 5 on that machine.

You should now have a new master DB and services should reconnect to it when needed.  At this point, refer to the [Service Dependencies](/circonus/on-premises/service-dependencies) section for a list of services that we recommend restarting.

## Web DB Restart {#WebDBRestart}

If certain configuration parameters are modified, Hooper will notify the operator that a database restart is required. Due to the potential disruption to related services, database restarts are not done automatically. If you need to restart the Web DB, execute one of the following commands, depending on the OS:
 * OmniOS: `svcadm restart svc:/database/postgres:circonus_wdb`
 * RHEL/CentOS: `service circonus-postgres-circonus_wdb restart`

Then restart each of the services that we recommend restarting after a Web DB restart.  See [Service Dependencies](/circonus/on-premises/service-dependencies).
