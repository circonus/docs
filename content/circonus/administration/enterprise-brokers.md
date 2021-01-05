---
title: Enterprise Brokers
weight: 40
---

# Enterprise Brokers

## Overview

Circonus operates a worldwide system of nodes for configuring checks and gathering metrics. These nodes are known as Circonus Public Brokers and are available for use by any active Circonus accounts. Enterprise Brokers are software appliances that can be downloaded and installed in a customer's datacenter for running checks and gathering metrics privately.

## System Requirements

 * RHEL/CentOS 7.x, Ubuntu 20.04
 * 2 CPU cores
 * 4 Gbytes of RAM
 * 40 Gbytes of disk storage

## Installation

On all platforms, the necessary services will be started automatically upon package installation.

### RHEL/CentOS 7 Installation

Follow these instructions to install an Enterprise Broker on RHEL 7 or CentOS 7.

1. Create a file at `/etc/yum.repos.d/Circonus.repo` with the following contents:
   ```
   # Circonus.repo
   #
   [circonus]
   name=Circonus - Base
   baseurl=http://updates.circonus.net/centos/7/x86_64/
   enabled=1
   gpgcheck=1
   metadata_expire=60m

   [circonus-crashreporting]
   name=Circonus - Crash Reporting
   baseurl=http://updates.circonus.net/backtrace/centos/el7/
   enabled=1
   gpgcheck=0
   metadata_expire=60m
   ```
1. Install the Circonus package-signing key:
   ```
   rpm --import https://keybase.io/circonuspkg/pgp_keys.asc?fingerprint=14ff6826503494d85e62d2f22dd15eba6d4fa648
   ```
1. Install the broker package:
   ```
   yum install circonus-field-broker
   ```

### Ubuntu 20.04 Installation

Follow these instructions to install an Enterprise Broker on Ubuntu 20.04 LTS:

1. Create a file at `/etc/apt/sources.list.d/circonus.list` with the following
contents:
   ```
   deb http://updates.circonus.net/ubuntu/ focal main
   deb http://updates.circonus.net/backtrace/ubuntu/ focal main
   ```
1. Install the Circonus package-signing keys:
   ```
   curl -s \
     https://keybase.io/circonuspkg/pgp_keys.asc?fingerprint=14ff6826503494d85e62d2f22dd15eba6d4fa648 | \
     sudo apt-key add -

   curl -s \
     https://updates.circonus.net/backtrace/ubuntu/backtrace_package_signing.key | \
     sudo apt-key add -
   ```
1. Install the broker package:
   ```
   sudo apt update ; sudo apt install circonus-field-broker
   ```

## External Connectivity

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
the broker over TCP port 43191.

For the Circonus public service (circonus.com), the list of IP addresses from
which Circonus traffic originates may be obtained via DNS lookup of
`out.circonus.net`.  This should be periodically checked and validated against
the firewall rules as the IP addresses are subject to change.

For on-premises Circonus Inside deployments, the traffic may originate from any
host assigned to the `stratcon` service role, and the inbound address that the
broker sees connections from may differ depending on the local routing/NAT
policy at your site.

The broker should be allowed to respond to these connections. No other outbound
connectivity initiated by the broker is required, save for traffic associated
with checks that the broker may be configured to run.

## Provision the Broker

Once the broker is installed it must be provisioned. The process is described
below.  After it is provisioned, Circonus checks can be deployed onto the
broker using the Circonus UI or API.

