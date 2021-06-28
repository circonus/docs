---
title: Docker
weight: 10
---

# CUA for Docker

This page outlines the installation and configuration of CUA for Docker.

## Installation

1. Create a configuration file from the [repository example](https://github.com/circonus-labs/circonus-unified-agent/tree/master/etc/example-circonus-unified-agent.conf)

2. In `outputs.circonus`:
    a. Set `api_token` to your [Circonus api token](/circonus/administration/api-tokens/)
    b. Set `check_name_prefix` to ensure the check target can be found again after a container is restarted - agent will use the container's "hostname" as the check target by default.

Use one of the following commands:

```sh
docker run -d --name=circonus-unified-agent \
    -v $PWD/circonus-unified-agent.conf:/etc/circonus-unified-agent/circonus-unified-agent.conf:ro \
    circonus/circonus-unified-agent
```

or

```sh
docker run -d --name=circonus-unified-agent \
    --mount type=bind,src=$PWD/circonus-unified-agent.conf,dst=/etc/circonus-unified-agent/circonus-unified-agent.conf \
    circonus/circonus-unified-agent
```

## Integrations

In some cases, you may wish to collect host metrics from within the container. To do so, use one of the following commands:

```sh
docker run -d --name=circonus-unified-agent \
    -v $PWD/circonus-unified-agent.conf:/etc/circonus-unified-agent/circonus-unified-agent.conf:ro \
    -v /:/hostfs:ro \
    -e HOST_ETC=/hostfs/etc \
    -e HOST_PROC=/hostfs/proc \
    -e HOST_SYS=/hostfs/sys \
    -e HOST_VAR=/hostfs/var \
    -e HOST_RUN=/hostfs/run \
    -e HOST_MOUNT_PREFIX=/hostfs \
    -e ENABLE_DEFAULT_PLUGINS=true \
    circonus/circonus-unified-agent
```

or

```sh
docker run -d --name=circonus-unified-agent \
    --mount type=bind,src=$PWD/circonus-unified-agent.conf,dst=/etc/circonus-unified-agent/circonus-unified-agent.conf \
    -v /:/hostfs:ro \
    -e HOST_ETC=/hostfs/etc \
    -e HOST_PROC=/hostfs/proc \
    -e HOST_SYS=/hostfs/sys \
    -e HOST_VAR=/hostfs/var \
    -e HOST_RUN=/hostfs/run \
    -e HOST_MOUNT_PREFIX=/hostfs \
    -e ENABLE_DEFAULT_PLUGINS=true \
    circonus/circonus-unified-agent
```
