## Installing on OmniOS {#InstallingonOmniOS}
Perform each of the following procedures to install Circonus on OmniOS:

 1. Install [OmniOS](/InstallOmnios.md#InstallOmniOS).
 1. Apply additional [system tuning settings](/InstallOmnios.md#ApplyTuning).
 1. Make a [ZFS dataset](/InstallOmnios.md#MakeaZFSdatasetavailable) available.
 1. Add [IPS publishers](/InstallOmnios.md#AddIPSPublishers).
 1. Install [Hooper](/InstallOmnios.md#InstallHooper).

Procedures for each of these steps are described in the subsections below.

Once these procedures are complete, proceed to the [General Installation](/InstallGeneral.md) section and follow the steps there.


### Install OmniOS {#InstallOmniOS}
Provide a default installation of OmniOS r151014 from installation media or a network install via Kayak.  Ensure that the IPS repositories at `pkg.omniti.com` are network accessible from the machine.

Installation in OmniOS ipkg zones is fully supported and generally recommended for most installations. You should work with Circonus Support (support@circonus.com) to help design your Circonus Inside deployment topology, as that topology can vary significantly depending on intended use and utilization levels.


### Apply Tuning {#ApplyTuning}
Append the following lines to `/etc/system` in the global zone:
```
* Begin Circonus
set hires_tick=1
set pcplusmp:apic_panic_on_nmi=1
set ibft_noprobe=1
set noexec_user_stack=1
set noexec_user_stack_log=1
set rlim_fd_cur=1024
set idle_cpu_no_deep_c=1
set ip:ip_squeue_fanout=1
set dump_plat_mincpu=0
set dump_bzip2_level=1
set apix_enable=0
set dump_metrics_on=1
set pidmax=99999
set dtrace:dtrace_dof_maxsize=0x80000
* End Circonus
```

The system must be rebooted for all of these settings to take effect.


### Make a ZFS dataset available {#MakeaZFSdatasetavailable}
Whether or not you are running a non-global zone, there must be a ZFS data set available for use (delegated to the zone, if within a zone).  Hooper will create the required datasets below the one specified in `site.json` using the `zfs_dataset_base` attribute for the host in the "`machinfo`" section.  

For example, on a zone called "`omnios1`" with a delegated dataset "`data/set/omnios1`" would appear as shown below:
```
"omnios1": {
    "ip_address": "192.168.1.10",
    "zfs_dataset_base": "data/set/omnios1"
}
```   


#### Example Zone {#ExampleZone}
This example creates a zone named `dtwdb` given no zones (or `/zones` mounted) and a single virtual NIC over the e1000g physical interface in the global zone:
```
; zfs create -o mountpoint=/zones data/zones
; zfs create data/set
; zfs create data/set/dtwdb
; dladm create-vnic -l e1000g0 dtwdb0
; zonecfg -z dtwdb <<EOF
create -b
set zonepath=/zones/dtwdb
set brand=ipkg
set autoboot=true
set limitpriv=default,dtrace_proc,dtrace_user
set ip-type=exclusive
add net
set physical=dtwdb0
end
add dataset
set name=data/set/dtwdb
end
EOF
; zoneadm -z dtwdb install
; zoneadm -z dtwdb boot
; zlogin -C dtwdb

 ... normal systems configuration ensues ...
```


### Add IPS Publishers {#AddIPSPublishers}
Run the following command to add the Circonus IPS publisher:
```
pkg set-publisher -g http://updates.circonus.net/omnios/r151014/ circonus
```


### Install Hooper {#InstallHooper}
Run the following command to install Hooper:
```
pkg install field/hooper
```

Once this is complete, proceed to the [General Installation](/InstallGeneral.md) section and follow the steps there.
