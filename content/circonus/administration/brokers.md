---
title: Brokers
---

# Circonus Enterprise Brokers {#CirconusEnterpriseBrokers}

## Overview {#Overview}
Circonus operates a worldwide system of nodes for configuring checks and gathering metrics. These nodes are known as Circonus Public Brokers and are available for use by any active Circonus accounts. Enterprise Brokers are software appliances that can be downloaded and installed in a customer's datacenter for running checks and gathering metrics privately.


## System Requirements {#SystemRequirements}
 * RHEL/CentOS 6/7, OmniOS r151014 LTS
 * 2 CPU cores
 * 4 Gbytes of RAM
 * 40 Gbytes of disk storage


## Installation {#Installation}
On all platforms, the necessary services will be started automatically upon package installation.


### RHEL 6 / CentOS 6 Installation {#RHEL6CentOS6Installation}
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

### RHEL 7 / CentOS 7 Installation {#RHEL7CentOS7Installation}
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

### OmniOS Installation {#OmniOSInstallation}
Follow these instructions to install an Enterprise Broker on OmniOS.

**Note:**
> The r151014 (LTS) version is required.

First, add the Circonus IPS publisher using the following commands:
```
# pkg set-publisher -g http://updates.circonus.net/omnios/r151014/ circonus
# pkg set-publisher -g http://updates.circonus.net/backtrace/omnios/ backtrace
```

Next, install the Broker package using the following command:
```
# pkg install field/broker
```


### External Connectivity {#ExternalConnectivity}
In default configuration, Circonus brokers receive secure connections from Circonus 
aggregation servers (Stratcon) and thus inbound connectivity must be established.
It is very common for operators to instead run Brokers with the `-nat` 
option during provisioning (see below) so that the Broker reaches out to establish 
connectivity instead.  If provisioned with `-nat` the broker only needs outbound connectivity 
and the rest of this section does not apply.

In this default configuration the Circonus aggregation service (Stratcon) establishes 
a secure SSL connection to the Broker. If the broker resides behind a firewall, a rule
needs to be added to the firewall allowing Circonus IP addresses to reach the Enterprise
Broker over TCP port 43191. The list of IP addresses from which Circonus
traffic originates may be obtained via DNS lookup of `out.circonus.net`.  This 
should be periodically checked and validated against the firewall rules as the IP 
addresses are subject to change.

The Enterprise Broker should be allowed to respond to these connections. No
other outbound connectivity initiated by the Broker is required, although it
may be desired for running outbound checks from the Broker.

### Provision the Broker {#ProvisiontheBroker}
Once the Broker is installed it must be provisioned via the command line utility `provtool`. Once provisioned, Circonus checks can be deployed onto the Enterprise Broker using the Circonus UI or Management API.

