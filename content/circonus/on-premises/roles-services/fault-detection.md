---
title: Fault Detection
weight: 60
---

## Fault Detection {#FaultDetection}
Fault detection is handled by a Java service named `circonus-ernie`.  This process listens on ports 43191 and 8092.  Along with event detection, the fault detection machines function as a "composite check" broker as well.  Port 43191 is connected to by [stratcons](/circonus/on-premises/roles-services/stratcon) and web servers to collect composite data and configure the checks.  Port 8092 is a web REST port that exposes internal metrics such as events seen, rules processed, and troubleshooting for rules and composite data.

Logs reside in `/var/log/circonus`. The current log files are:

 * `ernie.log`
 * `ernie-fire.log`
 * `ernie-debug.log`

The `ernie-fire` and `ernie-debug` logs are sometimes used to help Support determine the state of the system should a problem arise.  The fire logs show state transitions for metrics between "alert" and "cleared" statuses.  The debug log currently shows how long it took to process a given metric.

The REST server has 3 major endoints:

 * http://host:8092/resmon shows an overview of internal data and is used by Circonus to help monitor itself.  The core section shows uptime, leadership status, and CPU time.  "Faultrules" shows how many rules have been processed since the service has been up, and "firehose" shows how many messages have passed through the system.

 * http://host:8092/admin/rules/<account_id>/<check_uuid>/<metric_name> shows the currently defined rulesets for a given metric.  To determine the account_id, visit the admin interface and search for the account in question.  For the check_uuid, run the following command in the web database using the ID from the URL in the web UI:
```
select check_uuid from circonus.checks where check_id = <ID>;
```

 * http://host:8092/composite/<check_uuid> gives a breakdown of the composite equation and what the current value is. As with the check_uuid in the previous step, the composite UUID can be gathered with the same query using the ID from the web UI.


### Fault Detection PKI Files {#FaultDetectionPKIFiles}
 * `/opt/circonus/etc/ernie/ca.crt`
 * `/opt/circonus/etc/ernie/ernie.crt`
 * `/opt/circonus/etc/ernie/ernie.key`

**Note:**
>Java does not make use of the individual files directly; instead it uses the"keystore" file.  If this file does not exist, refer to the [install manual](/circonus/on-premises/installation/installation) and rerun `run-hooper` on this node.


### Fault Detection Troubleshooting {#FaultDetectionTroubleshooting}
When troubleshooting a fault detection problem, you need to compare the logs and output from the fault detection service with the [notification system](/circonus/on-premises/roles-services/notifications).  The notification service will have logs of each message it received from fault detection. If you do not see an entry there, you can contact Support (support@circonus.com) for assistance with further troubleshooting.

Upon a service restart, the fault detection system will dump to the notification system the current state of all metrics for which it has rules.  If there was an issue with the fault detection system, a restart is recommended.

If Fault Detection is stuck in maintenance mode after a Data Center Failover, check the logs for ernie and refer to the [JLOG error troubleshooting](/circonus/on-premises/roles-services/fault-detection#JLOGErrorTroubleshooting) instructions below.



### JLOG Error Troubleshooting {#JLOGErrorTroubleshooting}

#### JLOG_ERR_META_OPEN {#JLOG_ERR_META_OPEN}
If Fault Detection is stuck in maintenance mode after a Data Center Failover, check the logs for ernie. You may see a message like this:

```
[main]: com.omniti.labs.jlog$jlogIOException: JLOG_ERR_META_OPEN
com.omniti.labs.jlog$jlogIOException: JLOG_ERR_META_OPEN
        at com.omniti.labs.jlog.open_writer(Native Method)
        at net.circonus.ernie.ErnieJournal.getWriter(ErnieJournal.java:82)
        at net.circonus.ernie.ErnieJournal.selfReport(ErnieJournal.java:65)
        at net.circonus.ernie.Ernie.<init>(Ernie.java:215)
        at net.circonus.ernie.Ernie.main(Ernie.java:349)
```

Check the `/var/log/circonus/ernie-feed.jlog/` directory. If the "metastore" file is missing, empty, or otherwise malformed, this indicates that the file was created incorrectly.

If there are multiple data files, that would have hex filenames like:
```
00000009
0000000a
0000000b
...
```

Then you should repair your metastore file like so.  In this command we will use the filename that is the most recent, in the above list that would be b.

```
perl -e 'print pack("IIII", 0xLATEST_FILE_HERE, 4*1024*1024, 1, 0x663A7318);' > metastore
```

If there are no data files or just one that is small, you can delete the 
`/var/log/circonus/ernie-feed.jlog/` directory and start `ernie:default` to recreate it.



### Composite Check Troubleshooting {#CompositeCheckTroubleshooting}

Composite checks are run on the fault detection nodes.  Stratcon connects to this node and treats it as a broker, so some typical broker troubleshooting (see that section) may be needed if the composite shows as down or disconnected.

If you have a composite check that appears to be configured correctly yet you are not seeing data, you can go to the fault detection node in a browser to see the raw details of what it believes the check looks like:

```
http://FAULT_DETECTION_NODE_ADDRESS:8092/composite/CHECK_UUID
```

Note that you need to provide the UUID which can be found either in the UI or the API.

If you believe that composites are not processing at all, you can look at:

```
http://FAULT_DETECTION_NODE_ADDRESS:8092/composite/queue
```

To see the current check being processed and if the queue is "stuck".

If you have questions on the output, please contact support@circonus.com
