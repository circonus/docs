---
title: Basic Usage
weight: 10
---

# Basic Usage

## Agent architecture

The Circonus Unified Agent, or CUA, is based on InfluxData's Telegraf. CUA's primary function is to collect metrics through various input plugins, allowing Circonus customers to monitor systems, services, and 3rd party APIs.

CUA is plugin-driven and has 4 distinct types:

- Input Plugins collect metrics from the system, services, or 3rd party APIs
- Processor Plugins transform, decorate, and/or filter metrics
- Aggregator Plugins create aggregate metrics (e.g. mean, min, max, quantiles, etc.)
- Output Plugins write metrics to various destinations (e.g. Circonus, log files, etc.)

These plugins are designed to be easy to develop and contribute. Pull requests are very welcome, as we seek to expand support for and incorporate support for many technologies.

## Supported platforms

| Platform                                 | Supported versions                                        |
|------------------------------------------|-----------------------------------------------------------|
| [Docker][1]                              | Version 1.12+                                             |
| [FreeBSD][2]                             | FreeBSD 12                                                |
| [Linux][3]                               | All x86 and arm64 v8                                      |
| [macOS][4]                               | macOS 10.12+                                              |
| [Windows Server][5]                      | Windows Server 2008 R2+ and Server Core (not Nano Server) |
| [Windows][6]                             | Windows 7+                                                |

**Notes**: 
- 64-bit x86 packages are available for all platforms on the list. Arm v8 packages are available for all platforms except Windows and MacOS.
- CUA supports the latest updates to Windows Server 2008 R2 with the most recent Windows updates installed, however [ there is a known issue with clock drift and Go][6] that affects this environment.

[1]: /circonus/agents/circonus-unified-agent/basic_usage/docker/
[2]: /circonus/agents/circonus-unified-agent/basic_usage/freebsd/
[3]: /circonus/agents/circonus-unified-agent/basic_usage/linux/
[4]: /circonus/agents/circonus-unified-agent/basic_usage/osx/
[5]: /circonus/agents/circonus-unified-agent/basic_usage/windows/
[6]: https://github.com/golang/go/issues/24489
