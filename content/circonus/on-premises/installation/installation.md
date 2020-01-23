---
title: Installation
weight: 30
---

## CentOS

Perform each of the following procedures to install Circonus on CentOS 6 or 7:

 1. Install the [machine](/InstallCentos.md#InstalltheMachine).
 1. Configure the Circonus Inside [yum repository](/InstallCentos.md#ConfiguretheCirconusInsideyumRepository).
 1. Install [Hooper](/InstallCentos.md#InstallHooper).

Procedures for each of these steps are described in the subsections below.

Once these procedures are complete, proceed to the [General Installation](/InstallGeneral.md) section and follow the steps there.


### Install the Machine {#InstalltheMachine}
First, perform a Basic Server install of CentOS x86\_64. Refer to instructions for CentOS.

**Warning:**
>The installation of Circonus Inside on CentOS requires many packages from the upstream CentOS distribution, so running a "minimal set" or a custom mirror of CentOS with some packages culled may cause serious issues that will prevent the successful installation or operation of the product.

#### Install ZFS

The ZFS filesystem is **required** for nodes in the `data_storage` role (which
is also limited to EL7), and optional for all other roles.  It is not included
in the RHEL or CentOS distributions, so additional configuration is required.
See the [installation instructions](https://github.com/zfsonlinux/zfs/wiki/RHEL-and-CentOS)
provided by the ZFS On Linux project.

Additionally, the
[IRONdb manual](https://login.circonus.com/resources/docs/irondb/zfs-guide.html) has
an appendix giving a brief tutorial on ZFS setup. Note, however, that the final
step of the appendix, which refers to IRONdb setup, is not required for
Circonus Inside. Do not install any IRONdb packages.

### Configure the Circonus Inside yum Repository {#ConfiguretheCirconusInsideyumRepository}
Place the following contents in `/etc/yum.repos.d/Circonus.repo` to configure the Circonus Inside yum repository:

#### EL7 Repo
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
currently running. See the [Changelog
page](https://login.circonus.com/resources/docs/operation/Changelog.html) of
the Operations Manual for how to determine what release you are running.

**Downgrades are not supported.**

#### EL6 Repo
```
[circonus]
name=circonus
enabled=1
baseurl=http://updates.circonus.net/centos/6/x86_64/
gpgcheck=0
metadata_expire=30m
```

### Install Hooper {#InstallHooper}
Run the following command to install Hooper:
```
yum -y install circonus-field-hooper
```

Once this is complete, proceed to the next section.

### Creating a `site.json` {#Creatingasite.json}
See below for explanations of each attribute.

Unless otherwise noted below, all passwords must be alphanumeric only (no special characters) due to the multitude of ways they are templated into configuration files.

Where UUIDs are required, you may generate them using the `uuidgen` command-line tool found on MacOS X and Linux systems, or by using a web-based tool such as https://www.uuidgenerator.net

Note that `uuidgen(1)` on MacOS X generates capitalized UUIDs, while Circonus prefers lowercase.  You can make the UUID lowercase using the following command:
```
uuidgen | tr '[:upper:]' '[:lower:]'
```

**`site.json`**
```
{
   "id": "site",
   "domain": "circonus.example.com",
   "ops_email": [ "ops@example.com" ],
   "noreply_email": "noreply@example.com",
   "saas_check_uuid": "e2d1af13-68c9-c773-8a38-93cc7b590663",
   "saas_check_secret": "s00per-s3cr3t",
   "ga_client_id": "939737797736-omh6225fhvucqpqi6nl4qn0v3vm567av.apps.googleusercontent.com",
   "ga_client_secret": "COC0lQ1ajhTtiCGH7Z2Elqre",
   "min_check_period": "30",
   "circonus_version": "0.2.1431963008",
   "additional_web_config": [],
   "fault_reporting": {
       "crash_reporting": "on"
   },
   "svclist": {
       "api": {
           "_machlist": [ "server1" ],
           "certificate_type": "commercial"
       },
       "ca": {
           "_machlist": [ "server2", "server3" ],
            "master": "server2",
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
           "_machlist": [ "server1" ],
       },
       "data_storage": {
           "_machlist": [ "server3", "server4" ],
            "one_minute_rollup_since": "0",
            "ncopies": "2",
            "side_a": [ "server3" ],
            "side_b": [ "server4" ],
            "statsd_target": "10.1.2.84",
       },
       "fault_detection": {
           "_machlist": [ "server2" ],
           "registration_token": "ee4ff400-31ee-454c-92d7-ee6c49c9cab5",
           "faultd_cluster": {
               "server2": { "node_id": "a4af7d66-4b71-4799-a084-a46589022d92" }
           },
           "heartbeat": {
                "default": {
                    "address": "225.0.1.9",
                    "port": "8082",
                    "period": "500",
                    "skew": "5000",
                    "age": "200"
                },
                "server2": {
                    "address": "225.0.1.10",
                    "port": "8880"
                }
            }
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
           "xmpp_host": "example.com",
           "xmpp_port": "5222",
           "xmpp_domain": "example.com",
           "xmpp_componentname": "example.com",
           "xmpp_user": "circonusops",
           "xmpp_pass": "badpassword",
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
           "uuid": "593d5260-1c37-4152-b9f7-39de9d954306",
           "mq_type": ["rabbitmq", "fq"],
           "fq_backlog": 10000,
           "feeds": 2,
       },
       "web_db": {
           "_machlist": [ "server2", "server4" ],
            "master": "server2",
            "connect_host": "server2",
            "read_connect_host": "server4",
            "allowed_subnets": [ "10.1.2.0/24" ],
            "admin_pass": "badpassword",
            "ca_pass": "badpassword",
            "web_pass": "badpassword",
            "tuning": {
                "max_connections": 350,
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
                "archive_command": ":",
                "archive_timeout": 0
            },
            "replication": {
                "max_wal_senders": 7,
                "wal_keep_segments": 100,
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
       "web_frontend": {
           "_machlist": [ "server2" ],
           "url_host": "www",
           "session_key": "M,bW6[35e,dn!?EB",
           "oauth2_key": "3pASEejq+LRcRO5u",
           "certificate_type": "commercial"
       },
       "web_stream": {
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


#### Top-Level Attributes {#Top-LevelAttributes}
 * **`id`** - Required, and must be set to "site".  This attribute is used by chef-solo as part of `data_bag` processing.

 * **`domain`** - Required. Used in several places to construct URL hostnames for the components that are used by customers, such as the API and web UI portal. Must be a fully-qualified domain name (FQDN).

 * **`ops_email`** - Required. Used as a recipient address for various Cronjobs and system-level administrative notices.

 * **`noreply_email`** - Required. Used as the sender address on outgoing emails from the notification component.

 * **`saas_check_uuid`** - Optional, but required if saas_check_secret is set. If desired, an external check in the Circonus SaaS system may be configured which will monitor the components of Circonus Inside that cannot monitor themselves (such as the notification system).  The check is an HTTP trap check sent from within the Circonus Inside installation, so no incoming connections are required.  Your Circonus Support engineer (support@circonus.com) will provide the UUID if you choose to set this up.

 * **`saas_check_secret`** - Optional, but required if `saas_check_uuid` is set.  This is the authentication token that is used with the HTTP trap check.  Your Circonus Support engineer (support@circonus.com) will provide this value.

 * **`min_check_period`** - Optional.  Minimum allowable check frequency, in seconds.  The value must be greater than or equal to 1 and less than or equal to 60 (1 __<__ x __<__ 60). Users may configure a check's frequency in the UI, but may not set it lower than this value.  If not specified, the value defaults to 30.

 * **`circonus_version`** - (OmniOS only) Optional. This is the desired version of the `field/circonus-incorporation` package to install. The specified version must be greater than or equal to the currently-installed version (because downgrading is not supported). If not specified, the latest available version will be installed. Operators may choose to pin the version at a value representing the last successful test deployment, for example. This setting is ignored on Linux hosts.

 * **`additional_web_config`** - Optional. An array of `circonus.conf` config lines to be appended to the circonus.conf file. Generally, this should only be set at the request of Circonus Support.

 * **`fault_reporting`** - Optional. This is a hash of fault-reporting options. Currently only one attribute is defined: `crash_reporting`, with values of "on" or "off". If the value is not set to "off", then it enables application crash tracing and aggregation using [Backtrace.io](http://backtrace.io/) technology. Supported components will have any crashes automatically categorized and uploaded to Circonus for analysis. This helps us better understand software faults and correlate issues across multiple deployments. The value defaults to "on" if not specified. 
  * **Note:** *Use of this facility requires that your Circonus systems be able to connect outbound to !https://circonus.sp.backtrace.io:6098 in order to upload trace data. If this is not possible in your environment, you may wish to set this feature to "off".*

 * **`ga_client_id`** - Optional. This is the Client ID for Google Analytics.

 * **`ga_client_secret`** - Optional. This is the Client secret for Google Analytics.

 * **`svclist`** - Required.  This is the list of Circonus Inside component roles.

 * **`machinfo`** - Required.  This is the list of machines to which the Circonus Inside roles will be assigned.

 * **`additional_hosts`** - Optional. This is a list of additional hosts for adding entries to `/etc/hosts`.


#### `svclist` Attributes {#svclistAttributes}
 * **`_machlist`** - Required for every member of svclist. Must be an array listing at least one host to which the given role is to be assigned.


#### `api` Attributes {#apiAttributes}
 * **`certificate_type`** - Optional. Can be set to "`commercial`", "`internal`", or "`none`". If left unspecified, the default is "`internal`". Set to "`commercial`" if you plan to provide your own certificate for this service. See the [Addressing PKI Requirements](/InstallGeneral.md#AddressingPKIRequirements) section below.
  * **`commercial`** - This will cause Hooper to assume a user-provided cert/key pair will be provided, and it will not register an internal cert for the service where this attribute appears.
  * **`internal`** - This will cause Hooper to register internally-signed certificates for the service where the attribute appears. This is the default if this attribute is not present.
  * **`none`** - This will skip configuring any SSL pieces for the service where the attribute appears.

 * **`use_commercial_cert`** - This is a deprecated attribute that has been replaced with "`certificate_type`" (see above). If this attribute is present, it will configure SSL as indicated (it can be set to "yes" or "no"), and display a warning about the deprecation. If the `certificate_type` attribute is present, then the `use_commercial_cert` attribute will be ignored, although the warning will still be displayed. For clarity, the logic for the presence or absence of the old and new attributes is as follows:
  * Only `use_commercial_cert` present - configure SSL as indicated and warn user.
  * Only `certificate_type` present - configure SSL as indicated, no warning.
  * Both present - use value from `certificate_type`, ignore `use_commercial_cert`, and display warning.
  * Neither present - default behavior (as if `certificate_type` were set to "internal").


#### `ca` Attributes {#caAttributes}
 * **`key_pass`** - Required. CA private key passphrase. May contain special characters.

 * **`org_defaults`** - Required. The enclosed attributes correspond to those used in Certificate Signing Requests (CSRs).
    * `country`: Two-letter country code
    * `state_prov`: Full name of state or province
    * `locality`: Full name of locality (city)
    * `org_name`: Name of organization (company)
    * `ou`: Organizational Unit name (e.g., "IT Services")
    * `common_name`: Defaults to "Circonus Inside Certificate Authority", may be altered if desired.
    * `email`: Email address of technical contact for the CA

 * **`master`** - Optional. If multiple hosts are in the CA role, this
   attribute specifies which is to be the master. Non-master CA hosts will get
   the standard directory structure created but will not generate CA keys nor run
   the `ca_processor` service. It is recommended that operators set up a regular
   sync of the files in `/opt/circonus/CA` to all non-master CA hosts.


#### `caql_broker` Attributes {#caql_brokerAttributes}
 * **`registration_token`** - Required. A UUID that will be used as an API
   token. This token will be pre-authorized.


#### `data_storage` Attributes {#data_storageAttributes}
 * **`one_minute_rollup_since`** - Optional. Informs the `web_frontend` components of when one-minute data collection began. If absent, empty, or set to "-1", no one-minute data will be displayed. A value of "0" indicates that one-minute data collection has always been enabled. Otherwise the value should be set to the UNIX timestamp of when one-minute data collection began. Any graph view spanning this event will default to showing five-minute granularity.

 * **`ncopies`** - Optional. Specify the number of copies of each metric data point that should be stored across the `data_storage` cluster.  If not specified, it will be calculated based on the number of nodes assigned to the `data_storage` role.

 * **`statsd_target`** - Optional. Set to the IP address of an Enterprise Broker to have the `data_storage` nodes emit internal metrics for trending. The Enterprise Broker must be reachable from this `data_storage` cluster.

 * **`additional_clusters`** - Optional. An array of arrays representing additional data_storage clusters in one's deployment. It is used in the case of importing non-Circonus data, to ensure it is imported to all active clusters.

 * **`side_{a,b}`** - Optional. Each side is an array of hostnames as listed in `_machlist`. If not specified, the default is that the cluster is not split. A split cluster is one where nodes are assigned to one side or another. The data_storage application will ensure that at least one copy of each stored metric exists on each side of the cluster. This allows for cluster distribution across typical failure domains such as network switches, rack cabinets or physical locations. Split-cluster configuration is subject to the following restrictions:
   * An active, non-split cluster cannot be converted into a split cluster as this would change the layout of data that has already been stored, which is not permitted.
   * Both sides must be specified, and non-empty (in other words, it is an error to configure a split cluster with all hosts on one side only.)
   * All hosts in `_machlist` must be accounted for. It is an error to mix hosts that are configured for a specific side with hosts that are not assigned to a side.


#### `fault_detection` Attributes {#fault_detectionAttributes}
 * **`registration_token`** - Required as of the 2019-05-06 release. A UUID
   that will be used as a pre-authorized API token for the fault detection
   daemon to access ruleset and maintenance period information.
 * **`faultd_cluster`** - Required as of the 2019-05-06 release. An object
   describing each fault detection node in the cluster. Object keys are the
   host names from the `_machlist` array, and values are objects with a single
   key, `node_id` whose value is a UUID string.
 * **`heartbeat`** - Optional. A list of attributes that affect the composite
   broker clustering configuration. Attributes listed under a key called
   "default" are applied to all composite broker nodes. You may also specify
   per-host overrides by adding a key matching the hostname of a
   composite broker node. The heartbeat attributes are listed below. All are
   optional, and if not specified, the stated default will be used.
   * **`address`** - Multicast address on which heartbeat messages will be sent and received. Default: 225.0.1.9
   * **`port`** - TCP port on which heartbeat messages will be sent and received. Default: 8082
   * **`period`** - Interval between heartbeat messages, in milliseconds. Default: 500
   * **`skew`** - Factor, in milliseconds, used to avoid a rapid change of leadership when multiple nodes restart. Default: 5000
   * **`age`** - Time, in milliseconds, beyond which a cluster entry will be considered stale. Default: 200

#### `hub` Attributes {#hubAttributes}
No additional attributes.


#### `long_tail_storage` Attributes {#long_tail_storageAttributes}
No additional attributes.

This service is optional. If not configured, raw metric data will simply be discarded after it has been committed to Data Storage.


#### `mq` Attributes {#mqAttributes}
 * **`cookie`** - Required. Allows multiple MQ hosts to communicate with each other.  Must be an alphanumeric string, but length is arbitrary.

 * **`password`** - Required. Used by components that need to connect to the message queue.


#### `notification` Attributes {#notificationAttributes}
The following attributes cover the various protocols over which notifications may be delivered.  Email notifications are always enabled and require no additional configuration here. XMPP and SMS are optional, but if used, all attributes for that protocol or provider are required.
 
 * **`xmpp_host`** - Hostname of the XMPP server

 * **`xmpp_port`** - Port number of XMPP server

 * **`xmpp_domain`** - FQDN of the XMPP server

 * **`xmpp_componentname`** - Name of external XMPP component host. Typically there are no external components, so this should be set to `xmpp_domain` (see previous).

 * **`xmpp_user`** - Username that Circonus Inside will use to connect to the XMPP server

 * **`xmpp_pass`** - Password for connecting to the XMPP server

BulkSMS, SMS Matrix, and Twilio are the SMS service providers that Circonus Inside supports.

 * **`bulksms_user`** - BulkSMS username

 * **`bulksms_pass`** - BulkSMS password

 * **`smsmatrix_user`** - SMS Matrix username

 * **`smsmatrix_pass`** - SMS Matrix password

 * **`twilio_url`** - Twilio API URL

 * **`twilio_sid`** - Twilio application identifier

 * **`twilio_authtoken`** - Twilio authentication token

 * **`twilio_phone`** - Twilio application phone number


#### `stratcon` Attributes {#stratconAttributes}
 * **`uuid`** - Required. Uniquely identifies the Stratcon system.
 * **`mq_type`** - Optional. Determines the message queue type to use. Must be an array of valid types. Types are "rabbitmq" and "fq".  If not specified, the default is rabbitmq.
 * **`fq_backlog`** - Optional. Sets the FQ client backlog parameter. This is the number of outstanding messages that are allowed before FQ's block/drop policy is applied. If not specified, the FQ default value (10000) will be used.
 * **`fq_round_robin`** - Optional.  If "true" (string), instead of sending a message to every FQ, stratcon will round robin the message across the configured FQ. Do not set this value unless instructed to do so by Circonus Support.
 * **`feeds`** - Optional. Defines the number of MQ hosts to which each stratcon host should connect. This is used when scaling out the stratcon role. The MQ host list will be sliced into groups of "feeds" length and those groups distributed among the stratcon hosts. There must be at least X MQ hosts configured, where X is the number of stratcon hosts times the number of feeds, otherwise it is an error. If more than this number of MQs are configured, some will be unused and Hooper will issue a notice to this effect at the end of each run. If this attribute is not specified, all stratcons will connect to all MQs.
 * **`groups`** - Optional. If set, must be set to an array of arrays denoting which `_machlist` entries to group together.  Brokers are balanced across members of any array, and creating multiple arrays provides redundancy. There are different scenarios possible with multiple stratcons, depending on how the operator wants to divide the brokers and whether redundancy is desired. **Note:** To set up stratcons in multiple DC setups, the group attribute is required to specify all the stratcons in each site.json.
  * `groups` attribute absent
   * single host in `_machlist` - All brokers on one stratcon.
   * multiple hosts in `_machlist` - All brokers on each stratcon. Effectively, each stratcon is its own group and all groups are redundant.
  * `groups` attribute present
   * single group - Brokers will be divided among the hosts in the group. There is no redundancy.
    * Example:
```
"groups": [
    [ "server1", "server2" ]
]
```
   * multiple groups - Brokers will be divided among the hosts in each group and will be redundant across groups.
    * Example:
```
"groups": [
    ["server1", "server2"],
    ["server3", "server4"]
]
```

#### `web_db` Attributes {#web_dbAttributes}
 * **`master`** - Optional. If you are setting up replication, the value will be the name of the master machine as it appears in `_machlist`.

 * **`connect_host`** - Required. Host name that client components will use to connect to PostgreSQL. Typically this is the same short name as in `_machlist`.

 * **`read_connect_host`** - Optional. Non-master host name to which some read-only queries will be sent. This may be used to relieve excess load from search queries. Not all reads are sent to this host.

 * **`allowed_subnets`** - Required. Array of subnets in dotted-quad CIDR notation, e.g. "10.1.2.0/24", from which database connections will be allowed.

**Note:**
> Formerly the `allowed_subnets` attribute was provided by the site-wide "`subnet`" attribute, which it replaces and extends.

 * **`admin_pass`** - Required. This is the password for the `web_db` administrative user.

 * **`ca_pass`** - Required. This is the password that the CA will use to interact with `web_db`.

 * **`web_pass`** - Required. This is the password used by various other components to interact with `web_db`.

**WARNING:**
> The following four attributes are for advanced PostgreSQL users only.  Changing these values could have a negative impact on Web DB performance.  Changes within these attributes will require a database restart.  Please refer to "Web DB Restart" in the Operations Manual for instructions on performing a database restart, and to the [PostgreSQL Server Configuration documentation](https://www.postgresql.org/docs/9.2/static/runtime-config.html) for more detail on these parameters.

 * **`tuning`** - Optional (see the above Warning). This overrides default tuning settings. Hash of setting names and values. Includes max connections, shared buffers, work memory, maintenance work memory, and effective cache size.

 * **`wal`** - Optional (see the above Warning). This overrides default WAL settings. Hash of setting names and values. Includes WAL level, checkpoint segments, checkpoint completion target, archive mode, archive command, and archive timeout.

 * **`replication`** - Optional (see the above Warning). This overrides default replication settings. Hash of setting names and values. Includes max WAL senders, WAL keep segments, hot standby, and hot standby feedback.

 * **`logging`** - Optional (see the above Warning). This overrides default logging settings. Hash of setting names and values. Includes log file name, min messages, min error statement, min duration statement, duration, error verbosity, statement, and timezone.


#### `web_frontend` Attributes {#web_frontendAttributes}
 * **`session_key`** - Optional. A key to help prevent tampering with a
   Circonus session cookie. If you are using native Circonus username/password
   authentication, you should set this attribute. A minimum of 8 characters is
   required. If not set, a default key will be generated. Setting this key for
   the first time or changing its value will require all logged-in users to log
   in again.
 * **`oauth2_key`** - Optional. The OAuth2 key helps prevent tampering with an OAuth session cookie. If you are using OAuth/SSO for logging into your Circonus installation, it is recommended that you set this option. You can generate a key value via: `openssl rand -base64 12` to produce 12 bytes of base64-encoded random data.
 * **`url_host`** - Optional. If specified, its value will be prepended to the value of the top-level attribute "domain" to create the desired URL hostname.  For example, if domain is "`circonus.example.com`" and `url_host` is "www", the web portal URL would be `https://www.circonus.example.com/`.
 * **`certificate_type`** - Optional. Can be set to "`commercial`", "`internal`", or "`none`". If left unspecified, the default is "`internal`". Set to "`commercial`" if you plan to provide your own certificate for this service. See the [Addressing PKI Requirements](/InstallGeneral.md#AddressingPKIRequirements) section below.
  * **`commercial`** - This will cause Hooper to assume a user-provided cert/key pair will be provided, and it will not register an internal cert for the service where this attribute appears.
  * **`internal`** - This will cause Hooper to register internally-signed certificates for the service where the attribute appears. This is the default if this attribute is not present.
  * **`none`** - This will skip configuring any SSL pieces for the service where the attribute appears.

 * **`use_commercial_cert`** - This is a deprecated attribute that has been replaced with "`certificate_type`" (see above). If this attribute is present, it will configure SSL as indicated (it can be set to "yes" or "no"), and display a warning about the deprecation. If the `certificate_type` attribute is present, then the `use_commercial_cert` attribute will be ignored, although the warning will still be displayed. For clarity, the logic for the presence or absence of the old and new attributes is as follows:
  * Only `use_commercial_cert` present - configure SSL as indicated and warn user.
  * Only `certificate_type` present - configure SSL as indicated, no warning.
  * Both present - use value from `certificate_type`, ignore `use_commercial_cert`, and display warning.
  * Neither present - default behavior (as if `certificate_type` were set to "internal").


#### `web_stream` Attributes {#web_streamAttributes}
 * **`stream_service_name`** - Optional. If specified, this is the URL hostname for the `web_stream` service.  If not specified, the URL hostname will be `s.<domain>`. Setting the port here will result in an error. The default port of 9443 is not configurable.
 * **`certificate_type`** - Optional. Can be set to "`commercial`", "`internal`", or "`none`". If left unspecified, the default is "`internal`". Set to "`commercial`" if you plan to provide your own certificate for this service. See the [Addressing PKI Requirements](/InstallGeneral.md#AddressingPKIRequirements) section below.
  * **`commercial`** - This will cause Hooper to assume a user-provided cert/key pair will be provided, and it will not register an internal cert for the service where this attribute appears.
  * **`internal`** - This will cause Hooper to register internally-signed certificates for the service where the attribute appears. This is the default if this attribute is not present.
  * **`none`** - This will skip configuring any SSL pieces for the service where the attribute appears.

 * **`use_commercial_cert`** - This is a deprecated attribute that has been replaced with "`certificate_type`" (see above). If this attribute is present, it will configure SSL as indicated (it can be set to "yes" or "no"), and display a warning about the deprecation. If the `certificate_type` attribute is present, then the `use_commercial_cert` attribute will be ignored, although the warning will still be displayed. For clarity, the logic for the presence or absence of the old and new attributes is as follows:
  * Only `use_commercial_cert` present - configure SSL as indicated and warn user.
  * Only `certificate_type` present - configure SSL as indicated, no warning.
  * Both present - use value from `certificate_type`, ignore `use_commercial_cert`, and display warning.
  * Neither present - default behavior (as if `certificate_type` were set to "internal").

 * **`mq_type`** - Optional. Acceptable values are "fq" or "rabbitmq".  This chooses which MQ variety the stream service will use to pull metric data. Prior to the addition of this attribute, RabbitMQ was always used, but now the default is to use FQ if this attribute is not specified. Operators who wish to continue using RabbitMQ should be aware that it can become a performance bottleneck, and that Circonus Support may ask to have this changed to FQ if this is determined to be the case.


#### `machinfo` Attributes {#machinfoAttributes}
This is the list of machines referenced in each `_machlist`.  The main key is the machine's short name, as listed in `_machlist`.

 * **`ip_address`** - Required. The machine's IP address.  This is used to build up an `/etc/hosts` file that enables all systems to communicate consistently via their short names without relying on DNS.

 * **`node_id`** - Required for `data_storage` role, ignored by all other roles.  Value is a UUID and must never be altered after the system is initially configured.  The `node_id` is an essential part of the metric storage software's topology information.

 * **`zfs_dataset_base`** - Required on any system using ZFS.  Value is the
   existing ZFS dataset under which child datasets will be created for various
   purposes.  On non-ZFS systems, these areas are created as ordinary directories.


#### `additional_hosts` Attributes {#additional_hostsAttributes}
These are additional hosts for which entries should be created in the hosts file.

 * **`ip_address`** - Required. The host's IP address.


#### `Authentication` Settings {#AuthenticationSettings}

By default Circonus will use its own internal authentication methods.  If other means of authentication are to be configured, you will need to add an authentication section to the site.json. Then you must define the various properties for each other authentication method under this section.

The authentication section is a top level item.

**Sample authentication section:**

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

 * **`method`** - Defines what auth method you will use. Possible values are: "circonus", "mixed", or the name specific method you desire (such as "ldap").  Mixed mode allows for both LDAP and Circonus auth to be used interchangeably and is useful if you have accounts that do not or can not live on your LDAP server.

 * **`supported_methods`** - A list of methods as they will appear on the login page for users to select, this is an array of strings, such as `[ "LDAP", "Circonus"]`


#### `LDAP` {#LDAP}

Under the authentication section, if you are using LDAP you will be required to provide the details about the connection under the ldap key.  The following properties can be defined:

 * **`connect`** - Required. The server and port we should connect to for LDAP auth. For example: `ldapserver.domain:389`

 * **`base_dn`** - Required. The base DN that users fall under. For example: `dc=example,dc=com`

 * **`bind_dn`** - Optional. If Circonus can not anonymously bind to LDAP, here you can provide the DN of the user with witch it can bind. For example: `cn=proxyuser,dc=example,dc=com`

 * **`bind_pass`** - Optional, but required if `bind_dn` is specified. The password for the `bind_dn` user.

 * **`group_filter`** - Optional.  It is preferred that you do not use this setting, which when not set defaults to looking at the user's memberOf attribute. The filter needed to search the groups in the system for a specific user to see of which groups the user is a member.  In this filter you can define attributes of a user that will be replaced with the actual values, such as {cn} or {uid}, etc.  For example: `(&(objectClass=groupOfNames)(member=cn={cn}))`

 * **`super_admin_group`** - Required. The name of an existing LDAP group whose member users will be given super admin privileges in Circonus, allowing configuration of users, accounts, roles, etc. The effect of granting this access level via the method shown below is identical to the effect of running the `create_super_admin` script during initial setup.

 * **`session_expire_minutes`** - Optional. The number of minutes after which users will be required to log back in.  Additionally, if a user's IP address changes, the user will be logged out. The default value is 1440 (1 day).

 * **`login_attr`** - Optional. The attribute that users will use to log in, typically `uid` or `cn`.  The default value is `uid`.

 * **`overwrite_password`** - Optional. If you are switching from Circonus auth and wish to enforce LDAP logins on your users, set this to 1 to blank out their Circonus passwords. This will disable their ability to bypass LDAP. Passwords are only blanked out after a successful LDAP login. The default value is 0.


#### `header` {#header}

Header authentication allows you to specify an HTTP Header that will be passed to Circonus and that contains a username that is being used to log in.  This method then will either use LDAP (see previous section for configuration) or a lookup URL to determine what groups this user is a member of to give them the correct permissions in Circonus.

**Note:** 
>When header auth is in use, both the `method` and `supported_methods` entries in the main authentication section should be set to header, no other options are permitted.

 * **`header`** - Optional.  The name of the header that contains the username.  The default value is X-Remote-User.

 * **`lookup_url`** - Required if not using LDAP in conjunction with this method.  A URL that will output JSON when asked for details on the user.  The URI should contain a macro {username} which will be replaced with the value in the header.  The resulting JSON should be in the form:

```
{
  "firstname": "Circonus",
  "lastname": "User",
  "email": "circonus.user@example.com",
  "groups": [ "foo", "bar", "baz" ]
}
```

 * **`lookup_interval_minutes`** - Optional.  The interval which user data will be refreshed either from LDAP or the lookup_url.  The default is 10 minutes.

 * **`super_admin_group`** - Required. The group name of the group whose member users will be given super admin privileges in Circonus, allowing configuration of users, accounts, roles, etc. The effect of granting this access level via the method shown below is identical to the effect of running the `create_super_admin` script during initial setup.

 * **`overwrite_password`** - Optional. If you are switching from Circonus auth and wish to enforce LDAP logins on your users, set this to 1 to blank out their Circonus passwords. This will disable their ability to bypass LDAP. Passwords are only blanked out after a successful LDAP login. The default value is 0.


### Self-Configuration {#Self-Configuration}
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


### Initial Installation {#InitialInstallation}
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


#### Installation Sequence {#InstallationSequence}
Circonus is a distributed system.  As such, most roles depend on services configured by other roles that may be on separate machines.  Operators must bring up nodes in the following order, and at least one machine in each role should be brought up at each stage.

 1. `web_db` (Master first, if multiple machines are in this role)
 1. CA
 1. MQ
 1. `web_frontend`
 1. Any remaining nodes, in no particular order

**Note:**
> This order also holds true for ongoing operations.

**Note:**
> If MQ and hub roles are colocated on the same host, some hub services may not be able to start on the first-ever run, resulting in a warning at the end of the run. To correct this, simply run Hooper again.


#### Hooper Run Status {#HooperRunStatus}
At the end of each run, Hooper will summarize the run status, indicating whether another run may be required to complete the setup on the current node.  There are several severity levels:

 * **INFO** - These issues do not affect the operation of the product but should be addressed.

 * **NOTICE** - These issues require administrative intervention that falls outside of Hooper's control.  They should be addressed prior to running Hooper again.

 * **WARNING** - These are issues that occurred during this run that may be fixed by another run after bringing up other nodes.

 * **FATAL** - These are severe issues that occurred during this run that should be fixed before moving on to other nodes.


#### Hooper exit codes {#Hooperexitcodes}
The run-hooper script has some set exit codes for certain issues:
 * **90** - An updated Hooper package was installed.  Another invocation of `run-hooper` is recommended.
 * **91** - An attempt was made to install a Hooper package update, but it failed.
 * **92** - A killswitch file was found.
 * **93** - No nodename was supplied.
 * **94** - Operator attention is required.
 * **95** - An error occurred while trying to summarize run status.
 * **99** - Usage error

Any other exit code will be that of chef-solo.


### Further Tasks on Specific Components {#FurtherTasksonSpecificComponents}

### Addressing PKI Requirements {#AddressingPKIRequirements}
For the following services, the operator may choose to use a certificate signed by a global CA, rather than one signed by the Circonus Inside CA.  If a commercial certificate is desired for any of these services, set the "`certificate_type`" attribute to "`commercial`" on each role for which you plan to use a commercial certificate.


#### Web Portal (`web_frontend`) {#WebPortalweb_frontend}
This is the primary URL that users of Circonus Inside will visit in their browsers. Users must have the CA signing this certificate in their trusted list of Certificate Authorities.  It is made by prepending the "`url_host`" value (if any) to the top-level "`domain`" attribute. For example, if the domain is "`acme-client.com`" and the `url_host` is "`circonus`", we will use the URL: `https://circonus.acme-client.com/`


#### Web Streaming (`web_stream`) {#WebStreamingweb_stream}
The Web Streaming URL provides real-time streaming services embedded within the web portal.  This drives the "Play" option for graphs. We recommend that the URL for this simply be "s." prepended to the fully qualified domain name selected for the web portal. (e.g. `https://s.circonus.acme-client.com/`)


#### API {#API}
*(Optional)*

You may optionally provide externally (publicly) signed certificates for the API services. (e.g. `https://api.circonus.acme-client.com/`)  Because these APIs are programmatically used, it tends to be easier to introduce other trusted CAs.  Many clients are successful using an API certificate signed by a private CA, but setup will be simpler if you use a public authority.


#### Broker UI {#BrokerUI}
*(Optional)*

The broker UI may also be protected by a public SSL certificate, but because this component is typically only accessed by operators of the service (for provisioning purposes), it rarely makes sense to do this. We recommend that the broker use the privately signed certificate for its UI and that the operators make the necessary exceptions.


### LDAP Role Configuration {#LDAPRoleConfiguration}
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


### Load Balancers {#LoadBalancers}
A Load Balancer (LB) is not included as part of an Inside install, but you can add one. Common services to load balance are Web Frontend, API, and Web Stream.  Balancing can be done via round robin, resource checking, or any other method you would like to use.  All connections are stateless, so no session affinity or other special load-balancing configuration is required.

# Post Install Instructions {#PostInstallInstructions}
After your install is complete, you will need to perform each of the following procedures to begin using Circonus:

 1. Install your [IRONdb&reg; license](/PostInstall.md#InstallIRONdbLicense) on each `data_storage` node.
 1. Create a [super-admin](/PostInstall.md#SuperAdmins).
 1. Add and configure a [broker](/PostInstall.md#AddingBrokers).
 1. Setup system [selfchecks](/PostInstall.md#Selfchecks).
 1. Create your first [account](/PostInstall.md#CreatingAccounts).

Procedures for each of these steps are described in the subsections below.

**Note:**
> Your Circonus Inside version should be updated regularly. Keep the Enterprise Brokers up-to-date and the CA updated and backed up regularly.

## Install IRONdb License

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
 * OmniOS: `sudo svcadm restart snowth`

Repeat this process on each system in the `data_storage` role.

## Super Admins {#SuperAdmins}
Super-admins have admin access to every account, as well as access to a special
admin section of the system, located at `https://acme-client.com/admin` .  The
`/admin` section is used to create accounts, brokers, and users. Only
super-admins have access to this part of the system.

The first user you create must be a super-admin.  To do this, log into any host
running the `web_frontend` role and run this script, replacing the
first/lastname and email values:

```
/www/bin/setup/create_super_admin.pl -f Firstname -l Lastname -e Email
```

You can now navigate to `https://acme-client.com/login/` and log in as the super-admin.


## Adding Brokers {#AddingBrokers}
Add a broker to the internal "circonus" account to enable Selfchecks (next
step). Use the following procedure:

 1. Go to https://acme-client.com/admin/broker/new.
 1. Enter the following information:
  * Name - This is the name the broker is identified with in the UI.
  * IP Address - This is the address where Stratcon (the data aggregator) can talk to the broker.
  * Account - Select the "circonus" account.

This procedure will add a broker entitlement slot into the system and put it
into an "unprovisioned" state.  Next, install the broker software package on a
system and provision it using its bundled configuration tool.  To find
documentation on this process, please refer to the [Broker
Installation](https://login.circonus.com/resources/docs/user/Administration/Brokers.html#Installation)
subsection of the Administration section in the User Manual.

If you later decide to make this broker "public" (grant access to all
accounts), you can visit the "/admin/broker" page, search for the broker in
question, click on it to edit, and change the account to "All Accounts". The
broker that handles the Selfchecks should remain on the "circonus" account or
be public, but should not be moved to another individual account.


## Selfchecks {#Selfchecks}
Circonus Inside operations are monitored via two methods: internally and externally.

Services that are not in the alerting pathway are monitored internally by your Circonus Inside install.

Services that are in the alerting pathway need an external monitor to ensure that alerts will still be sent out in the event that the service goes down.  All Circonus Inside customers are given a limited Circonus Software as a Service (SaaS) account for this purpose.  If you cannot use a SaaS account, please let Support know and they will work with you on an alternate solution (support@circonus.com).

Selfchecks are created under the system's "circonus" account, which is created by default during the install.  To access this account, navigate to the "/account/circonus/dashboard" page as a super-admin.

As part of the standard Post-Installation procedures, we advise using the "circonus" account to create a contact group which will be notified on any internal systems issue.  For details on contact groups, refer to the [Contact Groups](/Docs/Alerting/ContactGroups.md) subsection in the User Manual, located in the Alerting section.

To set up the selfchecks for a contact group, you will need the broker id and the contact group name.  Run the following script on any `web_frontend` node:

```
/www/bin/inside/create_selfchecks.pl -b <broker_id> -c <contact group name>
```

To find the `broker_id`, visit the "/admin/broker" page and search for the broker you want to use. The ID will be in the leftmost column in the search results.

## Creating Accounts {#CreatingAccounts}
Make an account for normal Circonus use with the following procedure:

  1. Navigate to `https://acme-client.com/admin/account/new`.
  1. Enter the following information:
   * Name - This is name of the account.
   * URL - This will be filled in based on the name. This is how you will access the account; e.g. using `https://acme-client.com/account/<url>/profile` where "`<url>`" is this URL.
   * Timezone - The timezone used for displaying dates and times in the UI. Typically this is set to the local timezone where the majority of account users are located.
   * Description - This is optional, but can be useful for identification or instructions.
   * Metric limit -  This is provided to let you limit metrics internally. If you don't want to worry about limits, just enter a large number for now.
  1. Click "Create Account".

## Multiple Datacenters {#MultipleDatacenters}

### General Concept {#GeneralConcept}
Circonus operates in what can be described as an active-passive setup, where the backup datacenter is a warm standby should the primary DC be unreachable.

In this setup, all services, except for brokers, are replicated between the two datacenters.  Circonus aggregation (stratcon) services actively connect to all brokers in the infrastructure and collect the same data in all datacenters.

When a datacenter fails, database services need to be cut over to the chosen backup, and alerting services turned on, all other services can remain running. See the [Datacenter Failover](/OperationManual/Failover.md) section in the operations manual for more information on this process.


### Configuring a backup datacenter {#Configuringabackupdatacenter}
Configuring a backup is nearly identical to setting up the primary datacenter. The site.json for each datacenter will contain a listing of all the nodes in both datacenters (see "`machinfo`"), and the "`_machlist`" attribute for all the services should contain all the nodes which will run them, again in both datacenters.  There are two exceptions to this:
 1. The CA service must only have the machine from the primary datacenter from which it operates.
 1. The data_storage service must only have the nodes for the particular datacenter for this file.

In addition to those two exceptions, take note of a few other items:
 * For the stratcon role, the groups attribute should describe the node grouping in each datacenter.  For example, if you had a single node for the role in each location, the groups would look like this:
```
"groups": [
  ["DC1server"],
  ["DC2server"]
]
```

 * All nodes in the infrastructure across datacenters need to have network access to the primary DB. For the other DBs, this is to receive replicated data; for other roles, various jobs need to run to look up information and record when they are complete.

 * All stratcon nodes will need access to port 43191 on all fault_detection nodes from all datacenters. The fault_detection role also functions as the composite broker, and all stratcons need to be able to connect to composite brokers just as they do normal brokers.

Other than the items above, you can install the services in all other datacenters in the same manner as the primary datacenter (refer to the installation instructions in this manual). Once this is complete on all nodes, you should have a functioning backup that is replicating from the primary and pulling metric information.

**NOTE:**
> If the backup datacenter is built some time after the primary has been operational, metric data in the backup will start from when the backup was brought online.  If you require older metric data to be present, please contact Circonus Support (support@circonus.com) for assistance.


### Disabling services in the backup datacenter {#Disablingservicesinthebackupdatacenter}
The following services should be disabled in the backup datacenter:
 * notification

There are several manual tasks that must be performed post failover. Refer to the [Datacenter Failover](/OperationManual/Failover.md) section in the the operations manual for this information.


### Checking Datacenter Status {#CheckingDatacenterStatus}
To check if a datacenter is active or in standby mode, visit `https://web_frontend_host/status`. This page will output either "ACTIVE" or "STANDBY".
