---
title: Manual Installation
weight: 20
---

# Installation

## System Requirements

IRONdb requires one of the following operating systems:
* RHEL/CentOS 7 (7.2+)
* Ubuntu 16.04 LTS

Additionally, IRONdb requires the [ZFS](http://open-zfs.org/) filesystem. This
is available natively on Ubuntu, but for EL7 installs, you will need to obtain
ZFS from the [ZFS on Linux](http://zfsonlinux.org) project. The setup script
expects a zpool to exist, but you do not need to create any filesystems or
directories ahead of time. Please refer to the appendix [ZFS Setup
Guide](/irondb/getting-started/zfs-guide/) for details and examples.

Hardware requirements will necessarily vary depending upon system scale and
cluster size. An appendix with general guidelines for [calculating cluster
size](/irondb/getting-started/cluster-sizing/) is provided. Please [contact us](/irondb/contact/) with
questions regarding system sizing.

Circonus recommends the following minimum system specification for the
single-node, free, 25K-metrics option:

* 1 CPU
* 4 GB RAM
* SSD-based storage, 20 GB available space

The following network protocols and ports are utilized. These are defaults and
may be changed via configuration files.

* 2003/tcp (Carbon plaintext submission)
* 4242/tcp (OpenTSDB plaintext submission)
* 8112/tcp (admin UI, HTTP REST API, [cluster replication](/irondb/administration/operations/#replication), [request proxying](/irondb/administration/operations/#proxying))
* 8112/udp ([cluster gossip](/irondb/administration/operations/#replication))
* 32322/tcp (admin console, localhost only)

### System Tuning

IRONdb is expected to perform well on a standard installation of supported
platforms, but to ensure optimal performance, there are a few tuning changes
that should be made. This is especially important if you plan to push your
IRONdb systems to the limit of your hardware.

#### Linux: Disable Swap

With systems dedicated solely to IRONdb, there is no need for swap space.
Configuring no swap space during installation is ideal, but you can also
`swapoff -a` and comment out any swap lines from `/etc/fstab`.

#### Linux: Disable Transparent Hugepages

[THP](https://www.kernel.org/doc/Documentation/vm/transhuge.txt) can interact
poorly with the ZFS ARC, causing reduced performance for IRONdb.

Disable by setting these two kernel options to `never`:
```
echo never > /sys/kernel/mm/transparent_hugepage/enabled
echo never > /sys/kernel/mm/transparent_hugepage/defrag
```

Making these changes persistent across reboot differs depending on
distribution.

For Ubuntu, install the `sysfsutils` package and edit `/etc/sysfs.conf`, adding
the following lines:
```
kernel/mm/transparent_hugepage/enabled = never
kernel/mm/transparent_hugepage/defrag = never
```
Note: the sysfs mount directory is automatically prepended to the attribute name.

For RHEL/CentOS, there is not a simple method to ensure THP is off. You can
add the above echo commands to `/etc/rc.local`, or you can create your own
systemd service to do it, or you can create a custom
[tuned](http://servicesblog.redhat.com/2012/04/16/tuning-your-system-with-tuned/)
profile containing a `[vm]` section that sets `transparent_hugepages=never`.

## Installation Steps

Follow these steps to get IRONdb installed on your system. If you are using one of our pre-built Amazon EC2 images, **these steps are already done for you**, and your free-25K instance will be configured automatically on first boot. Please refer to [EC2 installation](#ec2-installation) below.

System commands must be run as a privileged user, such as `root`, or via `sudo`.

### Configure Software Sources

Configure package repositories. During the IRONdb beta period, our development
(aka "pilot") repo is required.

#### EL7 Repository

If you wish to validate package signatures, the Circonus Packaging key is
available from [Keybase](https://keybase.io/circonuspkg).

Install the key:
```
rpm --import https://keybase.io/circonuspkg/pgp_keys.asc?fingerprint=14ff6826503494d85e62d2f22dd15eba6d4fa648
```

Create the file `/etc/yum.repos.d/Circonus.repo` with the following contents:

    [circonus]
    name=Circonus
    baseurl=http://pilot.circonus.net/centos/7/x86_64/
    enabled = 1
    gpgcheck = 1
    metadata_expire = 5m

    [circonus-crash-reporting]
    name=Circonus - Crash Reporting
    baseurl=http://updates.circonus.net/backtrace/centos/el7/
    enabled = 1
    gpgcheck = 0

If you do not wish to validate signatures, set `gpgcheck = 0` in the
`[circonus]` stanza.

#### Ubuntu 16.04 Repository

If you wish to validate package signatures, the Circonus Packaging key is
available from [Keybase](https://keybase.io/circonuspkg).

Install the key:
```
curl 'https://keybase.io/circonuspkg/pgp_keys.asc?fingerprint=14ff6826503494d85e62d2f22dd15eba6d4fa648' | sudo apt-key add -
```

Create the file `/etc/apt/sources.list.d/circonus.list` with the following
contents:

    deb [arch=amd64] http://pilot.circonus.net/ubuntu/ xenial main

If you do not wish to validate signatures, add the option `trusted=yes`:

    deb [arch=amd64 trusted=yes] http://pilot.circonus.net/ubuntu/ xenial main

Note that this will still generate a warning for some operations, such as
`apt-get update` since the default is to validate the signature on the main
repository metadata file(s).

Finally, run `apt-get update`.

### Install Package

EL7: `/usr/bin/yum install circonus-platform-irondb`

Ubuntu 16.04: we have a helper package that works around issues with dependency
resolution, since IRONdb is very specific about the versions of dependent
Circonus packages, and apt-get is unable to cope with them. The helper package
must be installed first, i.e., it cannot be installed in the same transaction
as the main package.
```
/usr/bin/apt-get install circonus-platform-irondb-apt-policy
/usr/bin/apt-get install circonus-platform-irondb
```

### Run Installer

Prepare site-specific information for setup. These values may be set via shell environment variables, or as arguments to the setup script. The environment variables are listed below.
   * ##### IRONDB\_NODE\_UUID

     *\(required\)* The ID of the current node, which must be unique within a
given cluster. You may use the `uuidgen` command that comes with your OS, or
generate a
[well-formed,
non-nil](https://en.wikipedia.org/wiki/Universally_unique_identifier)
UUID with an external tool or website. Note that this must be a _lowercase_
UUID. The `uuidgen` tool on some systems, notably MacOS, produces uppercase.
Setup will warn and convert the UUID to lowercase.

   * ##### IRONDB\_NODE\_ADDR

     *\(required\)* The IPv4 address of the current node, e.g., "192.168.1.100".

   * ##### IRONDB\_CHECK\_UUID

     *\(required\)* Check ID for Graphite metric ingestion, which must be the
same on all cluster nodes. You may use the `uuidgen` command that comes with
your OS, or generate a [well-formed,
non-nil](https://en.wikipedia.org/wiki/Universally_unique_identifier)
UUID with an external tool or website.  Note that this must be a _lowercase_
UUID. The `uuidgen` tool on some systems, notably MacOS, produces uppercase.
Setup will warn and convert the UUID to lowercase.

   * ##### IRONDB\_CRASH\_REPORTING

     *\(optional\)* Control enablement of automated crash reporting. Default is "on". IRONdb utilizes sophisticated crash tracing technology to help diagnose errors. Enabling crash reporting requires that the system be able to connect out to the Circonus reporting endpoint: https://circonus.sp.backtrace.io:6098 . If your site's network policy forbids this type of outbound connectivity, set the value to "off".
   * ##### IRONDB\_ZPOOL

     *\(optional\)* The name of the zpool that should be used for IRONdb storage. If this is not specified and there are multiple zpools in the system, setup chooses the pool with the most available space.

Run the setup script. All required options must be present, either as environment variables or via command-line arguments. A mix of environment variables and arguments is permitted, but environment variables take precedence over command-line arguments. Use the `-h` option to view a usage summary:

    Usage: /opt/circonus/bin/setup-irondb [-h] -a <ip-address> -n <node-uuid> -c <check-name> -u <check-uuid>
           [-b (on|off)] [-z <zpool>]
      -a <ip-address>  : Local IP address to use
      -n <node-uuid>   : Local node UUID
      -u <check-uuid>  : Graphite check UUID
      -b on|off        : Enable/disable crash reporting (default: on)
      -z <zpool>       : Use this zpool for data storage
                         (default: choose pool with most available space)
      -h               : Show usage summary

The setup script will configure your IRONdb instance and start the service. Upon successful completion, it will print out specific information about how to submit Graphite metrics. IRONdb supports both Carbon plaintext submission (port 2003) or HTTP POST. See the [Graphite Ingestion](/irondb/integrations/graphite/) section for details.

### Add License

(Optional)

As of version [0.12.3](/irondb/release-notes/#changes-in-0123) IRONdb comes with an
embedded license that allows all features with a limit of 25K active, unique
metric streams.  If you wish to obtain a more expansive license, please contact
[Circonus Sales](mailto:sales@circonus.com).

Add the `<license>` stanza from your purchased IRONdb license to the file
`/opt/circonus/etc/licenses.conf` on your IRONdb instance, within the enclosing
`<licenses>` tags. It should look something like this:

```xml
<licenses>
  <license id="(number)" sig="(cryptographic signature)">
    <graphite>true</graphite>
    <max_streams>25000</max_streams>
    <company>MyCompany</company>
  </license>
</licenses>
```

If you are running a cluster of IRONdb nodes, the license must be installed on
all nodes.

Restart the IRONdb service:
* (EL7, Ubuntu) `/bin/systemctl restart circonus-irondb`

For more on licensing see: [Configuration/licenses](/irondb/getting-started/configuration/#licensesconf)

## EC2 Installation

Circonus makes available EC2 AMIs that come preinstalled with Ubuntu and
IRONdb. The first time an instance of the AMI boots, the setup script runs and
configures a standalone instance. The AMI is suitable for HVM instance types, and the
minimum recommended instance type is `m4.large`.

For clusters, choose an instance type that has enough vCPUs to handle both incoming data and replicating data to other cluster nodes. A simple formula for a cluster of `N` nodes would be `N+1` vCPUs, up to maximum of 16.

Since the 0.6 beta release, IRONdb images are named in the format `irondb-VERSION`, where `VERSION` is the product version. Older versions of the AMI had `-single` appended to the name. There is no difference in how the initial automated setup works. The initial single-node configuration may be reconfigured for clustering prior to ingesting any metric data.

You can find IRONdb AMIs by
[searching](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/finding-an-ami.html)
for "IRONdb" among the community AMIs, using either the EC2 Console or the AWS
CLI.

For example, using the [AWS CLI](https://aws.amazon.com/cli/), you could locate
available IRONdb AMIs in the `us-west-1` region:

    aws ec2 describe-images \
      --region us-west-1 \
      --filters 'Name=description,Values=*IRONdb*' \
      --query 'Images[*].{ID:ImageId,NAME:Name}' 

Circonus currently publishes AMIs to the following regions:
* ap-northeast-1 (Tokyo)
* eu-central-1 (Frankfurt)
* us-east-1 (N. Virginia)
* us-east-2 (Ohio)
* us-west-1 (N. California)
* us-west-2 (Oregon)

Setup expects the required options to be provided as [instance user-data](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html#instancedata-add-user-data). When launching your instance, add the necessary options in environment-variable format, substituting your own UUIDs for the sample ones:

    IRONDB_NODE_UUID="57183ff2-37c7-4fb1-9ce4-bf3cdaef341d"
    IRONDB_CHECK_UUID="734e5981-c8a8-46bf-a948-1b0c0cbe1e38"
    IRONDB_CRASH_REPORTING="on"

The setup process will detect the local IP address of the instance at boot, so it is not necessary to specify `IRONDB_NODE_ADDR` in the user-data \(it will be ignored even if present.\)

Setup also expects to configure a zpool on the secondary EBS volume that is specified by the AMI. You do not need to specify `IRONDB_ZPOOL` in the user-data.

If you do not wish to use the pre-built AMI, you will need to create an
instance yourself using one of the supported operating systems and follow the
full setup instructions in the [previous section](#installation-steps).

### EC2 Security Groups

At a minimum, the nodes in an IRONdb cluster need to communicate with one another using port 8112, over both TCP and UDP. The TCP transport is used for replicating data,
while UDP is used for exchanging state information about each node, known as "gossip".

### EC2 CLI Example

The following is an example of using the [AWS command-line client](https://aws.amazon.com/cli/) to launch an instance with IRONdb user data. The user data was pasted into a local file, named `my-user-data` in this example:

    aws ec2 run-instances \
        --count 1 \
        --image-id ami-00000000 \
        --instance-type m3.medium \
        --key-name my-keypair \
        --security-group-ids sg-00000000 \
        --user-data file://my-user-data

IRONdb instances can take up to 5 minutes to become available. Once you have
launched your instance, you can find a log of the initial setup at
`/var/log/irondb-setup.log`. Depending on the speed of your instance, setup may
still be in progress when you first log in. Check the setup log for a `SETUP
COMPLETE` message.

### Cluster Configuration

Additional configuration is required for clusters of more than one IRONdb node.
The **topology** of a cluster describes the addresses and UUIDs of the
participating nodes, as well as the desired number of write copies for stored
data. Ownership of metric streams (deciding which node that stream's data
should be written to) is determined by the topology.

** The above setup script configures a single, standalone instance. If you have already been using such an instance, configuring it to be part of a cluster will cause your existing stored data to become unavailable. It is therefore preferable to complete cluster setup prior to ingesting any metric data into IRONdb. **

To configure a multi-node cluster, follow these steps.

#### Determine Cluster Parameters

The number and size of nodes you need is determined by several factors:
 * Frequency of measurement ingestion
 * Desired level of redundancy (write copies)
 * Minimum granularity of rollups
 * Retention period

The number of write copies determines the number of nodes that can be
unavailable before metric data become inaccessible. A cluster with `W` write
copies can survive `W-1` node failures before data become inaccessible.

See the [appendix on cluster sizing](/irondb/getting-started/cluster-sizing/) for details.

#### Topology Requirements

** There are a few important considerations for IRONdb cluster topologies: **
 * A specific topology is identified by a hash. IRONdb clusters always have an
   "active" topology, referenced by the hash.
 * The topology hash is determined using the values of `id`, `port`, and
   `weight`, as well as the ordering of the `<node>` stanzas. Changing any of
   these on a previously configured node will invalidate the topology and cause
   the node to refuse to start. This is a safety measure to guard against data
   loss.
 * UUIDs must be [well-formed,
   non-nil](https://en.wikipedia.org/wiki/Universally_unique_identifier), and lowercase.
 * The node address may be changed at any time without affecting the topology
   hash, but care should be taken not to change the ordering of any node
   stanzas.
 * As of version 0.17.1, hostnames are permitted in the `address` attribute,
   instead of IPv4 addresses. Hostnames will be resolved to IP addresses once
   at startup.
 * If a node fails, its replacement should keep the same UUID, but it can have
   a different IP address or hostname.

#### Create Topology Layout

The topology layout describes the particular nodes that are part of the cluster as well as aspects of operation for the cluster as a whole, such as the number of write copies. The layout file is not read directly by IRONdb, rather it is used to create a canonical topology representation that will be referenced by the IRONdb config.

A helper script exists for creating the topology: `/opt/circonus/bin/topo-helper`:
```
Usage: ./topo-helper [-h] -a <start address>|-A <addr_file> -w <write copies> [-i <uuid,uuid,...>|-n <node_count>] [-s]
  -a <start address> : Starting IP address (inclusive)
  -A <addr_file>     : File containing node IPs or hostnames, one per line
  -i <uuid,uuid,...> : List of (lowercased) node UUIDs
                       If omitted, UUIDs will be auto-generated
  -n <node_count>    : Number of nodes in the cluster (required if -i is omitted)
  -s                 : Create a sided configuration
  -w <write copies>  : Number of write copies
  -h                 : Show usage summary
```

This will create a temporary config, which you can edit afterward, if needed,
before importing. There are multiple options for generating the list of IP
addresses or hostnames, and for choosing the node UUIDs.

The simplest form is to give a starting IP address, a node count, and a
write-copies value. For example, in a cluster of 3 nodes, where we want 2 write
copies:
```
/opt/circonus/bin/topo-helper -a 192.168.1.11 -n 3 -w 2
```

The resulting temporary config (`/tmp/topology.tmp`) looks like this:
```
<nodes write_copies="2">
  <node id="7dffe44b-47c6-43e1-db6f-dc3094b793a8"
        address="192.168.1.11"
        apiport="8112"
        port="8112"
        weight="170"/>
  <node id="964f7a5a-6aa5-4123-c07c-8e1a4fdb8870"
        address="192.168.1.12"
        apiport="8112"
        port="8112"
        weight="170"/>
  <node id="c85237f1-b6d7-cf98-bfef-d2a77b7e0181"
        address="192.168.1.13"
        apiport="8112"
        port="8112"
        weight="170"/>
</nodes>
```

The helper script auto-generated the node UUIDs. You may edit this file if
needed, for example if your IP addresses are not sequential.

You may supply your own UUIDs in a comma-separated list, in which case the node
count will be implied by the number of UUIDs:
```
/opt/circonus/bin/topo-helper -a 192.168.1.11 -w 2 -i <uuid>,<uuid>,<uuid>
```

If you wish to use DNS names instead of IP addresses, you can provide them in a
file, one per line:
```
$ cat host_list.txt
myhost1.example.com
myhost2.example.com
myhost3.example.com
```

Then pass the filename to the helper script:
```
/opt/circonus/bin/topo-helper -A host_list.txt -n 3 -w 2
```

To configure a [sided cluster](#sided-clusters), use the `-s` option. This will
assign alternate nodes to side "a" or "b". If you wish to divide the list
differently, you may edit the `/tmp/topology.tmp` file accordingly. If omitted,
the cluster will be non-sided, if the node count is less than 10. For clusters
of 10 or more nodes, the helper script will default to configuring a sided
cluster, because there are significant operational benefits, described
below.

When you are satisfied that it looks the way you want, copy `/tmp/topology.tmp`
to `/opt/circonus/etc/topology` on each node, then proceed to the [Import
Topology](#import-topology) step.

##### Sided Clusters

One additional configuration dimension is possible for IRONdb clusters. A
cluster may be divided into two "sides", with the guarantee that at least one
copy of each stored metric exists on each side of the cluster. For `W` values
greater than 2, write copies will be assigned to sides as evenly as possible.
Values divisible by 2 will have the same number of copies on each side, while
odd-numbered `W` values will place the additional copy on the same side as the
primary node for each metric. This allows for clusters deployed across typical
failure domains such as network switches, rack cabinets or physical locations.

Even if the cluster nodes are not actually deployed across a failure domain,
there are operational benefits to using a sided configuration, and as such it
is highly recommended that clusters of 10 or more nodes be configured to be
sided. For example, a 32-node, non-sided cluster with 2 write copies will have
a partial outage of data availability if any 2 nodes are unavailable
simultaneously. If the same cluster were configured with sides, then up to half
the nodes (8 from side A and 8 from side B) could be unavailable and all data
would still be readable.

Sided-cluster configuration is subject to the following restrictions:

 * Only 2 sides are permitted.
 * An active, non-sided cluster cannot be converted into a sided cluster as
   this would change the existing topology, which is not permitted. The same is
   true for conversion from sided to non-sided.
 * Both sides must be specified, and non-empty (in other words, it is an error
   to configure a sided cluster with all hosts on one side.)

To configure a sided topology, add the `side` attribute to each `<node>`, with
a value of either `a` or `b`. If using the `topo-helper` tool in the previous
section, use the `-s` option. A sided configuration looks something like this:
```
<nodes write_copies="2">
  <node id="7dffe44b-47c6-43e1-db6f-dc3094b793a8"
        address="192.168.1.11"
        apiport="8112"
        port="8112"
        side="a"
        weight="170"/>
  <node id="964f7a5a-6aa5-4123-c07c-8e1a4fdb8870"
        address="192.168.1.12"
        apiport="8112"
        port="8112"
        side="a"
        weight="170"/>
  <node id="c85237f1-b6d7-cf98-bfef-d2a77b7e0181"
        address="192.168.1.13"
        apiport="8112"
        port="8112"
        side="b"
        weight="170"/>
</nodes>
```

#### Import Topology

This step calculates a hash of certain attributes of the topology, creating a unique "fingerprint" that identifies this specific topology. It is this hash that IRONdb uses to load the cluster topology at startup. Import the desired topology with the following command:

    /opt/circonus/bin/snowthimport \
      -c /opt/circonus/etc/irondb.conf \
      -f /opt/circonus/etc/topology

If successful, the output of the command is `compiling to <long-hash-string>`.

Next, update `/opt/circonus/etc/irondb.conf` and locate the `topology` section, typically near the end of the file. Set the value of the topology's `active` attribute to the hash reported by `snowthimport`. It should look something like this:

    <topology path="/opt/circonus/etc/irondb-topo"
              active="742097e543a5fb8754667a79b9b2dc59e266593974fb2d4288b03e48a4cbcff2"
              next=""
              redo="/irondb/redo/{node}"
    />

Save the file and restart IRONdb:
* (EL7, Ubuntu) `/bin/systemctl restart circonus-irondb`

Repeat the import process on each cluster node.

#### Verify Cluster Communication

Once all nodes have the cluster topology imported and have been restarted, verify that the nodes are communicating with one another by viewing the Replication Latency tab of the [IRONdb Operations Dashboard](/irondb/administration/operations/#operations-dashboard) on any node. You should see all of the cluster nodes listed by their IP address and port, and there should be a latency meter for each of the other cluster peers listed within each node's box.

The node currently being viewed is always listed in blue, with the other nodes listed in either green, yellow, or red, depending on when the current node last received a gossip message from that node. If a node is listed in black, then no gossip message has been received from that node since the current node started. Ensure that the nodes can communicate with each other via port 8112 over both TCP and UDP. See the [Replication Latency tab](/irondb/administration/operations/#replication-latency-tab) documentation for details on the information visible in this tab.

## Updating

An installed node may be updated to the latest available version of
IRONdb by following these steps:

EL7:

```
/usr/bin/yum update circonus-platform-irondb && \
/bin/systemctl restart circonus-irondb
```

Ubuntu 16.04:

We have a helper package on Ubuntu that works around issues with dependency
resolution, since IRONdb is very specific about the versions of dependent
Circonus packages, and apt-get is unable to cope with them. The helper package
must be upgraded first, i.e., it cannot be upgraded in the same transaction
as the main package.

```
/usr/bin/apt-get update && \
/usr/bin/apt-get install circonus-platform-irondb-apt-policy && \
/usr/bin/apt-get install circonus-platform-irondb && \
/bin/systemctl restart circonus-irondb
```

In a cluster of IRONdb nodes, service restarts should be staggered so as not to jeopardize availability of metric data. An interval of 30 seconds between node restarts is considered safe.
