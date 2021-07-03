---
title: NRPE
---

# NRPE

 * **Category:** agent
 * **Dataflow:** pull
 * **Default Port:** 5666

This check type checks your system via NRPE.

You will need the Host IP or DNS, and you will need to enter the command to run on your NRPE enabled server. Advanced configuration options will allow you to adjust the period and timeout durations, the default port, or disable SSL and/or appending units.

Circonus can utilize existing NRPE checks from your Nagios or Icinga installation. NRPE allows you to remotely call Nagios scripts to collect information. If you want to monitor a non-standard metric, one option may be a Nagios script.
