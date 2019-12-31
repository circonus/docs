## System Sizing {#SystemSizing}
There are three aspects of system sizing that this document will address:

 1. CPU requirements
 1. Memory (RAM) requirements
 1. Permanent storage requirements

These aspects vary for each component.  Some components are better suited for virtualization than others; components that should be run on physical hardware will be noted as such.

Unless otherwise specified, disk storage shall be of adequate redundancy (RAID10 on Linux or ZFS mirrors on OmniOS) at a minimum of 7200 RPM (for spinning media) and CPU cores should be a minimum of 2GHz.

Refer to the [Networking Requirements](/Networking.md) section for inter-component communications.


### API sizing {#APIsizing}
The [API](/Components.md#API) component requires:
 * 4 CPU cores
 * 8 Gbytes of RAM
 * 40 Gbytes of disk storage


### CA sizing {#CAsizing}
The [CA](/Components.md#CA) component requires:
 * 1 CPU core
 * 2 Gbytes of RAM
 * 10 Gbytes of disk storage


### Data Storage sizing {#DataStoragesizing}
The [data storage](/Components.md#DataStorage) component (IRONdb&reg;) requires
multiple machines and has the most significant storage requirements.  Each node
should meet the following specifications:

 * 16 CPU cores
 * 256 Gbytes of RAM
 * 320 Gbytes of disk storage for OS install
 * *Should be run on bare metal or OmniOS zone*
 * [Metric storage requirements](https://login.circonus.com/resources/docs/irondb/cluster-sizing.html)

### Enterprise Broker sizing {#EnterpriseBrokersizing}
The [Enterprise Broker](/Components.md#EnterpriseBroker) component requires:
 * 2 CPU cores
 * 4 Gbytes of RAM
 * 40 Gbytes of disk storage


### Fault Detection sizing {#FaultDetectionsizing}
The [Fault Detection](/Components.md#FaultDetection) component requires:
 * 4 CPU cores
 * 16 Gbytes of RAM
 * 20 Gbytes of disk storage


### Hooper sizing {#Hoopersizing}
[Hooper](/Components.md#Hooper) runs on each system to manage installation and configuration tasks. It has no specific sizing requirements above and beyond the components it is installing.


### Hub sizing {#Hubsizing}
The [Hub](/Components.md#Hub) component requires:
 * 1 CPU core
 * 2 Gbytes RAM
 * 20 Gbytes of disk storage


### Long-tail Store sizing {#Long-tailStoresizing}
The [Long-tail Store](/Components.md#Long-tailStore) component requires:
 * 2 CPU cores
 * 8 Gbytes of RAM
 * Disk storage requirements (see below):

Each check performed collects an arbitrary number of metrics, so the storage required varies with metric counts.  For example, storing data from a broker with an average of 5 metrics per check requires approximately 120 bytes per check performed. On a broker with an average of 185 metrics per check, it requires approximately 3400 bytes per check performed.  Assuming each check is performed once per minute, we can extrapolate storage requirements.

![Image: 'ltstore-size-per-avemetric.jpg'](/images/circonus/ltstore-size-per-avemetric.jpg)

**Legend:**
```
y-axis - Shows the number of bytes required per check run
x-axis - Shows the number of metrics collected during the check run
```

Long-tail storage can be used to reconstruct Data Storage or to do out-of-band analysis on raw data.  It is also the easiest source from which to backup raw telemetry data.  Retention of this data is left up to the operator.  This data can be deleted without any ill effect on regular system usage.


#### Long-tail Store Examples {#Long-tailStoreExamples}
Here are two examples of Long-tail Store sizing extrapolated:
  1. If one were to perform 30 checks per minute with an average of 185 metrics collected per check, the system would store approximately 150 Mbytes of raw data per day.
  1. If one were to perform 860 checks per minute with an average of 5 metrics collected per check, the system would store approximately 150 Mbytes of raw data per day.


### MQ sizing {#MQsizing}
The [MQ](/Components.md#MQ) component requires:
 * 2 CPU cores
 * 8 Gbytes of RAM
 * 20 Gbytes of disk storage


### Notification sizing {#Notificationsizing}
The [Notification](/Components.md#Notification) component requires:
 * 1 CPU core
 * 4 Gbytes of RAM
 * 20 Gbytes of disk storage


### Stratcon sizing {#Stratconsizing}
The [Stratcon](/Components.md#Stratcon) component requires:
 * 4 CPU cores
 * 32 Gbytes of RAM
 * 80 Gbytes of disk storage
 * *Should be run on bare metal or OmniOS zone*


### Web DB sizing {#WebDBsizing}
The [Web DB](/Components.md#WebDB) component requires:
 * 8 CPU cores
 * 64 Gbytes of RAM
 * 200 Gbytes of disk storage
 * *Should be run on bare metal or OmniOS zone*


### Web Frontend sizing {#WebFrontendsizing}
The [Web Frontend](/Components.md#WebFrontend) component requires:
 * 4 CPU cores
 * 8 Gbytes of RAM
 * 40 Gbytes of disk storage


### Web Stream sizing {#WebStreamsizing}
The [Web Stream](/Components.md#WebStream) component requires:
 * 1 CPU core
 * 4 Gbytes of RAM
 * 10 Gbytes of disk storage
