## Networking Requirements {#NetworkingRequirements}
This section documents protocols for the various inter-component communications. The following information assumes a flat layer-2 topology (a single broadcast domain). If your planned deployment has different requirements, please contact Circonus Support (support@circonus.com).

External internet access may or may not be required for some components, depending on your setup. See below.


### Legend {#Legend}
Values are shown as `IP:protocol:source_port:destination_port`.

Blank leading fields are elided.

The protocol is shown as either "T" for TCP or "U" for UDP.

If `source_port` is not defined, it is an ephemeral port.


### Connection Matrix {#ConnectionMatrix}

| To &rarr;<br>&darr; From | [API](/Components.md#API) | [CA](/Components.md#CA) | [CAQL Broker](/Components.md#CAQLBroker) | [Data Storage](/Components.md#DataStorage) | [Enterprise Broker](/Components.md#EnterpriseBroker) | [Fault Detection](/Components.md#FaultDetection) | [Hub](/Components.md#Hub) | [Long-tail Store](/Components.md#Long-tailStore) | [MQ](/Components.md#MQ) | [Notification](/Components.md#Notification) | [Stratcon](/Components.md#Stratcon) | [Web DB](/Components.md#WebDB) | [Web Frontend](/Components.md#WebFrontend) | [Web Stream](/Components.md#WebStream) | **Outside** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [API](/Components.md#API) | N/A | | | T::8112 | T::43191 | T::43191 | | | | | | T::5432 | T::11211 T::80 | | |
| [CA](/Components.md#CA) | | N/A | | | | | | | | | | T::5432 | | | |
| [CAQL Broker](/Components.md#CAQLBroker) | T::8080 | | N/A | T::8112 | | | | | T::8765 | | | | | | |
| [Data Storage](/Components.md#DataStorage) | | | | T::8112 U:8112:8112 | | | | | | | | | | | |
| [Enterprise Broker](/Components.md#EnterpriseBroker) | | | | | N/A | | | | | | | | T::80 | | \*:\*:\*:\* |
| [Fault Detection](/Components.md#FaultDetection) | | | | T::8112 | | 225.0.1.9:U::8082 | | | T::5672 | | | T::5432 | T::80 | | |
| [Hub](/Components.md#Hub) | | | | T::8112 | T::43191 | | N/A | | T::5672 | | T::43191 | T::5432 | T::80 | T::8126 | |
| [Long-tail Storage](/Components.md#Long-tailStore) | | | | | | | | N/A | | | | | | | |
| [MQ](/Components.md#MQ) | | | | | | | | | T::4369 | | | | | | |
| [Notification](/Components.md#Notification) | | | | | | | | | T::5672 | N/A | | T::5432 | T::80 | | |
| [Stratcon](/Components.md#Stratcon) | | | | T::8112 | T::43191 | | | T::873 | T::5672 | | N/A | | T::80 | | |
| [Web DB](/Components.md#WebDB) | | | | | | | | | | | | T::5432 | | | |
| [Web Frontend](/Components.md#WebFrontend) | | | | T::8112 | T::43191 | T::43191 | | | | | T::43090 T::43191 | T::5432 | T::11211 | T::8126 | |
| [Web Stream](/Components.md#WebStream) | | | | | T::43191 | T::43191 | | | T::5672 | | | T::5432 | T::11211 T::80 | N/A | |
| Outside | T::8080 T::443| | | | U::8125 U::67 U::68 U::25826 T::43191 T::443 T::80 | | | | | | | | T::80 T::443 | T::80 T::9443 | N/A |


### External Internet Access {#ExternalInternetAccess}

External internet access may or may not be required for some components, depending on your setup.

The Web Frontend component requires external internet access if you intend to setup any SSO/OAuth at all for external providers, such as Slack or Google. This is necessary if you intend use cloudwatch checks.

The Notification component requires external internet access if you intend to use SMS alerts or Slack alerts.

Others components could potentially require external internet access depending on special cases, for example if you use public IRC. Please contact Circonus Support (support@circonus.com) for questions about these special cases.

Web frontend:

* slack.com - Slack OAuth setup
   * github.com / api.github.com - GitHub OAuth setup
* accounts.google.com / www.googleapis.com / www.google.com - Google OAuth setup and Google Analytics check configuration
* monitoring.\*.amazonaws.com - Cloudwatch check configuration
* rpm.newrelic.com - NewRelic check configuration
* api.keynote.com - Keynote check configuration
    

Hub:

* trap.noit.circonus.net - Inside monitoring script that reports data to Circonus SaaS for external monitoring of alerting system


Notification:

* slack.com - Slack alerts
* alert.victorops.com - VictorOps alerts
* events.pagerduty.com - PagerDuty alerts
* api.twilio.com - SMS Alerts
* www.smsmatrix.com / usa.bulksms.com:5567 - International SMS alerts
* "X IRC network" - IRC alerts If using public / external server


All hosts:

* circonus.sp.backtrace.io:6098 - Backtrace crash reporting for Circonus engineering
* updates.circonus.net - Circonus package repositories
