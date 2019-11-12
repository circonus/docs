## System Requirements {#SystemRequirements}
See [System Sizing](/InstallSizing.md) for details on CPU, RAM, and storage requirements for each role.


### Operating Systems {#OperatingSystems}


#### Circonus Enterprise Broker {#CirconusEnterpriseBroker}
The Circonus Enterprise Broker is supported on the following platforms:

 * RHEL/CentOS 6 64-bit
 * RHEL/CentOS 7 64-bit
 * OmniOS r151014


#### Data Storage {#DataStorage}
The Circonus Data Storage component is supported on the following platforms:

 * RHEL/CentOS 7 64-bit
 * OmniOS r151014


#### All Other Components {#AllOtherComponents}
All other core system components are supported on the following platforms:

 * RHEL/CentOS 6 64-bit
 * RHEL/CentOS 7 64-bit
 * OmniOS r151014


## Pre-Installation Checklist {#Pre-InstallationChecklist}
Please ensure that the systems designated to run Circonus components have the following configuration completed before installing Circonus software:
 * IP address and default route
 * DNS resolution for the system
 * A DNS entry, "mailhost", in the default domain or one of the configured search domains, that resolves to the IP address of an SMTP relay that will relay mail for the Circonus component systems
 * System clock up to date and kept synced with NTP, however:
   * On OmniOS, this is done in the global zone only, and is not needed in each non-global zone.


## System Files Modified {#SystemFilesModified}
The following non-Circonus system files are typically modified or overwritten by Circonus Inside.  The Circonus Enterprise Broker does not modify any system files.


### CentOS/RHEL {#CentOSRHEL}
The following CentOS/RHEL system files are modified or overwritten by Circonus Inside:
```
/etc/hosts
```


### OmniOS {#OmniOS}
The following OmniOS system files are modified or overwritten by Circonus Inside:
```
/etc/inet/hosts
/etc/mail/aliases
/etc/mail/cf/cf/sendmail.mc
/etc/syslog.conf
```