**If provisioning a fresh system to take over an existing slot for a failed
broker, see [Specifying a broker
slot](/circonus/administration/enterprise-brokers/#specifying-a-broker-slot)
below, and use the provtool process to provision the replacement.**

### Provisioning Process

When the broker service (`noitd`) starts, it sources a shell environment file
at `/opt/noit/prod/etc/noit.local.env`. The complete list of available
environment variables is [listed
below](/circonus/administration/enterprise-brokers/#environment-variables).

1. Obtain an [API token](/circonus/administration/api-tokens/#creating-an-auth-token)
   that has Admin privilege and a Default App State of "Allow".
1. Configure required settings in `noit.local.env`:
   * Set the API token. Uncomment the following line, setting the value to the
     API token obtained in the first step:
     * `CIRCONUS_AUTH_TOKEN="<insert-token-here>"`
   * If in a full, on-premises deployment (Circonus Inside), set the API URL.
     **SaaS users (circonus.com) can skip this step.** Edit `noit.local.env` and
     uncomment the following line, setting the value to your deployment's API
     URL:
     * `CIRCONUS_API_URL="https://api.your.site.domain"`
1. Configure optional settings in `noit.local.env`.  A list of optional parameters is in [Environment Variables](/circonus/administration/enterprise-brokers/#environment-variables) below.  Commonly used parameters are:
   * `BROKER_NAME` - A user-friendly alias
   * `CLUSTER_NAME` - Name of the cluster the broker should join/create
1. [Start](/circonus/administration/enterprise-brokers/#services) the `noitd`
   service.

### Environment Variables

Environment variables define operational and vanity characteristics about the broker.  Unless otherwise noted, these values may be changed and will take effect upon the next service restart.  If used as part of a cluster however, you will need to keep these configurations, and the UI, in sync, or they will overwrite each other with their local settings after restarts.

Required:
* `CIRCONUS_AUTH_TOKEN` : The API token to use for provisioning.

Optional:
* `BROKER_IP` : The IP address that Circonus should use to contact this broker.
  If not specified, the broker will operate in "reverse" mode, where it
  connects to Circonus. If this IP address is specified, it must be reachable
  from Circonus, as detailed in [External
  Connectivity](/circonus/administration/enterprise-brokers/#external-connectivity)
  above.
* `BROKER_NAME` : A user-friendly alias for this broker that will be displayed in the Circonus UI.  Spaces are allowed but must be quoted,  e.g., `BROKER_NAME="Friendly Neighborhood Broker"`.
* `CIRCONUS_API_URL` : The location of the Circonus API. If not specified, it
  defaults to https://api.circonus.com . (This variable must be set to a
  non-default value for [on-premises](/circonus/on-premises) deployments).
* `CLUSTER_IP` : The IPv4 address that cluster peers should use to communicate
  with this broker. If not specified, the default is to use the source address
  of the interface over which remote addresses are reachable.
* `CLUSTER_NAME` : The name of a cluster to join or create. If the named
  cluster already exists, this broker will join it. If it does not exist, a new
  cluster will be created with this broker as a member.  **Note:** Once a broker is part of a cluster of more than 1 node, `CLUSTER_NAME` may no longer be changed, it can only be decommissioned to remove it from the cluster.  Spaces are allowed but must be quoted.  e.g., `CLUSTER_NAME="My Cluster Name"`.
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

## Updating

Package updates from Circonus are periodically available for Enterprise Brokers.

When an broker receives an "Update Software" message, use one of the following
commands to install the update, depending on the broker's operating system:
* RHEL/CentOS:
  ```
  yum update circonus-field-broker
  ```
* Ubuntu:
  ```
  sudo apt update && sudo apt install circonus-field-broker
  ```

## Reinstallation

If it becomes necessary to reinstall the broker on a new machine, having the
existing broker available makes the process simple, but it is also possible to
restore the functionality of a broker if the host system is completely lost.
(Contact support@circonus.com if you have any questions about the procedures
below.)

**Warning:**
> **DO NOT decommission the current broker while performing a reinstallation**
> under any circumstances, unless instructed to do so by Circonus support.
> Decommissioning a broker deletes all checks associated with the broker, along
> with all other traces of it in the Circonus system.

**Note:**
> The Broker Status page may show a software out-of-date message when initially
> starting up the reinstalled broker. This can take up to 15 minutes to clear.

### Current Broker Available

Follow these instructions for reinstallation when the current broker is available:

 1. Install the new broker using the installation instructions above.
 1. [Stop the noitd service](#services) on the new broker.
 1. If the `/opt/napp/etc/ssl` directory exists, copy its contents to
    `/opt/noit/prod/etc/ssl` on the new machine. SSL files are kept under
    `/opt/noit/prod/etc/ssl` as of the 2020-04-20 release.)
 1. Copy the contents of `/opt/noit/prod/etc/` to the new machine.
 1. Start the noitd service on the new broker. At this point, the new broker is
    ready to start collecting data. The next steps will disconnect the existing
    broker from Circonus and connect the new one.
 1. Navigate to the broker's status page in the Circonus UI
    (`https://YOURACCOUNT.circonus.com/brokers`, then click "View" on the
    broker being migrated.)
 1. Click on the pencil icon next to the "IP Address" field, and update it to
    the address of the new machine. Note that both the old and new brokers should
    be running at this point. When entering the new IP, Circonus will reach out to
    the new broker to make sure it can talk to it. If it can not, there will be an
    error message stating that the system could not update the broker at this time.
    The old broker will continue to function.
 1. The `noitd` service on the old broker may now be stopped.

The broker should now show as connected on the Broker Status page.  For any
problems, please contact Circonus Support (support@circonus.com).

### Current Broker Not Available

This process is used when a broker host is lost and unrecoverable. It
configures a freshly-installed, unconfigured host to take over for an existing,
active broker slot.

1. On the new host, install the broker package as described in the
   [Installation](#installation) section above. The file
   `/opt/noit/prod/etc/noit.local.env` must be configured as described below.
   See the list of [Environment Variables](#environment-variables) for a
   description of each variable.
1. Obtain an [API token](/circonus/administration/api-tokens/#creating-an-auth-token)
   that has Admin privilege and a Default App State of "Allow".
1. Configure required and optional settings in `noit.local.env`:
   * Set the API token. Uncomment the following line, setting the value to the
     API token obtained in the first step:
     * `CIRCONUS_AUTH_TOKEN="<insert-token-here>"`
   * If in a full, on-premises deployment (Circonus Inside), set the API URL.
     **SaaS users (circonus.com) can skip this step.** Edit `noit.local.env` and
     uncomment the following line, setting the value to your deployment's API
     URL:
     * `CIRCONUS_API_URL="https://api.your.site.domain"`
   * If Circonus should establish an inbound connection to this broker,
     uncomment the following line, setting the value to a routable IPv4
     address. If this option is not enabled, the broker will establish an
     outbound connection to Circonus. See
     [External Connectivity](#external-connectivity) above.
     * `BROKER_IP="1.2.3.4"`
   * Optionally specify an alias name. This is a user-friendly name and will be
     displayed in the Circonus UI.  Uncomment the following line and set the
     value to the desired name (spaces are allowed, just be sure to use double
     quotes around the value):
     * `BROKER_NAME="Friendly Neighborhood Broker"`
   * Optionally specify a cluster name. If the named cluster already exists, this
     broker will join it. If it does not exist, a new cluster will be created
     with this broker as a member. Uncomment the following line and set the
     value to the desired cluster name (spaces are allowed, just be sure to
     use double quotes around the value):
     * `CLUSTER_NAME="My Cluster Name"`
1. [Stop the noitd service](#services)
1. `sudo /opt/napp/bin/provtool reprovision -cn <broker to rebuild>`
1. `sudo /opt/napp/bin/provtool rebuild`
1. [Start the noitd service](#services)


## Services

The broker package provides a service, "noitd", which is enabled automatically during package installation.

### noitd

The noitd service runs as a supervisor process with one or more child processes that actually perform checks. If a child process crashes, the supervisor will start another one, but if too many crashes happen in too short a time, the supervisor will stop itself rather than continue an endless cycle of restarts.

To start, stop, or restart:
```
/usr/bin/systemctl {start|stop|restart} noitd
```

To check status:
```
/usr/bin/systemctl status noitd
```

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

To help Circonus improve the quality of the broker software, an automated
reporting process can be activited to send details of crashes to Circonus for
analysis.  This requires that the broker machine be able to connect out to
`https://circonus.sp.backtrace.io:6098` to send reports.

To activate automated crash reporting on RHEL/CentOS 7:
```
yum install circonus-field-broker-crashreporter
```

To activate automated crash reporting on Ubuntu 20.04:
```
sudo apt install circonus-field-broker-crashreporter
```

A new service called "circonus-coroner" will be installed, which will watch for
noitd crash events and report them.  Each time a crash is noted, a summary of
the trace will be written to a file in /opt/noit/prod/traces with a ".trc"
extension. The .trc files are a local record of trace events for informational
purposes. These are small files that may be removed at your discretion.

There will also be, briefly, a report file with a .btt extension, which is what
the coroner service will upload to Circonus, and then remove. If there are .btt
files lingering in the traces directory, check that the coroner service is
running, and that the necessary network connectivity is available.

### Decommissioning

**Warning:**
>Decommissioning a broker deletes all checks associated with the broker, along
>with all other traces of it in the Circonus system.  To simply relocate a
>broker to another machine, please see the
>[Reinstallation](/circonus/administration/enterprise-brokers/#reinstallation)
>section above.  Also many [environment variables](/circonus/administration/enterprise-brokers/#environment-variables) can be changed, and applied with a restart, avoiding
>the need for decomissioning.

To decommission a broker, open the main menu and navigate to "Integrations ->
Brokers", then click "View" to go to the detail page for the broker in
question. From the Menu at top right, choose "Decommission Broker".

To reuse the same machine for a new broker install, all Circonus
packages (and dependencies) must be removed and the `/opt/napp` 
and `/opt/noit` directories deleted after decommissioning it. 

CentOS:
```
yum remove 'circonus*'
```

Ubuntu:
```
sudo apt remove 'circonus*'
```

At this point, follow the normal installation process.

### Sending Files to Circonus Support

When contacting Circonus Support (support@circonus.com) for assistance with
broker troubleshooting, logs or other files occaisionally need to be uploaded
for review by Support.  The instructions for this procedure can be found in the
[Tech Support](/circonus/appendix/tech-support/#sending-files-to-circonus-support)
Appendix.
