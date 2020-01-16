---
title: Azure
weight: 30
---

# Azure

## Installation

1. Create a directory for the install: `mkdir -p /opt/circonus/cloud-agent`
1. Download the [latest release](https://github.com/circonus-labs/circonus-cloud-agent/releases/latest)
1. Unpack the release in the directory created in first step
1. Create a service specific configuration directory `mkdir etc/azure.d`
1. Create a service specific configuration file `sbin/circonus-cloud-agentd --enable-azure --azure-example-conf=yaml > etc/azure.d/myconfig.yaml`. Note, if the `id` is not set in the configuration file, the basename of the configuration file will be used.
1. Edit the configuration file, add Azure and Circonus settings
1. Setup as a system service or run in foreground

## Options

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

## Configuration

### Setting up application in Azure

1. Login to the Azure portal
1. [Create application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application)
    1. Name the application (e.g. `circonus-cloud-agent`)
    1. Add reader role to subscription for the application
1. Collect application configuration information
    1. Directory ID
    1. Application ID
    1. Application secret
    1. Subscription ID

### Circonus

1. Use Circonus UI to create or identify an API Token to use
1. Create a configuration file (`etc/azure.d/...` with some unique name), place the azure and circonus credentials where appropriate
1. Start/restart `circonus-cloud-agentd`, ensure `--enable-azure` is on command line, environment variable is set, or azure is enabled in main configuration file

### Azure configuration file settings

* `directory_id`
* `applicaiton_id`
* `application_secret`
* `subscription_id`
* `resource_filter` - Use the resourceFilter setting to limit the resources from which metrics are collected. Otherwise, **ALL** metrics from **ALL** resources will be collected. The suggested method would be to add a tag to each resource from which to collect metrics and use a filter expression such as `tagname eq 'circonus' and tagValue eq 'enabled'`
* `cloud_name` - default `AzurePublicCloud`
* `user_agent` - default `circonus-cloud-agent`
* `interval` - collection interval in minutes [>=default], default `5`

### Example configuration

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

