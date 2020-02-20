---
title: System Monitor
weight: 80
---

# System Monitor

## Running the System Monitor Locally

The system monitor is a script that runs on the hub role. It can be found in `www/bin/inside/systems_monitor.pl`

This script uses the saas_check_secret and saas_check_uuid attributes described Circonus Inside [Installation Manual](/circonus/on-premises/installation/installation#top-level-attributes), which are set to values provided by Circonus Support during the installation. There is a set of these values for each data center or cluster.

The system monitor script pushes data to a HTTPTrap in the Circonus Support team's environment. Because of internet access restrictions, not all Circonus Inside environments can use this option. Instead, the system monitor has a local output option. 

Run the system monitor with `-l` to generate a local output that can be used internally.

## General Output

The following list will help to interpret the system monitor outputs. The Circonus team is always adding new values to the system monitor HTTPtrap check, so this list is not exhaustive. Users can also create their own content groups and rules and receive alerts based on these new values.

The first part of the name for each output is the role, the second is the machine, the last is the metric name.

**Note:**
> If the json is run locally, then names of the output values won't exactly match this list, because these names are based on the json format.

In general, when reviewing the system monitor output, look for the following important values:

 * Any metric that ends in "`error" - Errors are always important and nothing should be in an error state unless something is down.  We recommend using a rule that will trigger an alert if it ever matches regex \w. This will catch nearly all the issues where Circonus Inside alerting is down because each components in that path will output a "Could not talk to..." error.

 * `alert_management brokers_in_maintenance` and `full_system_maintenance` - We recommend alerting if either of these values are ever greater than (>) 0. The brokers in maintenance may need to be modified over time if a broker is down for a long period, but the full system should always show a value of 0. The `brokers_in_maintenance` value will also correlate to the `disconnected_brokers` value.

 * MQ metrics showing messages ready - These messages will build up if the system stops reading the messages. Ideally, they should mostly be set to 0, but periodically few may appear in the output depending on the timings of what is reading them and when they are checked. Users can experiment with them to decide what are acceptable values and what values should trigger an alert.

 * The DB error_log metrics - These metrics are less straight forward in Circonus Inside than those in place in Circonus SaaS. In Circonus Inside, these metrics will not return to 0 after they increment, so they are better served as a counter value. If these values appear in the output, check the `circonus.errors` table in the DB. Inside Users may need to send these outputs to support@circonus.com for assistance.

### Outputs List

```
 * alert_management`machinename`brokers_in_maintenance

 * alert_management`machinename`full_system_maintenance

 * alert_management`error

 * data_storage`machinename`histogram_gets

 * data_storage`machinename`histogram_puts

 * data_storage`machinename`max_peer_lag

 * data_storage`machinename`nnt_gets

 * data_storage`machinename`nnt_puts

 * data_storage`machinename`text_gets

 * data_storage`machinename`text_puts

 * data_storage`machinename`version

 * data_storage`error

 * data_storage`nodes_down

 * db`error

 * db`error_log`severity_1

 * db`error_log`severity_2

 * db`error_log`severity_3

 * db`error_log`severity_4

 * db`error_log`severity_5

 * event_processor`machinename`events_processed

 * event_processor`machinename`isleader

 * event_processor`machinename`leader

 * event_processor`machinename`microseconds_processed

 * event_processor`error

 * mq`bert-email-bot`messages_ready

 * mq`bert-http-bot`messages_ready

 * mq`bert-pagerduty-bot`messages_ready

 * mq`bert-sms-bot`messages_ready

 * mq`bert`messages_ready

 * mq`error

 * mq`messages_ready_total

 * search`machinename`clusterGroverC

 * search`machinename`nodes

 * search`clusters`GroverC1`nodes

 * search`error

 * search`nodes_down

 * stratcon`machinename`disconnected_brokers

 * stratcon`disconnected_brokers

 * stratcon`error
```
