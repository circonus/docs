---
title: Installation
weight: 30
---

# CentOS

Perform each of the following procedures to install Circonus on CentOS 7:

 1. Install the [machine](#InstalltheMachine).
 1. Configure the Circonus Inside [yum repository](#configure-the-circonus-inside-yum-repository).
 1. Install [Hooper](#install-hooper).

Procedures for each of these steps are described in the subsections below.

Once these procedures are complete, proceed to the [General Installation](#general-installation) section and follow the steps there.

## Install the Machine

First, perform a Basic Server install of CentOS x86\_64. Refer to instructions for CentOS.

**Warning:**
>The installation of Circonus Inside on CentOS requires many packages from the upstream CentOS distribution, so running a "minimal set" or a custom mirror of CentOS with some packages culled may cause serious issues that will prevent the successful installation or operation of the product.

## Install ZFS

The ZFS filesystem is **required** for nodes in the `data_storage` role , and
optional for the `long_tail_storage` and `web_db` roles.  It is not included in
the RHEL or CentOS distributions, so additional configuration is required.  See
the [installation
instructions](https://github.com/zfsonlinux/zfs/wiki/RHEL-and-CentOS) provided
by the ZFS On Linux project.

Additionally, the [IRONdb manual](/irondb/getting-started/zfs-guide) has an
appendix giving a brief tutorial on ZFS setup. Note, however, that the final
step of the appendix, which refers to IRONdb setup, is not required for
Circonus Inside. **Do not install any IRONdb packages.**

Roles that support ZFS expect the ZFS storage pool (zpool) to exist prior
to starting the installation process. The zpool may be named as desired, and
all hosts in the role must have the [zfs_dataset_base](#machinfo-attributes)
attribute defined in their `machinfo` objects. Typically this is set to the
name of the zpool, but could be the name of any existing dataset.

For roles where ZFS support is optional, it must be configured at the time of
initial deployment of a host in that role. It is not supported to retrofit ZFS
storage to a deployed host.

## Configure the Circonus Inside yum Repository

Place the following contents in `/etc/yum.repos.d/Circonus.repo` to configure the Circonus Inside yum repository:

### EL7 Repo

```
[circonus]
name=circonus
enabled=1
baseurl=http://updates.circonus.net/centos/7/x86_64/
gpgcheck=0
metadata_expire=30m
```

> Note: starting with the 2019-07-29 release, it is possible to pin your repo
> configuration to a specific release. This allows you to install or update to
> a release that is not the latest.

To specify a release, modify the `baseurl` value above to be:

```
http://updates.circonus.net/centos/7/release-YYYYMMDD/x86_64/
```

where `YYYYMMDD` matches the date of the desired release, e.g. `20190729`.

Ensure that you make this change _prior_ to first-time installation or
performing an update, and that you specify a release _later_ than what you are
currently running. See the [Changelog page](/circonus/on-premises/changelog) of
the Operations Manual for how to determine what release you are running.

**Downgrades are not supported.**

## Install Hooper

Run the following command to install Hooper:
```
yum -y install circonus-field-hooper
```

Once this is complete, proceed to the next section.

## General Installation

### Creating a site config

See below for explanations of each attribute.

Unless otherwise noted below, all passwords must be alphanumeric only (no
special characters) due to the multitude of ways they are templated into
configuration files.

Where UUIDs are required, you may generate them using the `uuidgen`
command-line tool found on MacOS X and Linux systems, or by using a web-based
tool such as https://www.uuidgenerator.net

Note that `uuidgen(1)` on MacOS generates capitalized UUIDs, while Circonus
prefers lowercase.  You can make the UUID lowercase using the following
command:
```
uuidgen | tr '[:upper:]' '[:lower:]'
```

#### Sample site.json

```
{
  "id": "site",
  "domain": "circonus.example.com",
  "cookie_domain": "circonus.example.com",
  "ops_email": [ "ops@example.com" ],
  "noreply_email": "noreply@example.com",
  "saas_check_uuid": "e2d1af13-68c9-c773-8a38-93cc7b590663",
  "saas_check_secret": "s00per-s3cr3t",
  "ga_client_id": "939737797736-omh6225fhvucqpqi6nl4qn0v3vm567av.apps.googleusercontent.com",
  "ga_client_secret": "COC0lQ1ajhTtiCGH7Z2Elqre",
  "min_check_period": "30",
  "additional_web_config": [],
  "fault_reporting": {
    "crash_reporting": "on"
  },
  "svclist": {
    "api": {
      "_machlist": [ "server1" ],
      "external_host": "api.circonus.example.com",
      "certificate_type": "internal"
    },
    "ca": {
      "_machlist": [ "server2", "server3" ],
      "primary": "server2",
      "key_pass": "badpassword",
      "org_defaults": {
        "country": "US",
        "state_prov": "Maryland",
        "locality": "Fulton",
        "org_name": "Example Corp, Inc.",
        "ou": "Production",
        "common_name": "Example Corp Circonus Certificate Authority",
        "email": "ca@example.com"
      }
    },
    "caql_broker": {
      "_machlist": [ "server1" ]
    },
    "data_storage": {
      "_machlist": [ "server3", "server4" ],
      "one_minute_rollup_since": 0,
      "backing_store": "nntbs",
      "rollup_retention": {
        "numeric": {
          "1m": "52w",
          "5m": "104w",
          "3h": "520w"
        }
      },
      "ncopies": "2",
      "side_a": [ "server3" ],
      "side_b": [ "server4" ]
    },
    "fault-detection": {
      "_machlist": [ "server2" ],
      "registration_token": "ee4ff400-31ee-454c-92d7-ee6c49c9cab5",
      "faultd_cluster": {
        "server2": {
          "node_id": "a4af7d66-4b71-4799-a084-a46589022d92"
        }
      },
    },
    "hub": {
      "_machlist": [ "server3" ]
    },
    "long_tail_storage": {
      "_machlist": [ "server1" ]
    },
    "mq": {
      "_machlist": [ "server1", "server2" ],
      "cookie": "monster",
      "password": "badpassword"
    },
    "notification": {
      "_machlist": [ "server3" ],
      "bulksms_user": "sample",
      "bulksms_pass": "badpassword",
      "smsmatrix_user": "foo@foo.bar",
      "smsmatrix_pass": "badpassword",
      "twilio_url": "https://foo.bar",
      "twilio_sid": "eCab9e338befd12a34cbddce07c42ffd45",
      "twilio_authtoken": "1fb833ec69e110e9d4830268ac641436",
      "twilio_phone": "443-555-5309"
    },
    "stratcon": {
      "_machlist": [ "server1" ],
      "node_ids": {
        "server1": "593d5260-1c37-4152-b9f7-39de9d954306"
      },
      "irondb_tuning": {
        "timeout": 8000,
        "connecttimeout": 1000,
        "put_concurrency": 50
      }
    },
    "web-db": {
      "_machlist": [ "server2", "server4" ],
      "master": "server2",
      "connect_host": "server2",
      "read_connect_host": "server4",
      "allowed_subnets": [ "10.1.2.0/24" ],
      "admin_pass": "badpassword",
      "ca_pass": "badpassword",
      "web_pass": "badpassword",
      "tuning": {
        "max_connections":350,
        "shared_buffers": "1024MB",
        "work_mem": "4MB",
        "maintenance_work_mem": "1024MB",
        "effective_cache_size": "12288MB"
      },
      "wal": {
        "wal_level": "hot_standby",
        "checkpoint_segments": "50",
        "checkpoint_completion_target": "0.9",
        "archive_mode": "on",
        "archive_command": ": ",
        "archive_timeout":0
      },
      "replication": {
        "max_wal_senders":7,
        "wal_keep_segments":100,
        "hot_standby": "on",
        "hot_standby_feedback": "on"
      },
      "logging": {
        "log_filename": "postgresql-%Y-%m-%d_%H%M%S.log",
        "log_min_messages": "warning",
        "log_min_error_statement": "warning",
        "log_min_duration_statement": "1000",
        "log_duration": "off",
        "log_error_verbosity": "default",
        "log_statement": "ddl",
        "log_timezone": "UTC"
      }
    },
    "web-frontend": {
      "_machlist": [ "server2" ],
      "url_host": "www",
      "session_key": "WBqQRj3kUPVMhHuxVl4aTYx7",
      "oauth2_key": "eId8q9v2uzCJM2aHHVlYTZvi",
      "certificate_type": "internal"
    },
    "web-stream": {
      "_machlist": [ "server1" ],
      "stream_service_name": "s.circonus.example.com",
      "certificate_type": "commercial"
    }
  },
  "machinfo": {
    "server1": {
      "ip_address": "10.1.2.84",
      "zfs_dataset_base": "data/set/server1"
    },
    "server2": {
      "ip_address": "10.1.2.85",
      "zfs_dataset_base": "data/set/server2"
    },
    "server3": {
      "ip_address": "10.1.2.86",
      "zfs_dataset_base": "data/set/server3",
      "node_id": "b373ac46-411c-42c4-bb41-1f96551e83ce"
    },
    "server4": {
      "ip_address": "10.1.2.87",
      "zfs_dataset_base": "data/set/server4",
      "node_id": "d4fb20e1-e9f5-4dee-b8b4-f893ad67d20d"
    }
  },
  "additional_hosts": {
    "mailhost": {
      "ip_address": "10.1.2.99"
    }
  }
}
```

### Site Config Attribute Reference

* [Top-level](/circonus/on-premises/installation/installation/#top-level-attributes)
* [Service List](/circonus/on-premises/installation/installation/#service-list-attributes)
  * [API](/circonus/on-premises/installation/installation/#api-attributes)
  * [CA](/circonus/on-premises/installation/installation/#ca-attributes)
  * [CAQL Broker](/circonus/on-premises/installation/installation/#caql_broker-attributes)
  * [Data Storage](/circonus/on-premises/installation/installation/#data_storage-attributes)
  * [Fault Detection](/circonus/on-premises/installation/installation/#fault-detection-attributes)
  * [Hub](/circonus/on-premises/installation/installation/#hub-attributes)
  * [Long-tail Storage](/circonus/on-premises/installation/installation/#long_tail_storage-attributes)
  * [MQ](/circonus/on-premises/installation/installation/#mq-attributes)
  * [Notification](/circonus/on-premises/installation/installation/#notification-attributes)
  * [Stratcon](/circonus/on-premises/installation/installation/#stratcon-attributes)
  * [Web DB](/circonus/on-premises/installation/installation/#web-db-attributes)
  * [Web Frontend](/circonus/on-premises/installation/installation/#web-frontend-attributes)
  * [Web Stream](/circonus/on-premises/installation/installation/#web-stream-attributes)
* [Machinfo](/circonus/on-premises/installation/installation/#machinfo-attributes)
* [Additional Hosts](/circonus/on-premises/installation/installation/#additional_hosts-attributes)
* [Authentication](/circonus/on-premises/installation/installation/#authentication-settings)
  * [LDAP](/circonus/on-premises/installation/installation/#ldap)
  * [Header](/circonus/on-premises/installation/installation/#header)

#### Top-Level Attributes

id
: (required) Data bag ID. Must be set to the value "site".  This attribute is used by chef-solo as part of `data_bag` processing.

domain
: (required) The site's domain name. This is used in several places to
  construct URL hostnames for the components that are used by customers, such
  as the API and web UI portal. **Must be a fully-qualified domain name
  (FQDN).**

cookie_domain
: (optional) The domain name common to all client-facing endpoints, which will
  be used for session cookies. If absent, the `domain` value is used, and it is
  assumed that all endpoints are either the same as, or subdomains of, the site
  domain. This option may be useful if your web frontend and API hostnames are
  not both derived from the site domain. For example, if your web and API hosts
  are "circonus.example.com" and "circonusapi.example.com", respectively, then
  you would set `cookie_domain` to `example.com`. In this case you should also
  set the `external_host` [API attribute](/circonus/on-premises/installation/installation/#api-attributes).

ops_email
: (required) Email address to be used as a recipient address for various cron
  jobs and system-level administrative notices.

noreply_email
: (required) Email address to be used as the sender on outgoing emails from the
  notification component.

saas_check_uuid
: (optional, but required if `saas_check_secret` is set) If desired, an
  external check in the Circonus SaaS system may be configured which will
  monitor the components of Circonus Inside that cannot monitor themselves
  (such as the alerting and notification components).  The check is an HTTP
  trap check sent from within the Circonus Inside installation, so no incoming
  connections are required.  Circonus Support (support@circonus.com) will
  provide the UUID if you choose to set this up.

saas_check_secret
: (optional, but required if `saas_check_uuid` is set)  This is the
  authentication token that is used with the HTTP trap check.  Circonus Support
  (support@circonus.com) will provide this value.

min_check_period
: (optional)  The minimum allowable check frequency, in seconds.  The value
  must be greater than or equal to 1 and less than or equal to 60 (1 __<__ x
  __<__ 60). Users may configure a check's frequency in the UI, but may not set
  it lower than this value.  If not specified, the value defaults to 30.

additional_web_config
: (optional) An array of config lines to be appended to the `circonus.conf`
  file. Generally, this should only be set at the direction of Circonus
  Support.

fault_reporting
: (optional) A hash of fault-reporting options. Currently only one attribute is
  defined: `crash_reporting`, with values of "on" or "off". If the value is not
  set to "off", then it enables application crash tracing and aggregation using
  [Backtrace.io](http://backtrace.io/) technology. Supported components will
  have any crashes automatically categorized and uploaded to Circonus for
  analysis.  This helps us better understand software faults and correlate
  issues across multiple deployments. The value defaults to "on" if not
  specified. 
  **Use of this facility requires that your Circonus systems be able to connect
  outbound to `https://circonus.sp.backtrace.io:6098` in order to upload trace
  data. If this is not possible in your environment, you may wish to set this
  feature to "off".**

ga_client_id
: (optional) The Client ID for Google Analytics.

ga_client_secret
: (optional) The Client secret for Google Analytics.

active_datacenter
: (requred for multi-datacenter) Boolean value (true/false) denoting whether
  the current site is the active datacenter. Must be omitted for
  single-datacenter deployments.

svclist
: (required)  The list of Circonus Inside component roles.

machinfo
: (required)  The list of machines to which the Circonus Inside roles will be
  assigned. Each entry here will have its name and IP address added to the
  `/etc/hosts` file on each node, to facilitate inter-component communication
  without requiring DNS configuration.

additional_hosts
: (optional) A list of additional hosts for adding entries to `/etc/hosts`.
  This may be used, for example, to provide the unqualified name, "mailhost",
  and set the IP address to an outbound SMTP relay in your network.

#### Service List Attributes

Each key in the `svclist` object controls configuration for a functional
component of the Circonus Inside platform.

Each component must have a `_machlist` attribute, whose value is an array of
`machinfo` host names that should be assigned this service role.

Additional, component-specific attributes are described below.

##### `api` Attributes

certificate_type
: (optional) The type of TLS certificate to use. Allowed values are
  `internal`, `commercial`, or `none`. If left unspecified, the default is
  `internal`. Use `commercial` if you plan to provide your own certificate for
  this service. See the [Addressing PKI Requirements](/circonus/on-premises/installation/installation/#addressing-pki-requirements)
  section below.
  * `internal` will register internally-signed certificates for the service
    where the attribute appears. This is the default if this attribute is not
    present.
  * `commercial` will assume that a user-provided cert/key pair will be
    provided, and it will not register an internal cert for the service
    where this attribute appears.
  * `none` will skip configuring any SSL pieces for the service where the
    attribute appears.

external_host
: (optional) The hostname of the external (client-facing) API endpoint. If your
  deployment does not follow the convention of `api.<site_domain>`, provide the
  hostname here. This is used by the web_frontend to build requests direct from
  client browsers to the API for certain UI features, such as autocomplete for
  metric names in the Metrics Explorer. If absent, the `api.<site_domain>`
  convention is assumed. If you set this attribute, you should also set the
  `cookie_domain` [top-level attribute](/circonus/on-premises/installation/installation/#top-level-attributes).

##### `ca` Attributes

key_pass
: (required) The CA private key passphrase. May contain special characters.

org_defaults
: (required) The enclosed attributes correspond to those used in Certificate
  Signing Requests (CSRs).
  * `country` - Two-letter country code
  * `state_prov` - Full name of state or province
  * `locality` - Full name of locality (city)
  * `org_name` - Name of organization (company)
  * `ou` - Organizational Unit name (e.g., "IT Services")
  * `common_name` - The CN of the CA certificate. Defaults to "Circonus Inside
    Certificate Authority"; may be altered if desired.
  * `email` - Email address of technical contact for the CA

primary
: (optional) If multiple hosts are in the CA role, this attribute specifies
  which is to be the primary. Non-primary CA hosts will get the standard
  directory structure created but will not generate CA keys nor run the
  `ca_processor` service. It is recommended that operators set up a regular
  sync of the files in `/opt/circonus/CA` to all non-primary CA hosts.

##### `caql_broker` Attributes

registration_token
: (required) A UUID that will be used as an API token. This token will be
  pre-authorized in the API.

##### `data_storage` Attributes

one_minute_rollup_since
: (optional) Informs the `web-frontend` components of when one-minute data
  collection began. If absent or set to `0`, this indicates that one-minute
  data has been available from the start. Otherwise, the value should be set to
  the UNIX timestamp of when one-minute data collection began. Any graph view
  spanning this event will default to showing a minimum of five-minute
  granularity.

backing_store
: (optional) Configures the storage format for numeric rollups. Acceptable
  values are "nntbs" or "nnt". If absent or empty, the legacy "nnt" format of
  one file per metric, per rollup period is used, for backward compatibility.
  If set to "nntbs", rollups will be stored in time-based shards. **All new
  deployments should use "nntbs". This setting cannot be changed on an existing
  cluster that has already stored numeric rollups**.

rollup_retention
: (optional) Sets the retention window for rollups. Currently the only
  supported rollup type is "numeric", and only works when `backing_store` is
  "nntbs". Any of the three rollup periods, "1m", "5m", "3h", may have a
  retention period set. The format of the retention value is an integer
  followed by either "d" for days or "w" for weeks. Years are not supported
  because they do not contain the same number of days; use multiples of 52
  weeks to represent years. If the retention object is absent, all rollups are
  kept "forever". If some rollups have retention values and others do not, the
  ones without retention values are kept "forever". Retention works by
  comparing the end date of a time shard to the retention value. If the time
  between "now" and the shard's end date is equal to or greater than the
  retention value, the entire shard is deleted.

rollup_suppression_filter
: (optional) A [tag query](/irondb/metric-names-tags-queries/#tag-queries) expression whose matching metrics will
  not be rolled up. They will naturally expire from the raw database as shards
  are deleted. This is appropriate for metrics whose usefulness is short-lived,
  or not valuable at less than full resolution. For example, the filter
  expression `and(__rollup:false)` will skip rolling up any metric having the
  stream tag `__rollup` with a value of `false`.

ncopies
: (optional) Specifies the number of copies of each metric measurement that
  should be stored across the `data_storage` cluster.  If not specified, it
  will be calculated based on the number of nodes assigned to the
  `data_storage` role.

secondary_cluster
: (required for multi-datacenter) The list of hosts assigned to the
  `data_storage` role in the backup datacenter. This must match the `_machlist`
  in the backup datacenter's `site.json`.

side_{a,b}
: (optional) Configures a [split IRONdb cluster](/irondb/getting-started/manual-installation/#split-clusters).
  Each side is an array of hostnames as listed in `_machlist`. If not
  specified, the default is that the cluster is not split. A split cluster is
  one where nodes are assigned to one side or another. IRONdb will ensure that
  at least one copy of each stored metric exists on each side of the cluster.
  This allows for cluster distribution across typical failure domains such as
  network switches, rack cabinets or physical locations. Split-cluster
  configuration is subject to the following restrictions:
  * An active, non-split cluster cannot be converted into a split cluster as
    this would change the layout of data that has already been stored, which is
    not permitted.
  * Both sides must be specified, and non-empty (in other words, it is an error
    to configure a split cluster with all hosts on one side only.)
  * All hosts in `_machlist` must be accounted for. It is an error to mix hosts
    that are configured for a specific side with hosts that are not assigned to
    a side.

##### `fault-detection` Attributes

registration_token
: (required) A UUID that will be used as a pre-authorized API token for the
  fault detection daemon to access ruleset and maintenance period information
  when it starts up.

faultd_cluster
: (required) An object describing each fault detection node in the cluster.
  Object keys are the host names from the `_machlist` array, and values are
  objects with a single key, `node_id` whose value is a UUID string.

##### `hub` Attributes

No additional attributes.

##### `long_tail_storage` Attributes

No additional attributes.

This service is optional. It is used to save all ingested metrics in their
original form, for disaster-recovery purposes. If not specified, incoming
metric data will simply be discarded after it has been committed to IRONdb.

##### `mq` Attributes

cookie
: (required) Used to configure multiple RabbitMQ hosts into a cluster.  Must be
  an alphanumeric string, but length is arbitrary.

password
: (required) Used by components that need to connect to RabbitMQ.

##### `notification` Attributes

The following attributes cover the various channels over which notifications
may be delivered.  Email notifications are always enabled and require no
additional configuration here. SMS attributes are optional, but if used, all
attributes for that provider are required.
 
BulkSMS, SMS Matrix, and Twilio are the SMS service providers that Circonus
Inside supports.

bulksms_user
: BulkSMS username

bulksms_pass
: BulkSMS password

smsmatrix_user
: SMS Matrix username

smsmatrix_pass
: SMS Matrix password

twilio_url
: Twilio API URL

twilio_sid
: Twilio application identifier

twilio_authtoken
: Twilio authentication token

twilio_phone
: Twilio application phone number

##### `stratcon` Attributes

node_ids
: (required) An object mapping hostnames to UUIDs, uniquely identifying each
  Stratcon host. Every host assigned to the stratcon role must have its own
  UUID.

fq_backlog
: (optional) Sets the FQ client backlog parameter. This is the number of
  outstanding messages that are allowed before FQ's block/drop policy is
  applied.  If not specified, the FQ default value (10000) will be used.

fq_round_robin
: (optional) If "true" (string), instead of sending a message to every FQ,
  stratcon will round robin the message across the configured FQ. **Do not set
  this value unless instructed to do so by Circonus Support.** Normally,
  stratcon sends a copy of every message to every FQ daemon it knows about,
  providing redundancy if an FQ daemon should fail.

feeds
: (optional) Defines the number of MQ hosts to which each stratcon host should
  connect. This is used when scaling out the stratcon role. The MQ host list
  will be sliced into groups of "feeds" length and those groups distributed
  among the stratcon hosts. There must be at least X MQ hosts configured, where
  X is the number of stratcon hosts times the number of feeds, otherwise it is
  an error.  If more than this number of MQs are configured, some will be
  unused and Hooper will issue a notice to this effect at the end of each run.
  If this attribute is not specified, all stratcons will connect to all MQs.

groups
: (optional, but required for multi-datacenter) If set, must be set to an array
  of arrays denoting which `_machlist` entries to group together.  Brokers are
  balanced across members of any array, and creating multiple arrays provides
  redundancy. There are different scenarios possible with multiple stratcons,
  depending on how the operator wants to divide the brokers and whether
  redundancy is desired.
  **Note:** To set up stratcons in [multi-datacenter setups](#multiple-datacenters),
  the groups attribute must include all the stratcons from both datacenters.
  * If the `groups` attribute is absent and:
    * `_machlist` has one host - All brokers on one stratcon.
    * `_machlist` has multiple hosts - All brokers on each stratcon.
      Effectively, each stratcon is its own group and all groups are redundant.
  * If the `groups` attribute is present and:
    * A single group exists - Brokers will be divided among the hosts in the
      group. There is no redundancy; only one stratcon connects to a given
      broker.
      * Example:
        ```
        "groups": [
            [ "server1", "server2" ]
        ]
        ```
    * Multiple groups exist - Brokers will be divided among the hosts in each
      group and will be redundant across groups. A given broker will see
      connections from one stratcon in each group.
      * Example:
        ```
        "groups": [
            ["server1", "server2"],
            ["server3", "server4"]
        ]
        ```

irondb_tuning
: (optional) An object containing up to three keys controlling aspects of
  metric ingestion into IRONdb. The values displayed below are the defaults if
  not specified. Timeouts are expressed in milliseconds, and concurrency in
  number of application threads.
  ```
  "irondb_tuning": {
    "timeout": 8000,
    "connecttimeout": 1000,
    "put_concurrency": 50
  }
  ```
  * `timeout`: The overall HTTP transaction timeout for each PUT operation to
    an IRONdb node. Lower values can help stratcon move on more quickly from
    poorly-performing nodes, maintaining ingestion throughput and avoiding
    delays on broker feeds. Note that setting timeouts too low can also
    negatively impact ingestion, as stratcon will give up too quickly and not
    make progress. The `/var/log/circonus/stratcon_raw_ingestor.log` log file
    reports on ingestion activity.
  * `connecttimeout`: The TCP connection timeout for PUT operations to IRONdb
    nodes. If one or more IRONdb nodes are down or unreachable, lower connect
    timeouts will help stratcon move on to alternate nodes.
  * `put_concurrency`: The number of ingestion threads devoted to pushing data
    into IRONdb. This was previously a standalone attribute,
    `irondb_put_concurrency`, which has been deprecated. If `put_concurrency`
    is not specified, it defaults to 50. The actual number of active threads
    may drop lower than this value, depending on the volume of metrics coming
    from brokers, but it will not exceed the configured concurrency.  Raising
    the concurrency can help if the storage feeds from brokers show delay, and
    the stratcon host still has CPU and network resources to spare.  The live
    state of the ingestion job queue, including concurrency, can be viewed from
    Stratcon's mtev console:
    ```
    $ telnet localhost 32324
    Trying 0.0.0.0...
    Connected to 0.
    Escape character is '^]'.
    mtev: (no auth)
    stratcon# show eventer debug jobq raw_ingestor_put
    === raw_ingestor_put ===
     safety: gc
     concurrency: 50/50
     min/max: 1/500
     total jobs: 16994309
     backlog: 0
     inflight: 11
     timeouts: 0
     avg_wait_ms: 0.378265
     avg_run_ms: 17.449669
    ```
    If `backlog` is frequently non-zero, and/or there is broker delay,
    increasing the concurrency may help. It can be adjusted from the console
    until a suitable value is found, which can then be put into `site.json`.
    ```
    stratcon# mtev jobq raw_ingestor_put concurrency 100
    Setting 'raw_ingestor_put' jobq concurrency to 100
    stratcon#
    ```

##### `web-db` Attributes

master
: (optional, but required for multiple hosts) If you are setting up multiple
  hosts in the role, the value will be the name of the primary machine, as it
  appears in `_machlist`. When this attribute is present, all other hosts in
  the role will set themselves up as replicas of the primary.

connect_host
: (required) Host name that client components will use to connect to
  PostgreSQL. Typically this is the same short name as in `_machlist`, but it
  may also be set to an alternate name, for example if you wish to use a
  generic hostname that will always point to the primary host. This value will
  be encoded into database connection strings in various places.

read_connect_host
: (optional) Non-primary host name to which some read-only queries will be sent.
  This may be used to relieve excess load from search queries. Not all reads
  are sent to this host.

allowed_subnets
: (required) Array of subnets in dotted-quad CIDR notation, e.g. "10.1.2.0/24",
  from which database connections will be allowed. If operating multiple
  installations of Circonus (multi-datacenter), all subnets from both
  installations must be included.
  * **Note:** Formerly the `allowed_subnets` attribute was provided by the
    site-wide "`subnet`" attribute, which it replaces and extends.

admin_pass
: (required) This is the password for the `web-db` administrative user.

ca_pass
: (required) This is the password that the CA will use to interact with
  `web-db`.

web_pass
: (required) This is the password used by various other components to interact
  with `web-db`.

###### `web-db` Tuning
**WARNING:**
> The following four attributes are for advanced PostgreSQL users only.
> Changing these values could have a negative impact on Web DB performance.
> Changes within these attributes will require a database restart.  Please
> refer to "Web DB Restart" in the Operations Manual for instructions on
> performing a database restart, and to the [PostgreSQL Server Configuration
> documentation](https://www.postgresql.org/docs/9.2/static/runtime-config.html)
> for more detail on these parameters.

tuning
: (optional) Object containing general server configuration option names and
  values. Available options are:
  * `max_connections`
  * `shared buffers`
  * `work_mem`
  * `maintenance_work_mem`
  * `effective_cache_size`

wal
: (optional) Object containing write-ahead log configuration option names and
  values. Available options are:
  * `wal_level`
  * `checkpoint_segments`
  * `checkpoint_completion_target`
  * `archive_mode`
  * `archive_command`
  * `archive_timeout`

replication
: (optional) Object containing replication configuration option names and
  values. Available options are:
  * `max_wal_senders`
  * `wal_keep_segments`
  * `hot_standby`
  * `hot_standby_feedback`

logging
: (optional) Object containing logging configuration option names and values.
  Available options are:
  * `log_filename`
  * `log_min_messages`
  * `log_min_error_statement`
  * `log_min_duration_statement`
  * `log_duration`
  * `log_error_verbosity`
  * `log_statement`
  * `log_timezone`

##### `web-frontend` Attributes

session_key
: (optional) A key to help prevent tampering with a Circonus session cookie. If
  you are using native Circonus username/password authentication, you should
  set this attribute. A minimum of 8 characters is required. If not set, a
  default key will be generated. Setting this key for the first time or
  changing its value will require all logged-in users to log in again.

oauth2_key
: (optional) The OAuth2 key helps prevent tampering with an OAuth session
  cookie. If you are using OAuth/SSO for logging into your Circonus installation,
  it is recommended that you set this option. You can generate a key value via:
  `openssl rand -base64 12` to produce 12 bytes of base64-encoded random data.

url_host
: (optional) If specified, this value will be prepended to the value of the
  top-level attribute "domain" to create the desired URL hostname.  For example,
  if domain is "`circonus.example.com`" and `url_host` is "www", the web portal
  URL would be `https://www.circonus.example.com/`.

certificate_type
: (optional) The type of TLS certificate to use. Allowed values are
  `internal`, `commercial`, or `none`. If left unspecified, the default is
  `internal`. Use `commercial` if you plan to provide your own certificate for
  this service. See the [Addressing PKI Requirements](/circonus/on-premises/installation/installation/#addressing-pki-requirements)
  section below.
  * `internal` will register internally-signed certificates for the service
    where the attribute appears. This is the default if this attribute is not
    present.
  * `commercial` will assume that a user-provided cert/key pair will be
    provided, and it will not register an internal cert for the service
    where this attribute appears.
  * `none` will skip configuring any SSL pieces for the service where the
    attribute appears.

##### `web-stream` Attributes

stream_service_name
: (optional) If specified, this is the URL hostname for the `web-stream`
  service.  If not specified, the URL hostname will be `s.<domain>`. Setting the
  port here will result in an error. The default port of 9443 is not
  configurable.

certificate_type
: (optional) The type of TLS certificate to use. Allowed values are
  `internal`, `commercial`, or `none`. If left unspecified, the default is
  `internal`. Use `commercial` if you plan to provide your own certificate for
  this service. See the [Addressing PKI Requirements](/circonus/on-premises/installation/installation/#addressing-pki-requirements)
  section below.
  * `internal` will register internally-signed certificates for the service
    where the attribute appears. This is the default if this attribute is not
    present.
  * `commercial` will assume that a user-provided cert/key pair will be
    provided, and it will not register an internal cert for the service
    where this attribute appears.
  * `none` will skip configuring any SSL pieces for the service where the
    attribute appears.

#### `machinfo` Attributes

This is the list of machines referenced in each `_machlist`.  The main key is
the machine's short name, as listed in `_machlist`.

ip_address
: (required) The machine's IPv4 address.  This is used to build up an
  `/etc/hosts` file that enables all systems to communicate consistently via
  their short names without relying on DNS.

node_id
: (required for `data_storage` role, ignored by all other roles)  Value is a
  UUID and must never be altered after the system is initially configured.  The
  `node_id` is an essential part of the metric storage software's topology
  information.

zfs_dataset_base
: (required on any system using ZFS)  Value is the existing ZFS dataset under
  which child datasets will be created for various purposes. Usually it is set
  to the name of the zpool itself, but it may be set to the name of any ZFS
  dataset. On non-ZFS systems, these areas are created as ordinary directories.

#### `additional_hosts` Attributes

These are additional hosts for which entries should be created in the hosts
file.

ip_address
: (required) The host's IPv4 address.


#### Authentication Settings

By default Circonus will use its own internal authentication methods.  If other
means of authentication are to be configured, you will need to add an
authentication section to the site.json. Then you must define the various
properties for each other authentication method under this section.

The authentication section is a top level item.

Sample authentication section:

```
    "authentication": {
        "method": "mixed",
        "supported_methods": [ "LDAP", "Circonus" ],
        "ldap": {
            "connect": "server:389",
            "base_dn": "dc=example,dc=com",
            "bind_dn": "cn=proxyuser,dc=example,dc=com",
            "bind_pass": "proxypass",
            "group_filter": "(&(objectClass=groupOfNames)(member=cn={cn}))",
            "super_admin_group": "someGroupName",
            "session_expire_minutes": 1440,
            "login_attr": "cn",
            "overwrite_password": 1
        }
    }
```

The global authentication attributes are:

method
: (optional) Defines what auth method you will use. Possible values are:
  "circonus", "mixed", or the name specific method you desire (such as "ldap").
  Mixed mode allows for both LDAP and Circonus auth to be used interchangeably
  and is useful if you have accounts that do not or can not live on your LDAP
  server.

supported_methods
: (optional) A list of methods as they will appear on the login page for users
  to select, this is an array of strings, such as `[ "LDAP", "Circonus"]`

#### LDAP

Under the authentication section, if you are using LDAP you will be required to
provide the details about the connection under the ldap key.  The following
properties can be defined:

connect
: (required) The server and port we should connect to for LDAP auth. For
  example: `ldapserver.domain:389`

base_dn
: (required) The base DN that users fall under. For example:
  `dc=example,dc=com`

bind_dn
: (optional) If Circonus can not anonymously bind to LDAP, here you can provide
  the DN of the user with witch it can bind. For example:
  `cn=proxyuser,dc=example,dc=com`

bind_pass
: (optional, but required if `bind_dn` is specified) The password for the
  `bind_dn` user.

group_filter
: (optional)  It is preferable to not use this setting, which when not set
  defaults to looking at the user's `memberOf` attribute. The filter is needed
  to search the groups in the system for a specific user to see of which groups
  the user is a member.  In this filter you can define attributes of a user
  that will be replaced with the actual values, such as {cn} or {uid}, etc.
  For example: `(&(objectClass=groupOfNames)(member=cn={cn}))`

super_admin_group
: (required) The name of an existing LDAP group whose member users will be
  given super admin privileges in Circonus, allowing configuration of users,
  accounts, roles, etc. The effect of granting this access level via the method
  shown below is identical to the effect of running the `create_super_admin`
  script during initial setup.

session_expire_minutes
: (optional) The number of minutes after which users will be required to log
  back in.  Additionally, if a user's IP address changes, the user will be
  logged out. The default value is 1440 (1 day).

login_attr
: (optional) The attribute that users will use to log in, typically `uid` or
  `cn`.  The default value is `uid`.

overwrite_password
: (optional) If you are switching from Circonus auth and wish to enforce LDAP
  logins on your users, set this to `1` to blank out their Circonus passwords.
  This will disable their ability to bypass LDAP. Passwords are only blanked
  out after a successful LDAP login. The default value is `0`.

#### Header

Header-based authentication allows you to specify an HTTP Header that will be
passed to Circonus and that contains a username that is being used to log in.
This method then will either use LDAP (see previous section for configuration)
or a lookup URL to determine what groups this user is a member of to give them
the correct permissions in Circonus.

**Note:** 
>When header auth is in use, both the `method` and `supported_methods` entries
>in the main authentication section should be set to "header"; no other options
>are permitted.

header
: (optional)  The name of the header that contains the username.  The default
  value is `X-Remote-User`.

lookup_url
: (required if not using LDAP in conjunction with this method)  A URL that will
  output JSON when asked for details on the user.  The URI should contain a
  macro, `{username}`, which will be replaced with the value in the header.
  The resulting JSON should be in the form:
  ```
  {
    "firstname": "Circonus",
    "lastname": "User",
    "email": "circonus.user@example.com",
    "groups": [ "foo", "bar", "baz" ]
  }
  ```

lookup_interval_minutes
: (optional)  The interval which user data will be refreshed either from LDAP
  or the lookup_url.  The default is 10 minutes.

super_admin_group
: (required) The group name of the group whose member users will be given super
  admin privileges in Circonus, allowing configuration of users, accounts,
  roles, etc. The effect of granting this access level via the method shown
  below is identical to the effect of running the `create_super_admin` script
  during initial setup.

overwrite_password
: (optional) If you are switching from Circonus auth and wish to enforce LDAP
  logins on your users, set this to `1` to blank out their Circonus passwords.
  This will disable their ability to bypass LDAP. Passwords are only blanked
  out after a successful LDAP login. The default value is `0`.

### Self-Configuration

Copy your `site.json` file to `/opt/circonus/var/chef-solo/data_bags/service_map/site.json`

> The Chef data_bag loader will attempt to load any file that matches the glob
> pattern `site*.json` so if you have backup/alternate files, make sure to name
> them such that they will not match this pattern. Multiple matching files may
> cause incorrect operation.

```
; /opt/circonus/bin/run-hooper self-configure
```

The "`self-configure`" nodename invokes a configuration sanity check, then evaluates the site configuration to discover what roles the current node should have. It writes out a node configuration for the current node, which is used in all subsequent runs.

If the role assignments change, another self-configure run may be required in order to update the local node's configuration.

If you wish to only sanity-check your `site.json` without making any other changes, you may use the "config-check" node name instead.  Self-configuration will still be required before you can use the product.

### Initial Installation

```
; /opt/circonus/bin/run-hooper
```

Several runs may be needed across all the systems, as not all services will be
able to start on the first run.  `run-hooper` writes logs to
`/var/log/chef/circonus-hooper.log` and keeps logs of the last 50 runs.

**Note:**
> If you want more detail in the logs, the `-d` option to `run-hooper` will increase verbosity.
```
; /opt/circonus/bin/run-hooper -d
```
> To see what would happen without actually performing any changes, use the `-n` option (you can also combine this with `-d`):
```
; /opt/circonus/bin/run-hooper -n
```
> If you want to inhibit Hooper from making any changes whatsoever, create a killswitch file, which will cause `run-hooper` to exit immediately:
```
; touch /opt/circonus/var/chef-solo/killswitch
```

#### Installation Sequence

Circonus is a distributed system.  As such, most roles depend on services configured by other roles that may be on separate machines.  Operators must bring up nodes in the following order, and at least one machine in each role should be brought up at each stage.

 1. `web-db` (Master first, if multiple machines are in this role)
 1. CA
 1. MQ
 1. `web-frontend`
 1. Any remaining nodes, in no particular order

**Note:**
> This order also holds true for ongoing operations.

**Note:**
> If MQ and hub roles are colocated on the same host, some hub services may not be able to start on the first-ever run, resulting in a warning at the end of the run. To correct this, simply run Hooper again.

#### Hooper Run Status

At the end of each run, Hooper will summarize the run status, indicating whether another run may be required to complete the setup on the current node.  There are several severity levels:

 * **INFO** - These issues do not affect the operation of the product but should be addressed.

 * **NOTICE** - These issues require administrative intervention that falls outside of Hooper's control.  They should be addressed prior to running Hooper again.

 * **WARNING** - These are issues that occurred during this run that may be fixed by another run after bringing up other nodes.

 * **FATAL** - These are severe issues that occurred during this run that should be fixed before moving on to other nodes.

#### Hooper exit codes

The run-hooper script has some set exit codes for certain issues:
 * **90** - An updated Hooper package was installed.  Another invocation of `run-hooper` is recommended.
 * **91** - An attempt was made to install a Hooper package update, but it failed.
 * **92** - A killswitch file was found.
 * **93** - No nodename was supplied.
 * **94** - Operator attention is required.
 * **95** - An error occurred while trying to summarize run status.
 * **99** - Usage error

Any other exit code will be that of chef-solo.

## Further Tasks on Specific Components

### Addressing PKI Requirements

For the following services, the operator may choose to use a certificate signed by a global CA, rather than one signed by the Circonus Inside CA.  If a commercial certificate is desired for any of these services, set the "`certificate_type`" attribute to "`commercial`" on each role for which you plan to use a commercial certificate.

#### Web Portal (`web-frontend`)

This is the primary URL that users of Circonus Inside will visit in their browsers. Users must have the CA signing this certificate in their trusted list of Certificate Authorities.  It is made by prepending the "`url_host`" value (if any) to the top-level "`domain`" attribute. For example, if the domain is "`example.com`" and the `url_host` is "`circonus`", we will use the URL: `https://circonus.example.com/`

#### Web Streaming (`web-stream`)

The Web Streaming URL provides real-time streaming services embedded within the web portal.  This drives the "Play" option for graphs. We recommend that the URL for this simply be "s." prepended to the fully qualified domain name selected for the web portal. (e.g. `https://s.circonus.example.com/`)

#### API

*(Optional)*

You may optionally provide externally (publicly) signed certificates for the API services. (e.g. `https://api.circonus.example.com/`)  Because these APIs are programmatically used, it tends to be easier to introduce other trusted CAs.  Many clients are successful using an API certificate signed by a private CA, but setup will be simpler if you use a public authority.

#### Broker UI

*(Optional)*

The broker UI may also be protected by a public SSL certificate, but because this component is typically only accessed by operators of the service (for provisioning purposes), it rarely makes sense to do this. We recommend that the broker use the privately signed certificate for its UI and that the operators make the necessary exceptions.

### LDAP Role Configuration

To configure user roles and assign them to LDAP groups, log in as a user in the `super_admin_group` and navigate to the "/admin/role" screen.

On this screen, you can define new roles for Circonus by following the procedure below:
 1. Click on the create menu, add a role name, and choose the write permissions.
 1. Save your changes to the new role.
 1. Go back to the search page and search for the new role.
 1. Click on the role to edit it.
 1. You should see an "LDAP Integration" section at the bottom of the edit screen. Click "Add Mapping" to select an account name.
 1. Add an LDAP group to grant users of that group access to this role in the selected account.  You can choose one or more accounts, or even choose the same account with various different LDAP groups.
 1. Save your changes.

Users within the selected LDAP groups should now be able to log into Circonus and be granted permissions on the selected accounts.

### Load Balancers

A Load Balancer (LB) is not included as part of an Inside install, but you can add one. Common services to load balance are Web Frontend, API, and Web Stream.  Balancing can be done via round robin, resource checking, or any other method you would like to use.  All connections are stateless, so no session affinity or other special load-balancing configuration is required.

## Post Install Instructions

After your install is complete, you will need to perform each of the following procedures to begin using Circonus:

 1. Install your [IRONdb&reg; license](#install-irondb-license) on each `data_storage` node.
 1. Create a [super-admin](#super-admins).
 1. Add and configure a [broker](#adding-brokers).
 1. Setup system [Create your first selfchecks](#selfchecks).
 1. Create your first [account](#creating-accounts)

Procedures for each of these steps are described in the subsections below.

**Note:**
> Your Circonus Inside version should be updated regularly. Keep the Enterprise Brokers up-to-date and the CA updated and backed up regularly.

### Install IRONdb License

Your IRONdb&reg; license was generated for you during the sales process. 

Please contact Circonus Support (support@circonus.com) if you do not yet have a
copy of your license.

Once you have received your license, paste it between the
`<licenses></licenses>` tags in `/opt/circonus/etc/licenses.conf` on all nodes
in the `data_storage` role.  This file is created by Hooper if it does not
exist, but is left alone otherwise. The updated file should look something like
this:

```
<?xml version="1.0" encoding="utf8" standalone="yes"?>
<licenses>
  <license id="1" sig="(base64-encoded signature)">
    <requestor>Circonus</requestor>
    <snowth>1</snowth>
    <company>Your Company Name</company>
  </license>
</licenses>
```

Save the updated file and then restart the "snowth" service:
 * EL7: `sudo systemctl restart circonus-snowth`

Repeat this process on each system in the `data_storage` role.

### Super Admins

Super-admins have admin access to every account, as well as access to a special
admin section of the system, located at `https://circonus.example.com/admin` .  The
`/admin` section is used to create accounts and users. Only super-admins have
access to this part of the system.

The first user you create must be a super-admin.  To do this, log into any host
running the `web-frontend` role and run this script, replacing the
first/lastname and email values:

```
/www/bin/setup/create_super_admin.pl -f Firstname -l Lastname -e Email
```

You can now navigate to `https://circonus.example.com/login/` and log in as the super-admin.

### Adding Brokers

Add a broker to the internal "circonus" account to enable Selfchecks (next
step). Use the following procedure:

1. Navigate to the API Tokens section of the web portal, e.g.
   https://circonus.example.com/account/circonus/tokens
1. From the Menu at top right, choose *New User Token*. This will create a new
   API token, tied to your user account. Ensure that the token has Admin
   privilege and a Default App State of "Allow". You may wish to promote this
   token to an Account token, such that it is associated with the entire
   `circonus` account. If you do so, make sure to set the Default App State to
   "Allow" after promoting.
1. Install the broker package on the desired host and follow the
   [broker installation instructions](/circonus/administration/enterprise-brokers#installation).
   * Fill in `CIRCONUS_AUTH_TOKEN` with the API token created above.
   * Set the API URL to either `https://api.<your_domain>` or
     `https://<api_external_host>` if you set the `external_host` attribute on
     the API role. The broker needs to reach the API to configure itself.

If you later decide to make this broker "public" (grant access to all
accounts), you can visit the "/admin/broker" page, search for the broker in
question, click on it to edit, and change the account to "All Accounts". **The
broker that handles the Selfchecks should remain on the "circonus" account or
be public, but should not be moved to another individual account.**

### Selfchecks

Circonus Inside operations are monitored via two methods: internally and externally.

Services that are not in the alerting pathway are monitored internally by your Circonus Inside install.

Services that are in the alerting pathway need an external monitor to ensure that alerts will still be sent out in the event that the service goes down.  All Circonus Inside customers are given a limited Circonus Software as a Service (SaaS) account for this purpose.  If you cannot use a SaaS account, please let Support know and they will work with you on an alternate solution (support@circonus.com).

Selfchecks are created under the system's "circonus" account, which is created by default during the install.  To access this account, navigate to the "/account/circonus/dashboard" page as a super-admin.

As part of the standard Post-Installation procedures, we advise using the "circonus" account to create a contact group which will be notified on any internal systems issue.  For details on contact groups, refer to the [Contact Groups](/circonus/alerting/contact-groups/) subsection in the User Manual, located in the Alerting section.

To set up the selfchecks for a contact group, you will need the broker id and the contact group name.  Run the following script on any `web-frontend` node:

```
/www/bin/inside/create_selfchecks.pl -b <broker_id> -c <contact group name>
```

To find the `broker_id`, visit the "/admin/broker" page and search for the broker you want to use. The ID will be in the leftmost column in the search results.

### Creating Accounts

Make an account for normal Circonus use with the following procedure:

  1. Navigate to `https://example.com/admin/account/new`.
  1. Enter the following information:
   * Name - This is name of the account.
   * URL - This will be filled in based on the name. This is how you will access the account; e.g. using `https://example.com/account/<url>/profile` where "`<url>`" is this URL.
   * Timezone - The timezone used for displaying dates and times in the UI. Typically this is set to the local timezone where the majority of account users are located.
   * Description - This is optional, but can be useful for identification or instructions.
   * Metric limit -  This is provided to let you limit metrics internally. If you don't want to worry about limits, just enter a large number for now.
  1. Click "Create Account".

## Multiple Datacenters

### General Concept

Circonus operates in what can be described as an active-passive setup, where
the backup datacenter is a warm standby should the primary datacenter be
unreachable.

In this setup, all services, except for brokers, are replicated between the two
datacenters.  Circonus aggregation (stratcon) services actively connect to all
brokers in the infrastructure and collect the same data in both datacenters.

When a datacenter fails, database services need to be cut over to the chosen
backup, and alerting services turned on, all other services can remain running.
See the [Datacenter Failover](/circonus/on-premises/datacenter-failover)
section in the operations manual for more information on this process.

### Configuring A Backup Datacenter

Configuring a backup datacenter requires some small updates to the primary
datacenter to allow for multi-datacenter support.  The primary and backup
datacenters will have slightly different site.json files.  To setup this
initial support:

1. The primary datacenter must have the top-level attribute `active_datacenter`
   set to `true` (JSON boolean). The backup datacenter must have this set to
   `false`.  If the attribute is absent, Hooper assumes there is a single
   datacenter and treats the current environment as if it were the only one.
   ```
   "id": "site",
   "domain": "example.com",
   "ops_email": [ "ops@example.com" ],
   "noreply_email": "noreply@example.com",
   "active_datacenter": true,
   "svclist": {
   ...
   ```
1. The site.json for each datacenter will contain a listing of all the nodes
   in both datacenters, in the `machinfo` section. However, the "`_machlist`"
   attribute for each service role must contain only the local nodes for that
   datacenter. There are several exceptions to this rule:
   * The `caql_broker` role must list all nodes from both datacenters. They
     will operate as one cluster. The `registration_token` must be the same on
     both sides.
   * The `web_db` role must have all web_db nodes from both datacenters, and
     its attributes must be set in the following manner:
     * `master` must be set to the primary DB host in the active datacenter, in
       both the active and backup `site.json` files. This is so that the backup
       datacenter hosts know where they can connect if they need to update
       database information.
     * `connect_host` must be set to the intended primary host for each
       datacenter. This is what is used to build DSN connect strings for
       clients, so it must point to a host local to that datacenter. It is also
       used as the source of replication for any additional DB hosts in that
       datacenter.
     * `allowed_subnets` must contain all relevant IP networks for both
       datacenters.
1. The `ca` role must have the `primary` attribute set, with the value as the
   hostname of the primary CA host in the active datacenter. After the active
   datacenter is set up, an operator will need to sync the contents of the
   `/opt/circonus/CA/` directory on the primary CA to any and all backup CA
   hosts, and periodically refresh this backup (daily is recommended).
1. The cluster IDs for `fault_detection` must be different from those in the
   primary datacenter.
1. The `data_storage` role must have the `secondary_cluster` attribute set,
   listing the hosts that are assigned to this role in the backup datacenter.
   This list must be the same on both sides (in other words, it is _not_
   simply a list of the nodes in the other datacenter.) It is used to create a
   special database view for queries that look for the list of IRONdb hosts.
1. The `data_storage` node IDs for the backup datacenter should be different
   than those of the cluster in the primary datacenter. This avoids confusion
   for both applications and operators.
1. The `stratcon` role's `groups` attribute must be specified, to describe how
   the nodes are grouped by datacenter. The `node_ids` attribute must list all
   nodes from both datacenters as well. See the list of [stratcon attributes](#stratcon-attributes)
   for details. For example, if you had two nodes for the role in each
   location, the stratcon attributes for the primary datacenter would look like
   this:
   ```
   "_machlist": [ "DC1server1", "DC1server2" ],
   "groups": [
     ["DC1server1", "DC1server2"],
     ["DC2server1", "DC2server2"]
   ],
     "node_ids": {
       "DC1server1": "<uuid>",
       "DC1server2": "<uuid>",
       "DC2server1": "<uuid>",
       "DC2server2": "<uuid>"
   }
   ```
   The backup datacenter would differ only in the local stratcon nodes in
   `_machlist`, but its `groups` and `node_ids` would be identical to the
   primary. This ensures that metric data will flow to both datacenters. Each
   group of stratcons will connect to all brokers, duplicating the metric data
   at the source.

All nodes in the infrastructure across datacenters need to have network access
to the primary DB. For the other DBs, this is to receive replicated data; for
other roles, various jobs need to run to look up information and record when
they are complete.

Other than the items above, you can install the services in all other
datacenters in the same manner as the primary datacenter (refer to the
installation instructions in this manual). Once this is complete on all nodes,
you should have a functioning backup that is replicating from the primary and
pulling metric information.

**NOTE:**
> If the backup datacenter is built some time after the primary has been
> operational, metric data in the backup will start from when the backup was
> brought online.  If you require older metric data to be present, please
> contact Circonus Support (support@circonus.com) for assistance.

There are several manual tasks that must be performed after a failover. Refer
to the [Datacenter Failover](/circonus/on-premises/datacenter-failover) section
in the the operations manual for this information.

### Checking Datacenter Status

To check if a datacenter is active or in standby mode, visit `https://web-frontend_host/status`. This page will output either "ACTIVE" or "STANDBY".
