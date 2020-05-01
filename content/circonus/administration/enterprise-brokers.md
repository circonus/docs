---
title: Enterprise Brokers
weight: 40
---

# Enterprise Brokers

## Overview

Circonus operates a worldwide system of nodes for configuring checks and gathering metrics. These nodes are known as Circonus Public Brokers and are available for use by any active Circonus accounts. Enterprise Brokers are software appliances that can be downloaded and installed in a customer's datacenter for running checks and gathering metrics privately.

## System Requirements

 * RHEL/CentOS 6.3+, 7.x
 * 2 CPU cores
 * 4 Gbytes of RAM
 * 40 Gbytes of disk storage

## Installation

On all platforms, the necessary services will be started automatically upon package installation.

### RHEL 6 / CentOS 6 Installation

Follow these instructions to install an Enterprise Broker on RHEL 6 or CentOS 6.

**Note:**
>Only 64-bit (x86\_64) is supported for RHEL/CentOS 6

Create a file at `/etc/yum.repos.d/Circonus.repo` with the following contents:
```
# Circonus.repo
#
[circonus]
name=Circonus - Base
baseurl=http://updates.circonus.net/centos/6/x86_64/
enabled=1
gpgcheck=0
metadata_expire=60m

[circonus-crashreporting]
name=Circonus - Crash Reporting
baseurl=http://updates.circonus.net/backtrace/centos/el6/
enabled=1
gpgcheck=0
metadata_expire=60m
```

There is a single package to install via YUM which will pull in others as dependencies. Use the following command:
```
# yum install circonus-field-broker
```

### RHEL 7 / CentOS 7 Installation

Follow these instructions to install an Enterprise Broker on RHEL 7 or CentOS 7.

Create a file at `/etc/yum.repos.d/Circonus.repo` with the following contents:
```
# Circonus.repo
#
[circonus]
name=Circonus - Base
baseurl=http://updates.circonus.net/centos/7/x86_64/
enabled=1
gpgcheck=0
metadata_expire=60m

[circonus-crashreporting]
name=Circonus - Crash Reporting
baseurl=http://updates.circonus.net/backtrace/centos/el7/
enabled=1
gpgcheck=0
metadata_expire=60m
```

There is a single package to install via YUM which will pull in others as dependencies. Use the following command:
```
# yum install circonus-field-broker
```

### External Connectivity

In its default configuration, the broker reaches out to establish connectivity with
Circonus. In this mode, only outbound connections are required, and the rest of
this section does not apply.

