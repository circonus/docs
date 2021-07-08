---
title: Circonus Cloud Agent
weight: 20
---

# Circonus Cloud Agent

The Circonus Cloud Agent can be used to monitor AWS, GCP, and Azure. Instructions for each platform are outlined below.

## AWS CloudWatch

### Supported AWS services

* ApplicationELB
* CloudFront
* DynamoDB
* DX
* EBS
* EC2
* EC2AutoScaling
* EC2Spot
* ECS
* EFS
* ElastiCache
* ElasticBeanstalk
* ElasticInterface
* ElasticMapReduce
* ElasticTranscoder
* ELB
* ES
* KMS
* Lambda
* NATGateway
* NetworkELB
* RDS
* Route53
* Route53Resolver
* S3
* SNS
* SQS
* TransitGateway

### Installation

1. Create a directory for the install. Suggested: `mkdir -p /opt/circonus/cloud-agent`
1. Download the [latest release](https://github.com/circonus-labs/circonus-cloud-agent/releases/latest)
1. Unpack the release in the directory created in first step
1. In this directory, create a config folder. Suggested: `mkdir /opt/circonus/cloud-agent/etc/aws.d`
1. Auto-create a service specific configuration template in the desired format (yaml, toml, or json).  Suggested: `sbin/circonus-cloud-agentd --enable-aws --aws-example-conf=yaml > /opt/circonus/cloud-agent/etc/aws.d/aws-config.yaml` 
    * Note, the `id` in the template is defaulted to the filename.  This should be changed to a name that will be unique across all cloud-agents used in Circonus
    * Add the [Circonus api key](#circonus)
    * Add the [AWS credentials](#aws-settings)
    * Update settings for the desired AWS services to be monitored
1. Setup as a system service or run in foreground ensuring that `--enable-aws` is specified

### Options

```sh
$  sbin/circonus-cloud-agentd -h
The Circonus Cloud Agent collects metrics from cloud infrastructures and fowards them to Circonus.

Usage:
  circonus-cloud-agent [flags]

Flags:
      --aws-conf-dir string         AWS configuration directory (default "/opt/circonus/cloud-agent/etc/aws.d")
      --aws-example-conf string     Show AWS config (json|toml|yaml) and exit
  -c, --config string               config file (default: circonus-cloud-agent.yaml|.json|.toml)
  -d, --debug                       [ENV: CCA_DEBUG] Enable debug messages
      --enable-aws                  Enable AWS metric collection client
  -h, --help                        help for circonus-cloud-agent
      --log-level string            [ENV: CCA_LOG_LEVEL] Log level [(panic|fatal|error|warn|info|debug|disabled)] (default "info")
      --log-pretty                  [ENV: CCA_LOG_PRETTY] Output formatted/colored log lines [ignored on windows]
  -V, --version                     Show version and exit
```

### Configuration

#### AWS

> NOTE: the agent can run in a shared mode with multiple sets of credentials or a local mode where the credentials are kept in an external location and _roles_ are used to identify which credentials to use.

1. Create an IAM group e.g. `circonus-cloud-agent` (if one does not already exist) with the following permissions:
   1. Required: `CloudWatchReadOnlyAccess` - to retrieve metrics
   1. Optional: `AmazonEC2ReadOnlyAccess` - to get list of instances, if EC2 metrics are desired
   1. Optional: `AmazonElastiCacheReadOnlyAccess` - to get list of cache clusters, if ElastiCache metrics are desired
1. Create an IAM user e.g. `circonus-cloud-agent` (ensure it is a member of the aforementioned group), make a note of the Access Key Credentials (access key id and secret access key or role and save credentials file locally where circonus-cloud-agent will run, ensure it is accessible by whatever user the circonus-cloud-agent is configured to run as.)

#### Circonus

1. Use Circonus UI to create or identify an API Token to use
1. Add the `key` to the config file under the `circonus` section

#### AWS settings

For per-configuration file credentials (shared):

* `access_key_id`
* `secret_access_key`

or, for credentials in a local file:

* `role`
* `credentials_file`

#### Example configuration

Minimum configuration (for EC2 service):

Credentials in configuration file:

```yaml
---

id: ...
aws:
  access_key_id: ...
  secret_access_key: ...
circonus:
  key: ...
period: basic
regions:
    - name: us-east-1
      services:
          - namespace: aws/EC2
            disabled: false
```

Shared credentials using roles:

```yaml
---

id: ...
aws:
  role: ...
  credentials_file: ...
circonus:
  key: ...
period: basic
regions:
    - name: us-east-1
      services:
          - namespace: aws/EC2
            disabled: false
```
## GCP

### Installation

1. Create a directory for the install. Suggested: `mkdir -p /opt/circonus/cloud-agent`
1. Download the [latest release](https://github.com/circonus-labs/circonus-cloud-agent/releases/latest)
1. Unpack the release in the directory created in first step
1. In this directory, create a config folder. Suggested: `mkdir /opt/circonus/cloud-agent/etc/gcp.d`
1. Auto-create a service specific configuration template in the desired format (yaml, toml, or json).  Suggested: `sbin/circonus-cloud-agentd --enable-gcp --gcp-example-conf=yaml > etc/gcp.d/gcp-config.yaml`
    * Note, the `id` in the template is defaulted to the filename.  This should be changed to a name that will be unique across all cloud-agents used in Circonus
    * Follow [configuration](#configuration) instructions to finish config settings.
1. Setup as a system service or run in foreground ensuring that `--enable-gcp` is specified

### Options

```sh
$  sbin/circonus-cloud-agentd -h
The Circonus Cloud Agent collects metrics from cloud infrastructures and fowards them to Circonus.

Usage:
  circonus-cloud-agent [flags]

Flags:
      --gcp-conf-dir string         GCP configuration directory (default "/opt/circonus/cloud-agent/etc/gcp.d")
      --gcp-example-conf string     Show GCP config (json|toml|yaml) and exit
  -c, --config string               config file (default: circonus-cloud-agent.yaml|.json|.toml)
  -d, --debug                       [ENV: CCA_DEBUG] Enable debug messages
      --enable-gcp                  Enable GCP metric collection client
  -h, --help                        help for circonus-cloud-agent
      --log-level string            [ENV: CCA_LOG_LEVEL] Log level [(panic|fatal|error|warn|info|debug|disabled)] (default "info")
      --log-pretty                  [ENV: CCA_LOG_PRETTY] Output formatted/colored log lines [ignored on windows]
  -V, --version                     Show version and exit
```

### Configuration

#### Google

1. Find project to monitor in GCP UI
1. Add service account to project
   * Set service account name, e.g. 'circonus-cloud-agent'
   * Add description
   * Click create
   * Add roles: project>viewer, monitoring>monitoring viewer, compute engine>compute viewer
   * Create key, type JSON (note where the key is downloaded)
       * Place the JSON file downloaded in GCP setup somewhere and ensure that the user running `circonus-cloud-agentd` will be able to read the file (e.g. `nobody` on linux when run as a systemd service).
       * Ensure that the configuration file setting `gcp.credentials_file` is set to the full filespec of where the service account JSON file was placed.
1. The following APIs must be enabled for the project
   * [Cloud Resource Manager API](https://console.cloud.google.com/apis/library/cloudresourcemanager.googleapis.com) - role _project>viewer_ is used to obtain the project meta data: ensure it is an active project, project name is used to create check bundle, project labels are added as a base set of stream tags along with project id
   * [Stackdriver Monitoring API](https://console.cloud.google.com/apis/library/monitoring.googleapis.com) - role _monitoring>monitoring viewer_ is used to retrieve available metrics and metric data
   * [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com) - role _compute engine>compute viewer_ is used to obtain a list of instances, obtain state/status of an instance, name, labels (for stream tags), etc.
1. Add these to the `gcp` section of the configuration file.

#### Circonus

1. Use Circonus UI to create or identify an API Token to use
1. Add the `key` to the config file under the `circonus` section

#### Example configuration

Minimum configuration:

```yaml
---
id: ...
gcp:
  credentials_file: ...
circonus:
  key: ...
```

## Azure

### Installation

1. Create a directory for the install. Suggested:: `mkdir -p /opt/circonus/cloud-agent`
1. Download the [latest release](https://github.com/circonus-labs/circonus-cloud-agent/releases/latest)
1. Unpack the release in the directory created in first step
1. In this directory, create a config folder. Suggested: `mkdir /opt/circonus/cloud-agent/etc/azure.d`
1. Auto-create a service specific configuration template in the desired format (yaml, toml, or json).  Suggested: `sbin/circonus-cloud-agentd --enable-azure --azure-example-conf=yaml > etc/azure.d/azure-config.yaml`. 
    * Note, the `id` in the template is defaulted to the filename.  This should be changed to a name that will be unique across all cloud-agents used in Circonus
    * Follow [configuration](#configuration) instructions to finish config settings
1. Setup as a system service or run in foreground ensuring that `--enable-azure` is specified

### Options

```sh
$  sbin/circonus-cloud-agentd -h
The Circonus Cloud Agent collects metrics from cloud infrastructures and fowards them to Circonus.

Usage:
  circonus-cloud-agent [flags]

Flags:
      --azure-conf-dir string       Azure configuration directory (default "/opt/circonus/cloud-agent/etc/azure.d")
      --azure-example-conf string   Show Azure config (json|toml|yaml) and exit
  -c, --config string               config file (default: circonus-cloud-agent.yaml|.json|.toml)
  -d, --debug                       [ENV: CCA_DEBUG] Enable debug messages
      --enable-azure                Enable Azure metric collection client
  -h, --help                        help for circonus-cloud-agent
      --log-level string            [ENV: CCA_LOG_LEVEL] Log level [(panic|fatal|error|warn|info|debug|disabled)] (default "info")
      --log-pretty                  [ENV: CCA_LOG_PRETTY] Output formatted/colored log lines [ignored on windows]
  -V, --version                     Show version and exit
```

### Configuration

#### Setting up application in Azure

1. Login to the Azure portal
1. [Create application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application)
    1. Name the application (e.g. `circonus-cloud-agent`)
    1. Add reader role to subscription for the application
1. Collect application configuration information
    1. Directory ID
    1. Application ID
    1. Application secret
    1. Subscription ID
1. Add these to the `azure` section of the config file.

#### Circonus

1. Use Circonus UI to create or identify an API Token to use
1. Add the `key` to the config file under the `circonus` section

#### Azure configuration file settings

* `directory_id`
* `applicaiton_id`
* `application_secret`
* `subscription_id`
* `resource_filter` - Use the resourceFilter setting to limit the resources from which metrics are collected. Otherwise, **ALL** metrics from **ALL** resources will be collected. The suggested method would be to add a tag to each resource from which to collect metrics and use a filter expression such as `tagname eq 'circonus' and tagValue eq 'enabled'`
* `cloud_name` - default `AzurePublicCloud`
* `user_agent` - default `circonus-cloud-agent`
* `interval` - collection interval in minutes [>=default], default `5`

#### Example configuration

Minimum configuration:

```yaml
---
id: ...
azure:
  directory_id: ...
  application_id: ...
  application_secret: ...
  subscription_id: ...
circonus:
  key: ...
```
