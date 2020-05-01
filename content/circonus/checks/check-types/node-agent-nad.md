---
title: Node Agent (NAD)
---

# Node Agent (NAD)

 * **Category:** agent
 * **Dataflow:** pull
 * **Default Port:** 2609

This check type monitors your system metrics with help form the Node Agent Daemon (NAD) available from Circonus Labs on [github](https://github.com/circonus-labs/nad). Refer to the Github link for additional documentation.

NAD is a lightweight, simply managed host agent written in Node.js. NAD is the first choice of Circonus due to its easy extensibility and its ability to work on almost any platform, including Windows, RHEL, Ubuntu, and Illumos derivatives. NAD comes with enough plugins to monitor the basics, while allowing you to add your own checks to fit your environment.

NAD runs scripts only from the config directory and not from any subdirectories. The best practice is to write scripts in subdirectories of the config dir and soft link to them to enable their execution.

Some scripts distributed with NAD need to be compiled. (They aren't actually scripts; they are ELF executables.) Since not all programs can be compiled on all platforms, you need to build them as needed. There are makefiles, and you can pick and choose which ones you want to run. If you write a set of scripts or programs, you can describe them in an `.index.json` file and they will be reported on when you run NAD.

## Installing NAD

If your operating system vendor doesn't package it for you, check it out from github and run the make install.

There are install targets for some operating systems, which enable all the default checks and install init scripts and default configuration helper files.

Circonus offers a variety of pre-made NAD builds for CentOS and Ubuntu which can be found [here](http://updates.circonus.net/node-agent/packages/). These are self-contained packages and will automatically install and start the service.

## NAD Operations

There are no configuration files for NAD. Just run it and it works. It has a default directory out of which it executes scripts and executables. When it is installed, all available plugins will be installed in subdirectories under "`config dir`".

To enable a script, simply link to it from "`config dir`". By default, the config directory is `/opt/circonus/etc/node-agent.d/`. You can change this using `-c` on the command line. The default port is 2609, but this can be changed using `-p`.

## NAD Automatic Configuration with Circonus

NAD can automatically configure itself with Circonus via a few command line options. When running in configuration mode, NAD will create a check and graphs with Circonus and then exit. It will not attempt to bind to any port, so it is safe to use while running normally.
 * authtoken - This is the Circonus API auth token to use when talking with the API. This "activates" the configuration mode.
 * target - (Required) This should be either the IP or hostname at which the Circonus broker can talk to this host.
 * hostname - This is the hostname to use in the check and graph names. If not passed, NAD will attempt to look it up via commands like `/usr/bin/zonename`.
 * brokerid - (Required) This is the ID from Circonus for the broker on which you wish to configure the check.
 * configfile - (Required) This is the path to the config file to use that defines the metrics and graphs to create in Circonus. Look at `config/illumos.json` for an example.

## NAD Config File

The `--configfile` parameter defines which config file to use when setting up checks and graphs in Circonus. The NAD looks for two keys.

The check key contains the definition that will be passed to the check bundle endpoint in the Circonus API. You can set values like the period and timeout here, as well as config options (in the config key). The metrics key defines which metrics we will collect and has 2 sub-keys (numeric and text) which are simply lists of metric names. When NAD attempts to create the check, if it gets back a pre-existing check, NAD will update the check, adding the new metric names.

The graphs key defines a collection of graphs to create. Each sub-key is the name of the graph that will be created in Circonus, with the hostname prepended to it. Under the names, the structure is identical to the documentation for the Circonus graph API and any values added will be passed to the API unchanged.
