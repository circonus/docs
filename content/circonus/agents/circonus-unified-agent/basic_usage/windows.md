---
title: Windows
weight: 40
---

# CUA for Windows

This page outlines the installation and configuration of CUA for Windows.

## Installation

CUA natively supports running as a Windows Service. Outlined below are the general steps to set it up:

1. Obtain the latest release of CUA for Windows from the [Releases Page](https://github.com/circonus-labs/circonus-unified-agent/releases/latest).

2. Create the directory C:\Program Files\Circonus-Unified-Agent (if you install in a different location simply specify the --config parameter with the desired location)

3. Place the circonus-unified-agentd.exe and the circonus-unified-agent.conf config file into C:\Program Files\Circonus-Unified-Agent

4. To install the service into the Windows Service Manager, run the following in PowerShell as an administrator (If necessary, you can wrap any spaces in the file paths in double quotes ""):

```sh
C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agentd.exe --service install
```

Edit the configuration file to meet your needs

To check that it works, run:

```sh
C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agentd.exe --config C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agent.conf --test
```
To start collecting data, run:

```sh
net start circonus-unified-agentd
```

## Config Directory

You can also specify a --config-directory for the service to use:

Create a directory for config snippets: C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agent.d

Include the --config-directory option when registering the service:

```sh
C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agentd.exe --service install --config C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agent.conf --config-directory C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agent.d
```

### Other supported operations

CUA can manage its own service through the --service flag:

| Command                                           | Effect                        |
|---------------------------------------------------|-------------------------------|
| `circonus-unified-agentd.exe --service install`   | Install CUA as a service |
| `circonus-unified-agentd.exe --service uninstall` | Remove the CUA service   |
| `circonus-unified-agentd.exe --service start`     | Start the CUA service    |
| `circonus-unified-agentd.exe --service stop`      | Stop the CUA service     |


## Install multiple services

Running multiple instances of CUA is rarely needed. However, if you do need to run multiple CUA instances on a single system, you can install the service with the `--service-name` and
`--service-display-name` flags to give the services unique names:

```sh
> C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agentd.exe --service install --service-name cua-1 --service-display-name "CUA 1"
> C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agentd.exe --service install --service-name cua-2 --service-display-name "CUA 2"
```

## Troubleshooting

When CUA runs as a Windows service, CUA logs messages to Windows events log before configuration file with logging settings is loaded.

Check event log for an error reported by `circonus-unified-agentd` service in case of CUA service reports failure on its start: Event Viewer->Windows Logs->Application

**Troubleshooting common error #1067**

When installing as service in Windows, always double check to specify full path of the config file, otherwise windows service will fail to start

```sh
 --config "C:\"Program Files"\"Circonus Unified Agent"\circonus-unified-agent.conf"
```