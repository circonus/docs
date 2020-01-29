---
title: Components
weight: 150
---

## Components and Their Purpose {#ComponentsandTheirPurpose}
This section provides a brief overview of each component's role. For pre-installation requirements for each component, refer to the [Networking Requirements](/Networking) and [System Sizing](/circonus/on-premises/installation/getting-started) sections.


### API {#API}
The API service provides a REST-based programming interface for scripts and tools to interact programmatically with the product. See [API sizing](/circonus/on-premises/installation/getting-started#APIsizing).


### CA {#CA}
The CA is responsible for managing the [Public Key Infrastructure (PKI)](/circonus/on-premises/installation/getting-started/#PublicKeyInfrastructurePKI) required by Circonus Inside. Any component that is likely to talk over a hostile network does so over SSL/TLS, requiring both valid client and server credentials. See [CA sizing](/circonus/on-premises/installation/getting-started#CAsizing).


### CAQL Broker {#CAQLBroker}
The CAQL Broker allows for alerting on Circonus Analytics Query Language (CAQL) transforms of incoming metric streams.


### Data Storage {#DataStorage}
[IRONdb&reg;](https://login.circonus.com/resources/docs/irondb/) is a
fault-tolerant, distributed time-series database.  This component manages all
telemetry that is collected.  It powers many features of the overall product,
but most notably the visualizations available via the [Web
Frontend](/circonus/on-premises/components/#WebFrontend). See [Data Storage
sizing](/circonus/on-premises/installation/getting-started#DataStoragesizing).

Please note that while IRONdb&reg; can operate as a standalone TSDB, when it is
operated as part of a full Circonus deployment, it is configured slightly
differently and is only managed through Hooper. There is no need to install any
IRONdb packages yourself.


### Enterprise Broker {#EnterpriseBroker}
The Enterprise Broker is responsible for collecting telemetry from canonical sources. It can actively/synthetically query networked services for information, as well as passively receive telemetry via the network.  All collected telemetry is passed back to the core system via [Stratcon](/circonus/on-premises/components/#Stratcon). See [Enterprise Broker sizing](/circonus/on-premises/installation/getting-started#EnterpriseBrokersizing).

**Note:**
> The Enterprise Broker is provisioned outside of the processes used for provisioning Circonus Inside.


### Fault Detection {#FaultDetection}
The Fault Detection component is the online, complex-event processing engine. It is responsible for interpreting all telemetry data in real-time and detecting  anomalous behavior. See [Fault Detection sizing](/circonus/on-premises/installation/getting-started#FaultDetectionsizing).


### Hooper {#Hooper}
Hooper is the built-in configuration management system.  It is responsible for initial configuration and installation of all other components, as well as most ongoing maintenance tasks.  Hooper runs on all Circonus Inside systems except the [Enterprise Broker](/circonus/on-premises/components/#EnterpriseBroker). Hooper has no special sizing requirements.


### Hub {#Hub}
The Hub is responsible for many ongoing operational tasks.  It runs several daemons and scheduled jobs that perform routine maintenance operations. See [Hub sizing](/circonus/on-premises/installation/getting-started#Hubsizing).


### Long-tail Store {#Long-tailStore}
The Long-tail Store is nothing more than a dumping zone for all the raw telemetry data collected.  It can be used to reconstruct [Data Storage](/circonus/on-premises/components/#DataStorage) or do out-of-band analysis on raw data. It is also the easiest source from which to backup raw measurement data. Retention of this data is left up to the operator. The Long-tail Store data may be deleted without any ill-effect on regular system usage. See [Long-tail Store sizing](/circonus/on-premises/installation/getting-started#Long-tailStoresizing).


### MQ {#MQ}
Message Queue (MQ) is the brokered message queuing infrastructure over which many components communicate. See [MQ sizing](/circonus/on-premises/installation/getting-started#MQsizing).


### Notification {#Notification}
The Notification component is the case management system.  Given the overall state of the system, it combines metadata about the telemetry streams and [Fault Detection](/circonus/on-premises/components/#FaultDetection) outputs regarding anomalous behavior to open cases (alerts) and notify interested parties. See [Notification sizing](/circonus/on-premises/installation/getting-started#Notificationsizing).


### Stratcon {#Stratcon}
Stratcon is responsible for accepting brokered telemetry and distributing it to all components.  It stores processed data in [Data Storage](/circonus/on-premises/components/#DataStorage), publishes data in real-time to other system components via [MQ](/circonus/on-premises/components/#MQ), and journals raw data back to [Long-tail Storage](/circonus/on-premises/components/#Long-tailStore). See [Stratcon sizing](/circonus/on-premises/installation/getting-started#Stratconsizing).


### Web DB {#WebDB}
Web DB is a relational database (PostgreSQL) that stores all metadata for Circonus Inside.  This includes user, account, configuration, graph, and worksheet information.  All information, aside from the data itself (stored in [Data Storage](/circonus/on-premises/components/#DataStorage)), is held in Web DB. See [Web DB sizing](/circonus/on-premises/installation/getting-started#WebDBsizing).


### Web Frontend {#WebFrontend}
Web Frontend is the browser-based portal through which the product is regularly used. See [Web Frontend sizing](/circonus/on-premises/installation/getting-started#WebFrontendsizing).


### Web Stream {#WebStream}
The Web Stream component is responsible for out-of-band, real-time streaming of telemetry data for the "play" feature in graphs and dashboards. See [Web Stream sizing](/circonus/on-premises/installation/getting-started#WebStreamsizing).
