---
title: Stratcon
weight: 110
---

## Stratcon {#Stratcon}
The stratcon role consists of a C application: `circonus-stratcon`


### `circonus-stratcon` {#circonus-stratcon}
Stratcon is the aggregation point of all data coming from [brokers](/Roles/broker).  This service reaches out to each active and configured broker, makes itself a subscriber of the journaled data, and receives it as it is collected.

When data is received, it is again written to disk, as well as fed over the [Message Queue (MQ)](/Roles/mq) to the [fault detection](/Roles/fault_detection) and [streaming](/Roles/web_stream) services.

Like the broker, stratcon has 2 processes: a parent and child.  If the child does not heartbeat, the parent is the watchdog and will restart it.

Stratcon keeps a few logs files. Most of these files can be ignored despite their imposing names. Logs are kept in `/var/log/circonus` and the list of logs is as follows:

 * `stratcon.log` - General purpose log
 * `stratcon-access.log` - Logs any requests received over SSL port 43191
 * `stratcon-bad.data` - Can be ignored unless otherwise advised by Support.
 * `stratcon-data-error.log` - Like `bad.data`, can be ignored

Stratcon also has an interactive console similar to the broker.  This console
can be reached by telnetting to localhost port 32324.  The most commonly used
command in this mode is:
```
show noits
```

This command shows the current status of connected brokers.

Stratcon can be sensitive to IO and CPU starvation.  If you discover the child process is continually being restarted, check these resources.  Contact Support (support@circonus.com) if the problem persists.


#### Stratcon PKI Files {#StratconPKIFiles}
 * `/opt/noit/prod/etc/ca.crt`
 * `/opt/noit/prod/etc/stratcon.crt`
 * `/opt/noit/prod/etc/stratcon.key`
 * `/opt/noit/web/stratcon/pki/ca.crl`


### Broker - Stratcon Connectivity Troubleshooting {#Broker-StratconConnectivityTroubleshooting}
These procedures should help if a stratcon machine connects to and pulls data from the broker, but is not able to retrieve the data. If this problem manifests, a storage feed would be disconnected on the brokers page, but the alert feed would be unaffected.

First, verify that there is no issue with PKI connectivity. If this is not an issue, then it is possible that the stratcon machine is stuck requesting and waiting for data that is not available on the broker due to a missing file.

Run this command on the Broker to view the stratcon connections in the jlog:
```
/opt/circonus/bin/jlogctl -s /opt/noit/prod/log/noitd.feed/
```

This log will tell you about the various stratcon connections to the broker and help you to locate them in the feed. The output should look something like this:
```
[root@example noitd]# /opt/circonus/bin/jlogctl -s /opt/noit/prod/log/noitd.feed/
/opt/noit/prod/log/noitd.feed/
           stratcon-machine105 @ 000027f1:00000094
           stratcon-machine010 @ 0000020e:000000dc
                       ~0000003 @ 000027f2:00000060
                       ~0000004 @ 000027f2:00000060
[root@example noitd]# /opt/circonus/bin/jlogctl -s /opt/noit/prod/log/noitd.feed/
/opt/noit/prod/log/noitd.feed/
           stratcon-machine105 @ 000027f2:00000000
           stratcon-machine010 @ 0000020e:000000dc
                       ~0000003 @ 000027f2:00000077
                       ~0000004 @ 000027f2:00000081
```

The values after the "@" for each stratcon are the filename and the point in the file where the stratcon is to read its next piece of data.  For the stratcon that is behind, verify the existence of the file it is trying to read (0000020e in our example), by running this command:

```
ls -lh /opt/noit/prod/log/noitd.feed/0000020e
```

If the file is missing, run this command and look for the oldest file:
```
ls -lat /opt/noit/prod/log/noitd.feed/ | tail
```

The oldest file name should be "newer" than the file we were looking for in the previous step (using hexidecimal counting).  With this filename, we will need to rebuild the checkpoint file that the broker uses to keep track of what data is sent to stratcon.

The checkpoint file to rebuild is the file named cp.<hex encoded stratcon name> to get the hex encoded name run this command:

```
perl -e 'print unpack("H*", "<stratcon name here>")."\n"'
```

In our example of `stratcon-machine010`, that command yields this result: 7374726174636f6e2d6d616368696e65303130

Lastly, we will rebuild the checkpoint file using the output of the previous few commands, taking the oldest remaining file and the checkpoint file name.  The template of the command is this:
```
sudo perl -e 'print pack("II", 0x<file id>,0);' > /opt/noit/prod/log/noitd.feed/cp.<value>
```

For example, if the end of the output from "`ls -lat /opt/noit/prod/log/noitd.feed/ | tail`" looked like this:
```
-rw-r----- 1 root root    7648 Jul  7 17:08 00000210.idx
-rw-r----- 1 root root 4266881 Jul  7 17:08 00000210
-rw-r----- 1 root root       8 Jul  7 17:00 cp.7374726174636f6e2d6d616368696e65303130
drwxr-xr-x 3 root root    4096 Jul  2 20:30 ..
```

Then the command to rebuild the checkpoint file should look like this:
```
sudo perl -e 'print pack("II", 0x00000210,0);' > /opt/noit/prod/log/noitd.feed/cp.7374726174636f6e2d6d616368696e65303130
```

Once this new file is in place, stratcon will begin pulling down data from the new checkpoint the next time stratcon connects.
