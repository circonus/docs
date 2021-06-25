---
title: Hub
weight: 70
---

# Hub

The hub role is an all purpose role that contains various services and cronjobs for Circonus.  All of the services log to the `/var/log/circonus` directory and have logs named after the process.  Issues with the services can typically be resolved by restarting them. If in doubt, contact Circonus Support (support@circonus.com).

## `circonus-composite_expander`

The composite expansion service deals with composite metrics that make use of the tags or attribute syntax as defined in the description of the Composite check type found in the [User Manual](/circonus/checks/check-types/composite/)

## `circonus-metric_type_chance`

When metrics are added to Circonus, it is recommended you do not alter their type, i.e., from numeric to text or vice versa.  The type change service attempts to detect changes automatically and make adjustments as needed.

Note that if you provision a check via the API and identify the metric as one type, when in reality it is another, then the type change service might not detect this discrepancy because it did not "change" in the system.  To mitigate problems relating to this, please verify that metrics are being added as the correct type.

## `circonus-pending_check_processor`

The `pending_check_processor` and its sister process, `template-rules-sync` (see below), both deal with modifications to templates.

`pending_check_processor` is the backend processor that pushes out modifications to the checks added to the templates.  Because this can be a long process, changes are not actually implemented immediately when a modification is made to either the UI or the API. Instead, changes are scheduled to take place shortly after the request finishes.

Typically, these changes should take place within seconds, or up to a few minutes after the requested change.  If you do not see the changes, restarting the service will detect and make any outstanding modifications.

## `circonus-template_rules_sync`

Like the `pending_check_processor` (see above), `template-rules-sync` deals with modifications to templates. Specifically, `template-rules-sync` deals with when a template is marked to sync the rules.

When a template is modified, after the `pending_check_processor` has completed, it sends a message to the `template-rules-sync` to have any rules synchronized with the template master.  If the `pending_check_processor` is restarted, it will signal the `template-rules-sync` process about any templates it updates.

## Cronjobs

The hub role runs a few cronjobs which update the status of the [brokers](/circonus/on-premises/roles-services/broker) both to internal systems and to the web UI.  The following cronjobs each run once a minute:

### `/www/bin/noit/noit_activation.pl`

This script looks for any broker in a pending state. This means that the broker has its certificate and is just waiting for a test to make sure Circonus can talk to it. Upon success, the broker is activated for use.  Problems activating the broker can be found in the [Web DB](/circonus/on-premises/roles-services/web-db) with the following query:
```
select * from circonus.noit_activation_status;
```

If the status is "`Could not create selfcheck...`", verify the connectivity of the hub machine to the broker, first by trying to telnet to the broker:
```
telnet <broker IP> 43191
```

Secondly, try by connecting over SSL:
```
openssl s_client \
  -connect <IP:port> \
  -cert /www/etc/ssl/<hostname>.crt \
  -key /www/etc/ssl/<hostname>.key \
  -CAfle /www/etc/ssl/ca.crt
```

If telnet fails, then verify the broker [noitd](/circonus/on-premises/roles-services/broker#noitd) service is running and connections to it are allowed.  If the openssl command fails to verify that the cert, key, and `ca.crt` are in place, then the [install](/circonus/on-premises/installation/installation#initial-installation) might not have finished and you should re-run `/opt/circonus/bin/run-hooper <hostname>` on the machine and try again.

### `/www/bin/noit/stratcon_sync.pl`

This script notifies [stratcon](/circonus/on-premises/roles-services/stratcon) about any new or deactivated [brokers](/circonus/on-premises/roles-services/broker).  If a broker has been activated and is not connected, you can run this script outside of cron to check the output.

### `/www/bin/noit/enzo_sync.pl`

This script is the same as `stratcon_sync.pl` (see above), except that it notifies the [web streaming](/circonus/on-premises/roles-services/web-stream) service about new or deactivated brokers, instead of notifying stratcon. The same troubleshooting instructions apply.

### `/www/bin/noit/noit_version_check.pl`

This script updates the [database](/circonus/on-premises/roles-services/web-db) (and therefore the web UI and [API](/circonus/on-premises/roles-services/api)) on the current status of the [brokers](/circonus/on-premises/roles-services/broker); whether their clocks are in sync, whether their software is up to date, etc.

If you update a broker and still see that it is listed as needing an update, or see that there is clock skew, you can run this script manually.  If the problem persists, contact Support (support@circonus.com).

### `/www/bin/inside/systems_monitor.pl`

If configured, this script pushes data about the internal workings of the [fault detection](/circonus/on-premises/roles-services/fault-detection) path to Circonus SaaS for external monitoring.  If an issue is detected, you will be paged by the SaaS service.  If you are not utilizing SaaS to monitor your inside install, this script will not push data.

## Hub PKI Files

 * `/www/etc/ssl/ca.crt`
 * `/www/etc/ssl/<hostname>.crt`
 * `/www/etc/ssl/<hostname>.key`
