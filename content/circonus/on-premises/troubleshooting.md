---
title: Troubleshooting
weight: 130
---

# Troubleshooting

This section contains general instructions for troubleshooting various issues. 

If instructions in this manual do not resolve an issue, contact Circonus Support (support@circonus.com) for further assistance. Also, see the [Technical Support](/circonus/appendix/tech-support) section.

**Note:**
>Each section in this manual under "Roles & Services" includes notes on troubleshooting procedures specific to that role, and on how to find log files that can assist with troubleshooting.
 * [Broker Statuses](/circonus/on-premises/roles-services/broker#broker-statuses)
 * [Fault Detection Troubleshooting](/circonus/on-premises/roles-services/fault-detection#FaultDetectionTroubleshooting)
 * [JLOG Error Troubleshooting](/circonus/on-premises/jlog#troubleshooting)
 * [Troubleshooting Alerts](/circonus/on-premises/roles-services/notifications#troubleshooting-alerts)
 * [Broker-Stratcon Connectivity Troubleshooting](/circonus/on-premises/roles-services/stratcon#broker---stratcon-connectivity-troubleshooting)

## PKI Connectivity Troubleshooting

The following roles make use of SSL to communicate:

 * [api](/circonus/on-premises/roles-services/api)
 * [broker](/circonus/on-premises/roles-services/broker)
 * [fault-detection](/circonus/on-premises/roles-services/fault-detection)
 * [hub](/circonus/on-premises/roles-services/hub)
 * [stratcon](/circonus/on-premises/roles-services/stratcon)
 * [web-frontend](/circonus/on-premises/roles-services/web-frontend)
 * [web-stream](/circonus/on-premises/roles-services/web-stream)

In each role's section the Operations Manual, you can find details on where the keys and certificates are located.  Once you have those locations, troubleshooting an SSL connection can proceed.

 * If for any reason you are not receiving certificates, either when installing
   Circonus or when adding new services or brokers, check the status of the
   `circonus-ca_processor` service on the host in the `ca` service role. This
   service watches the Postgres database for PKI-related tasks, and automatically
   renews certificates and the CRL in advance of their expiration. Certificates
   are stored in Postgres as well as on the local filesystem. Restarting the
   service will cause it to sign any pending certificate signing requests
   (CSRs) and then begin listening again for new entries.
 * Verify that all the necessary keys and certificates exist.  These will be
   `ca.crt`, `<application>.crt`, and `<application>.key`. If any are missing,
   refer to the [install manual](/circonus/on-premises/installation/installation#initial-installation)
   and run `run-hooper` again on this node, optionally with `-m` to prevent
   upgrading any packages.
 * Verify that the `ca.crt` matches what is provided by your CA.  To do this,
   log into the CA host and look at `/opt/circonus/CA/public-info/ca.crt`.
 * Verify that the certificate was signed by the CA by using the following command:
   * `openssl verify -CAfile /path/to/ca.crt /path/to/application.crt`
 * Verify that the key matches the certificate. If the following two commands
   don't output the same value, there is a mismatch:
   * `openssl x509 -noout -modulus -in /path/to/application.crt | openssl md5`
   * `openssl rsa -noout -modulus -in /path/to/application.key | openssl md5`
 * Verify connectivity with the following command:
   * `openssl s_client -connect host:port -CAfile /path/to/ca.crt -cert /path/to/application.crt -key /path/to/application.key`
 * If all brokers appear to be disconnected from stratcon, yet everything has
   valid certificates, the issue could be the Certificate Revocation List
   (CRL). Stratcon uses this to ensure that certificates for decommissioned
   brokers can no longer be used to communicate with the core system. The
   ca_processor service automatically generates the CRL with a validity period
   of 30 days. A weekly cron job on stratcon hosts refreshes the CRL. The
   validity of the CRL can be checked with the following command:
   * `openssl crl -in /opt/noit/web/stratcon/pki/ca.crl -noout -nextupdate`
     * If the `nextupdate` date is in the past, Stratcon will refuse to connect
       with any broker. The refresh command is in root's crontab, and you can
       use `sudo crontab -l` to see it. This command may be run at any time.

If any of the above commands fail for non-obvious reasons, contact Circonus Support (support@circonus.com) about how to resolve the issue.

## Check Troubleshooting

In the event that a check is not returning data when you believe it should, the following steps should be taken:

 1. Verify the running status of the check on the broker by following these steps:
  1. Navigate to the "Check Details" page on the UI and click the "Extended Details" link in the upper left section of the page. Record the UUID shown there.
  1. Log onto the broker machine and telnet to port 32322 using this command: `telnet localhost 32322`
  1. Show the status of the check by typing this command, using the UUID from Step 1: `show check <UUID>`
 1. If the check is getting an error, such as a refused connection or a timeout, verify the connectivity of the broker to the machine in question using system tools like telnet, curl, etc.
 1. If all these steps are showing the check should be working, collect the network traffic to and from the broker for inspection. If possible, you can use a tool like tcpdump or snoop to collect this network traffic.

## Snowth Troubleshooting

### Repairing Corrupt LevelDB Data Stores

On occasion, a LevelDB database may become corrupted.

You should be able to determine which log is corrupted by looking at the
errorlog (usually in /snowth/logs/errorlog). It will tell you what
has been corrupted. To fix it, follow the instructions below.

#### 1. Disable Snowthd

Before you start, you will need to disable snowthd with the following command:
 * EL7: `sudo systemctl stop circonus-snowth`

#### 2a. Correct Corrupted Text Data

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

#### 2b. Correct Corrupted Histogram Data

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

#### 3. Renable Snowthd

Once finished, you will need to renable snowthd with the following commands:
 * EL7: `sudo systemctl start circonus-snowth`
