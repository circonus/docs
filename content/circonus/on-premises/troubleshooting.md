---
title: Troubleshooting
weight: 130
---

# Troubleshooting {#Troubleshooting}
This section contains general instructions for troubleshooting various issues. 

If instructions in this manual do not resolve an issue, contact Circonus Support (support@circonus.com) for further assistance. Also, see the [Technical Support](/TechSupport) section.

**Note:**
>Each section in this manual under "Roles & Services" includes notes on troubleshooting procedures specific to that role, and on how to find log files that can assist with troubleshooting.
 * [Broker Statuses](/Roles/broker#BrokerStatuses)
 * [Fault Detection Troubleshooting](/Roles/fault_detection#FaultDetectionTroubleshooting)
 * [JLOG Error Troubleshooting](/Roles/fault_detection#JLOGErrorTroubleshooting)
 * [Troubleshooting Alerts](/Roles/notification#TroubleshootingAlerts)
 * [Node Connectivity Troubleshooting](/Roles/search#NodeConnectivityTroubleshooting)
 * [Broker-Stratcon Connectivity Troubleshooting](/Roles/stratcon#Broker-StratconConnectivityTroubleshooting)


## PKI Connectivity Troubleshooting {#PKIConnectivityTroubleshooting}
The following roles make use of SSL to communicate:

 * [api](/Roles/api)
 * [broker](/Roles/broker)
 * [fault_detection](/Roles/fault_detection)
 * [hub](/Roles/hub)
 * [stratcon](/Roles/stratcon)
 * [web_frontend](/Roles/web_frontend)
 * [web_stream](/Roles/web_stream)

In each role's section the Operations Manual, you can find details on where the keys and certificates are located.  Once you have those locations, troubleshooting an SSL connection can proceed.

 * If for any reason you are not receiving certificates, either when installing Circonus or when adding new services or brokers, try restarting the `circonus-ca_processor` service. This should cause the service to sign any pending CSRs and then begin listening again for new entries.

 * Verify that all the necessary keys and certificates exist.  These will be `ca.crt`, `<application>.crt`, and `<application>.key`. If any are missing, refer to the [install manual](https://login.circonus.com/resources/docs/inside/InstallGeneral.html#InitialInstallation) and run `run-hooper` again on this node.

 * Verify that the `ca.crt` matches what is provided by your CA.  To do this, log into the CA machine and look at `/opt/circonus/CA/public-info/ca.crt`.

 * Verify that the certificate was signed by the CA by using the following command:
  * `openssl verify -CAfile /path/to/ca.crt /path/to/application.crt`

 * Verify that the key matches the certificate. If the following two commands don't output the same value, there is a mismatch:
  * `openssl x509 -noout -modulus -in /path/to/application.crt | openssl md5`
  * `openssl rsa -noout -modulus -in /path/to/application.key | openssl md5`

 * Verify connectivity with the  s_client using the following command:
  * `openssl s_client -connect host:port -CAfile /path/to/ca.crt -cert /path/to/application.crt -key /path/to/application.key`

If any of the above commands fail for non-obvious reasons, contact Circonus Support (support@circonus.com) about how to resolve the issue.


## Check Troubleshooting {#CheckTroubleshooting}
In the event that a check is not returning data when you believe it should, the following steps should be taken:

 1. Verify the running status of the check on the broker by following these steps:
  1. Navigate to the "Check Details" page on the UI and click the "Extended Details" link in the upper left section of the page. Record the UUID shown there.
  1. Log onto the broker machine and telnet to port 32322 using this command: `telnet localhost 32322`
  1. Show the status of the check by typing this command, using the UUID from Step 1: `show check <UUID>`
 1. If the check is a database query, JMX, SNMP, or LDAP check, verify that the [jezebel](/Roles/broker#Jezebel) service is up and running on the broker machine.  Jezebel is the service on the broker that these check types run through.
 1. If the check is getting an error, such as a refused connection or a timeout, verify the connectivity of the broker to the machine in question using system tools like telnet, curl, etc.
 1. If all these steps are showing the check should be working, collect the network traffic to and from the broker for inspection. If possible, you can use a tool like tcpdump or snoop to collect this network traffic.


## Snowth Troubleshooting {#SnowthTroubleshooting}

### Repairing Corrupt LevelDB Data Stores {#RepairingCorruptLevelDBDataStores}
On occasion, a LevelDB database may become corrupted.

You should be able to determine which log is corrupted by looking at the
errorlog (usually in /snowth/logs/errorlog). It will tell you what
has been corrupted. To fix it, follow the instructions below.


#### 1. Disable snowthd. {#1.Disablesnowthd.}
Before you start, you will need to disable snowthd with the following command:
 * EL7: `sudo systemctl stop circonus-snowth`
 * OmniOS: `sudo svcadm disable snowth`

#### 2a. Correct corrupted text data. {#2a.Correctcorruptedtextdata.}
There are two DBs that can become corrupted in the text db - the metrics store (a list of metrics) and the changelog (all of the different text values for a metric).

To correct the metrics store, run the following:
```
sudo /opt/circonus/sbin/snowthd -u nobody -g nobody \
  -r text/metrics \
  -i <id of snowth node in topology> \
  -c /opt/circonus/etc/snowth.conf
```

To correct the changelog, run the the following:
```
sudo /opt/circonus/sbin/snowthd -u nobody -g nobody \
  -r text/changelog \
  -i <id of snowth node in topology> \
  -c /opt/circonus/etc/snowth.conf
```


#### 2b. Correct corrupted histogram data. {#2b.Correctcorruptedhistogramdata.}
For histogram data, the metrics db (a list of all available histogram metrics) or the actual data (which is stored based on the period) can become corrupted.

To fix the metrics database, run the following:
```
sudo /opt/circonus/sbin/snowthd -u nobody -g nobody \
  -r hist/metrics \
  -i <id of snowth node in topology> \
  -c /opt/circonus/etc/snowth.conf
```

To fix the actual data, run the following:
```
sudo /opt/circonus/sbin/snowthd -u nobody -g nobody \
  -r hist/<period> \
  -i <id of snowth node in topology> \
  -c /opt/circonus/etc/snowth.conf
```


#### 3. Renable snowthd. {#3.Renablesnowthd.}
Once finished, you will need to renable snowthd with the following commands:
 * EL7: `sudo systemctl start circonus-snowth`
 * OmniOS: `sudo svcadm enable snowth ; sudo svcadm clear snowth`
