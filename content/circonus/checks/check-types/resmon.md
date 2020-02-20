---
title: Resmon
---

# Resmon

 * **Category:** agent
 * **Dataflow:** pull
 * **Default Port:** 81

Resmon is a Perl-based agent created by OmniTI.  New modules can be created quickly and easily, but must be written in Perl.

Resmon is a lightweight system agent that reports status via standard XML DTD. Any metrics published over HTTP in this format can be imported into Circonus. See the [Resmon](http://labs.omniti.com/labs/resmon) documentation for more information.

Resmon is a lightweight utility for local host monitoring that can be queried by tools such as nagios over HTTP. One of its main design goals is portability, which is why Resmon should require nothing more than a default install of Perl and local requirements should be minimal to ease deployment on multiple platforms. Resmon requires Perl 5 and some modules will require specific commands to be installed, such as subversion for the SVN checks, but these are module specific. It is available 

## Downloading and Configuring Resmon

Currently, there is no release version of Resmon. The latest version of Resmon can be checked out via git using one of the following options:
 * The default option is to use `git clone git://labs.omniti.com/resmon.git`
 * Those with push access should use the ssh url: `git clone git@labs.omniti.com:resmon.git`
 * An older release of Resmon is also available in the resmon1 branch: `git clone -b resmon1 git://labs.omniti.com/resmon.git`

Resmon configuration is in a single file: `/opt/resmon/resmon.conf`. This can be changed by passing the -c argument to Resmon when starting it up.
 
The config file has two parts, general options and module configuration. Below is an example of the general options section:
```
INTERVAL 30;
PORT 81;
STATUSFILE /var/run/resmon-status.txt;
TIMEOUT 10;
AUTHUSER foo;
AUTHPASS bar;
```

The following options can be set: 
 * port - on which port to listen
 * interval - how long to wait between each check. Note that each module can have an independent interval that will cache the result between individual checks. 
 * statusfile - filename to which to write resmon's status. This is useful for quickly checking on the status directly on the server without needing access to a web browser. 
 * lib - (optional) an addition directory which can contain resmon modules 
 * timeout - (optional, default 10 seconds) aborts any check that takes longer than this with a "BAD - Check timeout" status 
 * authuser - the user to authenticate as 
 * authpass - if authuser is defined, the password with which to authenticate

The next part of the configuration file is a series of module definitions. The format looks like this example: 
```
Core::ModuleName {
 check_name1 : param1 => value1, param2 => value2
 check_name2 : param1 => foo, param2 => bar
}
```

Refer to the following sources for information on the modules that are available:
 * For version 1 of Resmon see http://labs.omniti.com/labs/resmon/wiki/ModuleDevelopment (Modules_ver1)
 * For version 2, you can look at the `lib/Core/Sample.pm` module that comes with Resmon. For example:
```
<!ELEMENT ResmonResults (ResmonResult+)>
<!ELEMENT ResmonResult (last_runtime_seconds, last_update, metric+, state?)>
<!ATTLIST ResmonResult
 module CDATA #REQUIRED
 service CDATA #REQUIRED
>
<!ELEMENT last_runtime_seconds (#PCDATA)>
<!ELEMENT last_update (#PCDATA)>
<!ELEMENT metric (#PCDATA)>
<!ATTLIST metric
 name CDATA #REQUIRED
 type (0|i|I|l|L|n|s) #IMPLIED
>
<!ELEMENT state (BAD|WARNING|OK)>
```

## Resmon Metrics

The following is a partial summary of metrics that Circonus receives from Resmon:
 * `cases_active` - This is the current total active alarms.
 * `cases_total` - This is the total number of cases the system has dealt with since booting.
 * `timers` section - This includes the total number of various internal timers that have been started over the lifetime of the process.
 * `contact` section - This includes the total number of messages sent to various contact methods, lifetime.
 * `noit_maintenance` section - This includes the epoch of when a broker entered maintenance. The value will be 0 / non existent if the broker is not in maintenance.
 * `mq` section - This includes the total sent messages, total received messages, and connection status.