If an IP address is specified in the `BROKER_IP` [environment
variable](/circonus/administration/enterprise-brokers/#environment-variables),
the broker receives secure connections from Circonus aggregation servers
(Stratcon) and thus inbound connectivity must be permitted.

In this configuration the Circonus aggregation service (Stratcon) establishes a
secure SSL connection to the broker. If the broker resides behind a firewall, a
rule needs to be added to the firewall allowing Circonus IP addresses to reach
the broker over TCP port 43191. The list of IP addresses from which Circonus
traffic originates may be obtained via DNS lookup of `out.circonus.net`.  This
should be periodically checked and validated against the firewall rules as the
IP addresses are subject to change.

The broker should be allowed to respond to these connections. No other outbound
connectivity initiated by the broker is required, save for traffic associated
with checks that the broker may be configured to run.

### Provision the Broker

Once the broker is installed it must be provisioned. The process is described
below.  After it is provisioned, Circonus checks can be deployed onto the
broker using the Circonus UI or API.

**NOTE: This process has changed as of the 2020-04-20 release.** The previous
process, utilizing the `provtool` command, will still work but is now deprecated
and will eventually be removed. Any automated processes for provisioning
brokers should be updated to the current method described below.

**If provisioning a fresh system to take over an existing slot for a failed
broker, see [Specifying a broker
slot](/circonus/administration/enterprise-brokers/#specifying-a-broker-slot)
below, and use the provtool process to provision the replacement.**

#### Provisioning Process

When the broker service (`noitd`) starts, it sources a shell environment file
at `/opt/noit/prod/etc/noit.local.env`. The complete list of available
environment variables is [listed
below](/circonus/administration/enterprise-brokers/#environment-variables).

1. Obtain an [API token](/circonus/administration/api-tokens/#creating-an-auth-token) that has Admin
   privilege and a Default App State of "Allow".
1. If in a full, on-premises deployment (Circonus Inside), set the API URL.
   **SaaS users (circonus.com) can skip this step.** Create or update
   `noit.local.env` and add the following line:
   * `CIRCONUS_API_URL="https://api.your.inside.install"`
1. Set the API token. Create or update `noit.local.env` and add the following
   line:
   * `CIRCONUS_AUTH_TOKEN="<insert-token-here>"`
1. Optionally specify a cluster name. If the named cluster already exists, this
   broker will join it. If it does not exist, a new cluster will be created
   with this broker as a member. Add the following line to `noit.local.env`
   (spaces are allowed, just be sure to use double quotes around the value):
   * `CLUSTER_NAME="My Cluster Name"`
1. [Start](/circonus/administration/enterprise-brokers/#services) the `noitd`
   service.

#### Environment Variables

Required:
* `CIRCONUS_AUTH_TOKEN` : The API token to use for provisioning.

Optional:
* `BROKER_IP` : The IP address that Circonus should use to contact this broker.
  If not specified, the broker will operate in "reverse" mode, where it
  connects to Circonus. If this IP address is specified, it must be reachable
  from Circonus, as detailed in [External
  Connectivity](/circonus/administration/enterprise-brokers/#external-connectivity)
  above.
* `BROKER_NAME` : An alias for this broker.
* `CIRCONUS_API_URL` : The location of the Circonus API. If not specified, it
  defaults to https://api.circonus.com . (This variable must be set to a
  non-default value for [on-premises](/circonus/on-premises) deployments).
* `CLUSTER_IP` : The IPv4 address that cluster peers should use to communicate
  with this broker. If not specified, the default is to use the source address
  of the interface over which remote addresses are reachable.
* `CLUSTER_NAME` : The name of a cluster to join or create. If the named
  cluster already exists, this broker will join it. If it does not exist, a new
  cluster will be created with this broker as a member.
* `CONTACT_GROUP` : The numeric ID of a
  [contact_group](https://login.circonus.com/resources/api/calls/contact_group)
  to associate with this broker. This contact group will receive notifications
  if the broker becomes disconnected from Circonus.
* `EXTERNAL_HOST` : The IPv4 address to which system agents and any other
  clients should connect to submit metrics. If not specified, the default is to
  use the source address of the interface over which remote addresses are
  reachable.
* `EXTERNAL_PORT` : The TCP port number to which clients should connect. The
  default if not specified is 43191. This should rarely need to be changed.

### Provtool

**NOTE:** Provisioning new brokers uses a more efficient process within the
broker itself. [See the above provisioning
guide](/circonus/administration/enterprise-brokers/#provisioning-process). What
follows is the now-deprecated provtool-based provisioning process.

There are several common options that can be set when provisioning a broker using the Provtool with the command:

```
provtool provision -ip <ip> [-nat]
```
These common options are:
1. `-ip <address>` : Required. In default configuration, this is the public IP that Circonus will reach out to in order to connect to the broker.  If run with `-nat` this should be the local ip of the broker.
1. `-nat` : Optional.  The `-nat` option will trigger the broker to connect to Circonus instead of Circonus connecting to the broker.  If `-nat` is set, the option `-ip <ip>` should be set to the local ip the broker is using.  This is the IP local things would connect to the broker over.

Additional provision flags, and other Provtool options are detailed below:

#### Provtool Options:

 * Local configuration
```
  provtool config get <key>
  provtool config set <key> <value>
	api-token:	the Circonus API token for provisioning
                (token must have Admin privilege)
	api-url:	the Circonus API base url
			    (default: https://api.circonus.com)
	googleanalytics/api-key:	Google Analytics API Key
	googleanalytics/client-id:	Google Analytics Client Id
	googleanalytics/client-secret:	Google Analytics Client Secret
```

 * Listing brokers
```
  provtool list
```

 * Provision this broker
```
  provtool provision [-cn <cn>] [-ip <ip>] [-name <name>]
    -cn <cn>          specify a broker CN, default first unprovisioned
    -ip <IP>          set the broker IP address to which Circonus will connect,
                      or local address if used with -nat
    -nat              tell Circonus that this broker will dial in
    -long <longitude> set the broker's longitude on maps
    -lat <latitude>   set the broker's latitude on maps
    -cluster_id <id>  add an already provisioned broker to an existing group/cluster.
                      cluster_id should not be used during the initial provision call
                      but as a second provision call after initial provisioning.  The
                      cluster_id of a broker group is available in the UI as the
                      "Group ID" of any existing broker.
    -name <name>      an optional name for the broker group
```

 * Rebuilding a broker's configuration
```
  provtool rebuild [-c <cn>]
	-c <cn>	rebuild an arbitrary cn [deault: this machine].
```

#### Specifying a broker slot

When provisioning a new broker, the provtool will automatically find and use
an unprovisioned broker slot.  This is the preferred method.  Broker slots can be
viewed using the command `sudo /opt/napp/bin/provtool list`.  To specifiy a specific
broker slot during provisioning, use the `-cn` option along with the CN of the desired slot.
Use caution.  If a CN is specified that is already in use then the broker will rekey
that slot so that it can be "rebuilt".  This will interfere with the existing broker
using that slot.

#### Rebuilding a failed broker

This is the method for rebuilding a failed broker.

1. [Stop the noitd service](#services)
1. `sudo /opt/napp/bin/provtool config set api-token <AUTH_TOKEN>`
1. `sudo /opt/napp/bin/provtool provision`
1. Start the noitd service

If the IP address cannot be detected, `-ip <publicip>` is required in the
provision step.

If Circonus cannot connect to the broker and the broker should instead connect
to Circonus specify the `-nat` option. The `-name` option is not required, but
can be used to name the broker.

If the broker has already been activated and has a configuration, but the box is a fresh broker intended to be used to recover for a failed broker, then follow these steps:

1. Specify `-cn <broker to rebuild>` on the provision line. The broker to rebuild should be an active broker in the system that is now permanently offline. This new broker will assume all of the old broker's responsibilities.
1. [Stop the noitd service](#services)
1. `sudo /opt/napp/bin/provtool config set api-token <AUTH_TOKEN>`
1. `sudo /opt/napp/bin/provtool provision -cn <broker to rebuild> -ip <publicip> ....`
1. `sudo /opt/napp/bin/provtool rebuild`
1. Start the noitd service

## Updating

Package updates from Circonus are periodically available for Enterprise Brokers.

When an broker receives an "Update Software" message, use one of the following
commands to install the update, depending on the broker's operating system:
 * RHEL/CentOS:
```
yum update circonus-field-broker
```

## Reinstallation

If it becomes necessary to reinstall the broker on a new machine, having the
existing broker available makes the process simple, but Circonus support can
still help restore checks even if a broker system is completely lost. (Contact
support@circonus.com.)

**Warning:**
> **Do NOT decommission the current broker while performing a reinstallation**
> under any circumstances, unless instructed to do so by Circonus support.

**Note:**
> The Broker Status page may show a software out-of-date message when initially
> starting up the reinstalled broker. This can take up to 15 minutes to clear.

### Current Broker Available

Follow these instructions for reinstallation when the current broker is available:

 1. Install the new broker using the installation instructions above.
 1. [Stop the noitd service](#services) on the new broker.
 1. Copy the contents of `/opt/napp/etc/ssl` to the new machine, if this
    directory exists (SSL files are kept under `/opt/noit/prod/etc/ssl` as of
    the 2020-04-20 release.)
 1. Copy the contents of `/opt/noit/prod/etc/` to the new machine.
 1. Start the noitd service on the new broker. At this point, the new broker is
    ready to start collecting data. The next steps will disconnect the existing
    broker from Circonus and connect the new one.
 1. Navigate to the broker's status page in the Circonus UI (`https://YOURACCOUNT.circonus.com/brokers`, then click "View" on the broker being migrated.)
 1. Click on the pencil icon next to the "IP Address" field, and update it to
    the address of the new machine. Note that both the old and new brokers should
    be running at this point. When entering the new IP, Circonus will reach out to
    the new broker to make sure it can talk to it. If it can not, there will be an
    error message stating that the system could not update the broker at this time.
    The old broker will continue to function.
 1. The `noitd` service on the old broker may now be stopped.

The broker should now show as connected on the Broker Status page.  For any problems, please contact Circonus Support (support@circonus.com).

### Current Broker Not Available

If the current broker is no longer available, use the Provtool (`/opt/napp/bin/provtool`) and follow the instructions for "[Rebuilding a failed broker](/circonus/administration/enterprise-brokers/#rebuilding-a-failed-broker)" above.

## Services

The broker package provides a service, "noitd", which is enabled automatically during package installation.

### noitd

The noitd service runs as a supervisor process with one or more child processes that actually perform checks. If a child process crashes, the supervisor will start another one, but if too many crashes happen in too short a time, the supervisor will stop itself rather than continue an endless cycle of restarts.

To start, stop, or restart:

 * RHEL/CentOS 6: `/sbin/service noitd {start|stop|restart}`
 * RHEL/CentOS 7: `/usr/bin/systemctl {start|stop|restart} noitd`

To check status:

 * RHEL/CentOS 6: `/sbin/service noitd status`
 * RHEL/CentOS 7: `/usr/bin/systemctl status noitd`

## Important Files and Directories

* `/opt/noit/prod/etc` : This location is for configuration files. In general,
  there should be no need to manually edit any of these files, with a couple of
  exceptions, noted below. Changes to editable files will be preserved during
  broker package updates.
  * `circonus-modules-enterprise.conf` may be edited to
    configure/enable/disable enterprise-related check modules such as collectd,
    statsd, and cloudwatch.
  * `circonus-modules-site.conf` may be updated to activate additional noitd
    modules that are not active by default.
  * `/opt/noit/prod/etc/ssl` is the location of SSL key and certificates,
    including the broker's client certificate. It is used for communicating with
    the Circonus infrastructure and as a CA certificate for authenticating
    connections from Circonus. **All `appliance.*` files in this directory
    should be backed up.**

* `/opt/noit/prod/etc/{checks,filtersets}` : These directories contain the
  individual check configurations assigned to this broker.  They are created,
  updated, and removed automatically by noitd and should not be changed
  manually.

* `/opt/noit/prod/log` : This location contains [log files](#logs).

* `/opt/noit/prod/log/noitd.feed` : [Journaled log](#metric-feed-log) of
  collected metric data. **Although this is under the "log" directory, these
  files are not disposable. They contain metric data collected by the broker
  for delivery to Circonus (see below). Removal of these files will cause
  permanent data loss.**

## Logs

Logs are written under `/opt/noit/prod/log`.  There are two types of log files: `access.log` and `noitd.log`.

Access logs record operations on the broker's check configurations, as well as push operations such as HTTPTrap. The noitd log records activity about the noitd process itself, including startup messages and information about child processes that crash. These files are rotated automatically when they reach approximately 10MB in size and a total of about 5 historical files for each log will be retained.

### Metric Feed Log

Also in the same directory is `noitd.feed`. This subdirectory contains the journal of collected metric data that will be sent to Circonus. It is implemented with [JLog](https://github.com/omniti-labs/jlog), which allows multiple "subscribers" (Circonus metric aggregators) to read metric data, maintaining an individual checkpoint for each subscriber. If connectivity to the broker from Circonus is lost, metric data will accumulate in the feed directory until connectivity is restored.

**If the contents of this directory are lost before they are consumed by Circonus, data for affected metrics will be permanently lost.** Care should be taken to ensure sufficient disk space for this directory to grow in the event of a loss of connectivity. Disk space requirements grow as the number of checks and metrics configured on the broker increases.

## Troubleshooting

### Check noitd Status

Access the broker machine and use following the commands:
```
telnet localhost 32322
```
followed by
```
show checks
```
This will display all the checks configured on the broker. To inspect an individual check, use the command
```
show check <uuid>
```
This will display information such as when the check last ran and when it is due to run again. This will help determine if things are running properly.

### Activating Automated Crash Reporting

To help Circonus improve the quality of the broker software, an automated reporting process can be activited to send details of crashes to Circonus for analysis.  This requires that the broker machine be able to connect out to https://circonus.sp.backtrace.io:6098 to send reports.

To activate automated crash reporting on RHEL/CentOS 6/7:
```
yum install circonus-field-broker-crashreporter
```

A new service called "circonus-coroner" will be installed, which will watch for noitd crash events and report them.  Each time a crash is noted, a summary of the trace will be written to a file in /opt/noit/prod/traces with a ".trc" extension. The .trc files are a local record of trace events for informational purposes.

There will also be, briefly, a report file with a .btt extension, which is what coroner will upload to Circonus, and then remove. If there are .btt files lingering in the traces directory, check that the coroner service is running, and that the necessary network connectivity is available.

### Resetting the Agent to Factory Defaults

Once a broker is provisioned and in use, the way to "start over" with a fresh
broker is to decommission the current broker via the Circonus UI and create a
new one.

**Warning:**
>Decommissioning a broker deletes all checks associated with the broker, along
>with all other traces of it in the Circonus system.  To simply relocate a
>broker to another machine, please see the
>[Reinstallation](/circonus/administration/enterprise-brokers/#reinstallation)
>section above.

To decommission a broker, open the main menu and navigate to "Integrations ->
Brokers", then click "View" to go to the detail page for the broker in
question. From the Menu at top right, choose "Decommission Broker".

To reuse the same machine that is currently in use, remove all Circonus
packages and delete the `/opt/napp` and `/opt/noit` directories after
decommissioning it.

### Sending Files to Circonus Support

When contacting Circonus Support (support@circonus.com) for assistance with
broker troubleshooting, logs or other files occaisionally need to be uploaded
for review by Support.  The instructions for this procedure can be found in the
[Tech Support](/circonus/appendix/tech-support/#sending-files-to-circonus-support)
Appendix.