Preparation: Brokers must have an available broker slot on the account.  Available slots will be visible on the broker status page.  These are created by Customer Service for SaaS, or though the [admin functionality](/circonus/on-premises/installation/installation/#AddingBrokers) for Inside users.

This is the general purpose provisioning process:
1. Obtain an [API token](/circonus/api/#CreatinganAuthToken) that has Admin privilege.
1. [Stop the noitd service](#Services) if any is running.
1. If using Circonus Inside, set the api-url.   SaaS users can skip this step.  `sudo /opt/napp/bin/provtool config set api-url https://api.your.inside.install`
1. `sudo /opt/napp/bin/provtool config set api-token <ADMIN_USER_API_TOKEN>`
1. `sudo /opt/napp/bin/provtool provision <OPTIONS (see below)>`
    1. (optional) `sudo /opt/napp/bin/provtool provision -cluster_id <X>` as a second step to join a cluster
1. Start the `noitd` service

There are several common options that can be set when provisioning a Broker using the Provtool with the command:
```
provtool provision -ip <ip> [-nat]
```
These common options are:
1. `-ip <address>` : Required. In default configuration, this is the public IP that Circonus will reach out to in order to connect to the broker.  If run with `-nat` this should be the local ip of the broker.
1. `-nat` : Optional.  The `-nat` option will trigger the broker to connect to Circonus instead of Circonus connecting to the broker.  If `-nat` is set, the option `-ip <ip>` should be set to the local ip the broker is using.  This is the IP local things would connect to the broker over.

Additional provision flags, and other Provtool options are detailed below:


#### Provtool Options: {#ProvtoolOptions}
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


#### Specifying a broker slot {#Specifyingabrokerslot}
When provisioning a new broker, the provtool will automatically find and use
an unprovisioned broker slot.  This is the preferred method.  Broker slots can be 
viewed using the command `sudo /opt/napp/bin/provtool list`.  To specifiy a specific 
broker slot during provisioning, use the `-cn` option along with the CN of the desired slot.
Use caution.  If a CN is specified that is already in use then the broker will rekey
that slot so that it can be "rebuilt".  This will interfere with the existing broker
using that slot.


#### Rebuilding a failed broker {#Rebuildingafailedbroker}
This is the method for rebuilding a failed broker.

1. [Stop the noitd service](#Services)
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
1. [Stop the noitd service](#Services)
1. `sudo /opt/napp/bin/provtool config set api-token <AUTH_TOKEN>`
1. `sudo /opt/napp/bin/provtool provision -cn <broker to rebuild> -ip <publicip> ....`
1. `sudo /opt/napp/bin/provtool rebuild`
1. Start the noitd service


## Updating {#Updating}
Package updates from Circonus are periodically available for Enterprise Brokers.

When an Enterprise Broker receives an "Update Software" message, use one of the following commands to install the update, depending on the Broker's operating system:
 * RHEL/CentOS 6/7: 
```
yum update circonus-field-broker
```
 * OmniOS:
```
pkg update field/broker
```



## Reinstallation {#Reinstallation}
If it becomes necessary to reinstall the Broker on a new machine, having the existing Broker available makes the process simple, but Circonus support can still help restore checks even if a Broker system is completely lost. (Contact support@circonus.com.)

**Warning:**
> **Do NOT decommission the current broker while performing a reinstallation** under any circumstances, unless instructed to do so by Circonus support.

**Note:**
> The Broker status page may show a software out-of-date message when initially starting up the reinstalled Broker. This can take up to 15 minutes to clear.


### Current Broker Available {#CurrentBrokerAvailable}
Follow these instructions for reinstallation when the current Broker is available:

 1. Install the new Broker using the installation instructions above.
 1. Copy the contents of `/opt/napp/etc/ssl` to the new machine.
 1. Copy the contents of `/opt/noit/prod/etc/` to the new machine. At this point, the new broker is ready to boot up and start collecting data. The next steps will disconnect the existing broker from Circonus and connect the new one.
 1. Navigate to Broker's status page.
 1. Click on the Broker in question and update its IP to the new machine. Note that both the old and new Brokers should be running at this point, when entering the new IP, Circonus will reach out to the new Broker to make sure it can talk to it. If it can not, there will be an error message stating that the system could not update the Broker at this time.
 1. The `noitd` process on the old Broker may now be stopped.

The Broker should now show as connected on the broker status page.  For any problems, please contact Circonus Support (support@circonus.com).


### Current Broker Not Available {#CurrentBrokerNotAvailable}
If the current broker is no longer available, use the Provtool (`/opt/napp/bin/provtool`) and follow the instructions for "[Rebuilding a failed broker](/circonus/administration/brokers#Rebuildingafailedbroker)" above.


## Services {#Services}
The broker package provides two services: "noitd" and "jezebel". Both are enabled automatically during package installation.


### noitd {#noitd}
This is the primary monitoring daemon. It runs as a supervisor process with one or more child processes that actually perform checks. If a child process crashes, the supervisor will start another one, but if too many crashes happen in too short a time, the supervisor will stop itself rather than continue an endless cycle of restarts.

To start, stop, or restart:

 * RHEL/CentOS 6: `/sbin/service noitd {start|stop|restart}`
 * RHEL/CentOS 7: `/usr/bin/systemctl {start|stop|restart} noitd`
 * OmniOS: `/usr/sbin/svcadm {enable|disable|restart} noitd`

To check status:

 * RHEL/CentOS 6: `/sbin/service noitd status`
 * RHEL/CentOS 7: `/usr/bin/systemctl status noitd`
 * OmniOS: `/usr/bin/svcs -p noitd`

### jezebel {#jezebel}
This is a helper process, written in Java. It performs certain types of checks, mostly database checks. The noitd process communicates with jezebel over a local TCP connection, directing it to perform checks and collecting the metric data that is returned.

To start, stop, or restart:

 * RHEL/CentOS 6: `/sbin/service jezebel {start|stop|restart}`
 * RHEL/CentOS 7: `/usr/bin/systemctl {start|stop|restart} jezebel`
 * OmniOS: `/usr/sbin/svcadm {enable|disable|restart} jezebel`

To check status:

 * RHEL/CentOS 6: `/sbin/service jezebel status`
 * RHEL/CentOS 7: `/usr/bin/systemctl status jezebel`
 * OmniOS: `/usr/bin/svcs -p jezebel`

## Important Files and Directories {#ImportantFilesandDirectories}
* **/opt/napp/etc/ssl**  This is the location of SSL key and certificates, including the broker's client certificate. It is used for communicating with the Circonus infrastructure and as a CA certificate for authenticating connections from Circonus. All files in this directory should be backed up.

* **/opt/noit/prod/etc**  This location is for configuration files. In general, there should be no need to manually edit any of these file, with a couple of exceptions, noted below. Changes to editable files will be preserved during broker package updates.
  * `circonus-modules-enterprise.conf` may be edited to configure/enable/disable enterprise-related check modules such as collectd, statsd, and cloudwatch.
  * `circonus-modules-site.conf` may be updated to activate custom noitd modules. See the section below entitled "[Configuring a Custom Module with Reconnoiter](/circonus/administration/brokers#ConfiguringaCustomModulewithReconnoiter)" for details about custom modules.

* **/opt/noit/prod/etc/(checks,filtersets)**  These directories contain the individual check configurations assigned to this broker.  They are created, updated, and removed automatically by noitd and should not be changed manually.

* **/opt/noit/prod/log**  This location contains [log files](#logs).

* **/opt/noit/prod/log/noitd.feed** [Journaled log](#metric-feed-log) of collected metric data. **Although this is under the "log" directory, these files are not disposable. They contain metric data collected by the broker for delivery to Circonus (see below). Removal of these files will cause permanent data loss.**

## Logs

Logs are written under `/opt/noit/prod/log`.  There are two types of log files: `access.log` and `noitd.log`.

Access logs record operations on the broker's check configurations, as well as push operations such as HTTPTrap. The noitd log records activity about the noitd process itself, including startup messages and information about child processes that crash. These files are rotated automatically when they reach approximately 10MB in size and a total of about 5 historical files for each log will be retained.

### Metric Feed Log
Also in the same directory is `noitd.feed`. This subdirectory contains the journal of collected metric data that will be sent to Circonus. It is implemented with [JLog](https://github.com/omniti-labs/jlog), which allows multiple "subscribers" (Circonus metric aggregators) to read metric data, maintaining an individual checkpoint for each subscriber. If connectivity to the broker from Circonus is lost, metric data will accumulate in the feed directory until connectivity is restored.

**If the contents of this directory are lost before they are consumed by Circonus, data for affected metrics will be permanently lost.** Care should be taken to ensure sufficient disk space for this directory to grow in the event of a loss of connectivity. Disk space requirements grow as the number of checks and metrics configured on the broker increases.

## Configuring a Custom Module with Reconnoiter {#ConfiguringaCustomModulewithReconnoiter}
Note that these instructions may vary for Linux and OmniOS.

All Broker (Reconnoiter) configuration information is stored on the Broker machine in the path `/opt/noit/prod/etc`. Users can load custom modules by modifying a file in this path named `circonus-modules-site.conf`. This `.conf` file will not be overwritten by broker updates.

To add a custom module, simply add the name of the script or loadable object to the site modules config file, then restart the "noitd" service. Configuration changes will take effect when noitd is restarted.

For example, loading a lua module called "`myluamodule`" and a C module called "`mycmodule`" would look like this:
```
<?xml version="1.0" encoding="utf8"?>
<lua loader="lua">
<module name="myluamodule" object="noit.module.myluamodule"/>
</lua>
<module name="mycmodule" object="mycmodule"/>
```

This lua module would be delivered in a file called "`/opt/noit/prod/libexec/noit/lua/noit/module/myluamodule.lua`"

This C module would be delivered in a file called "`/opt/noit/prod/libexec/noit/mycmodule.so`".

For information about how to develop modules, refer to the [Reconnoiter Manual](https://login.circonus.com/resources/reconnoiter/) or view it externally on the [OmniTI Labs site](https://labs.omniti.com/labs/reconnoiter/docs/).


## Troubleshooting {#Troubleshooting}

### Check noitd Status {#ChecknoitdStatus}
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

### Activating Automated Crash Reporting {#ActivatingAutomatedCrashReporting}
To help Circonus improve the quality of the broker software, an automated reporting process can be activited to send details of crashes to Circonus for analysis.  This requires that the broker machine be able to connect out to https://circonus.sp.backtrace.io:6098 to send reports.

To activate automated crash reporting on RHEL/CentOS 6/7:
```
yum install circonus-field-broker-crashreporter
```

To activate automated crash reporting on OmniOS:
```
pkg install field/broker/crashreporter
```

A new service called "circonus-coroner" (RHEL/CentOS) or "svc:/circonus/coroner" (OmniOS)  will be installed, which will watch for noitd crash events and report them.  Each time a crash is noted, a summary of the trace will be written to a file in /opt/noit/prod/traces with a ".trc" extension. The .trc files are a local record of trace events for informational purposes.

There will also be, briefly, a report file with a .btt extension, which is what coroner will upload to Circonus, and then remove. If there are .btt files lingering in the traces directory, check that the coroner service is running, and that the necessary network connectivity is available.


### Time Synchronization problems with VirtualBox {#TimeSynchronizationproblemswithVirtualBox}
Under load, VirtualBox on Linux hosts can cause the system clock to temporarily hang and upset the VM guest. This can cause major problems with the Broker process (`noitd`). A possible solution is to disable host/guest time syncing.

First, install the VBox Guest Additions for Linux in the Enterprise Broker (see http://forums.virtualbox.org/viewtopic.php?t=4960) and shut down the appliance. 

Next, run the following command to disable host/guest time syncing:
```
"VBoxInternal/Devices/VMMDev/0/Config/GetHostTimeDisabled" "1"
```

Finally, boot the Enterprise Broker.


### Resetting the Agent to Factory Defaults {#ResettingtheAgenttoFactoryDefaults}
Once a Broker is provisioned and in use, the way to "start over" with a fresh Broker is to decommission the current Broker via the Circonus UI and create a new one.

**Warning:**
>Decommissioning a Broker deletes all checks associated with the broker, along with all other traces of it in the Circonus system.  To simply relocate a Broker to another machine, please see the [Reinstallation](/circonus/administration/brokers#Reinstallation) section above.

To decommission a Broker, open the main menu and navigate to "Account: Brokers", then open the details pane for the Broker in question.  Hover over the "bomb" icon in the lower right corner, and the "Decommission Broker" button will appear.  Click this button to initiate the decommissioning process.

To reuse the same machine that is currently in use, remove all Circonus packages and delete the `/opt/napp` and `/opt/noit` directories after decommissioning it.


### Sending Files to Circonus Support {#SendingFilestoCirconusSupport}
When contacting Circonus Support (support@circonus.com) for assistance with Broker troubleshooting, logs or other files occaisionally need to be uploaded for review by Support.  The instructions for this procedure can be found in the [Tech Support](/TechSupport#SendingFilestoCirconusSupport) Appendix.
