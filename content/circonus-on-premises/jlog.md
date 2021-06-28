---
title: JLog
weight: 160
---

# JLog: Journalled Log

[JLog](https://github.com/omniti-labs/jlog) is a durable message queue that
supports multiple publishers and multiple subscribers, and is both multi-thread
and multi-process safe. The basic concept is that publishers can open a log and
write messages to it while subscribers open the log and consume messages from
it. Production and consumption are thus decoupled, providing increased
performance as well as durability in the face of network partitions or service
interruptions.

Circonus uses JLog in a number of places throughout the product. Here is a
non-exhaustive list:
* Enterprise Brokers and CAQL Brokers write collected metric records to a JLog,
  which is consumed by Stratcon.
* IRONdb uses JLog as a write-ahead log in several places:
  * Replicating incoming metrics to cluster peers.
  * Updates to the surrogate database.
  * Activity updates to the surrogate database.
  * Check-tag metadata replication.

## Structure

A JLog takes the form of a directory containing data files (the actual,
journalled data from the application) and metadata files that track the current
subscribers and configuration information, such as the maximum data segment
size.

```
# ls -l /opt/noit/prod/log/noitd.feed/ && /opt/circonus/bin/jlogctl subscriber -j /opt/noit/prod/log/noitd.feed/
-rw-r-----. 1 broker broker  525129 Aug  4 13:01 00000058
-rw-r-----. 1 broker broker    2592 Aug  4 13:01 00000058.idx
-rw-r-----. 1 broker broker       8 Aug  4 13:01 cp.7374726174636f6e2d666933
-rw-r-----. 1 broker broker       8 Aug  4 13:01 cp.7e30303030303033
-rw-r-----. 1 broker broker      16 Aug  4 13:00 metastore
-rw-r-----. 1 broker broker 1048580 Aug  3 21:02 pre_commit
```

### Data Segments

JLog data is stored in binary form, whose internal structure is determined by
the writing application. Writers append to a given file until it reaches the
maximum segment size set for the JLog at its creation, then continue to the
next file in sequence. The naming convention for data files is hexadecimal,
beginning at `00000000` and incrementing by 1 for the life of the JLog. This
provides for `2^32` lifetime segments.

Each data file is accompanied by an index file, with a `.idx` extension. The
index file keeps track of the offsets for each complete message written to the
data file. Readers maintain the index as they consume messages.

Once all active subscribers have consumed all the messages from a given data
file (as denoted by their checkpoints), it and its accompanying index file are
removed.

### Checkpoints

Files beginning with `cp.` are checkpoint files. These maintain the file name
and offset that each subscriber is reading. The name of the checkpoint file is
derived from the subscriber's name. In the case of Enterprise Brokers, each
stratcon host that connects will use its client certificate CN. In the case of
IRONdb, this is often the node's UUID. Checkpoint information can be seen with
the `jlogctl subscriber` command.

```
# /opt/circonus/bin/jlogctl subscriber -j /opt/noit/prod/log/noitd.feed/
	                    stratcon-fi3 @ 00000058:00000144
	                        ~0000003 @ 00000058:00000144
```

This shows that subscriber `stratcon-fi3` is currently reading file `0x58` at
offset `0x144`.

### Metastore

The metastore retains configuration information about the JLog. Among other
things, it tracks the name of the oldest data file, so that new subscribers
know where to start reading. Its contents may be viewed with the `jlogctl meta`
command.

```
# /opt/circonus/bin/jlogctl meta -j /opt/noit/prod/log/noitd.feed/
magic          663a7318
storagelog     00000058
compression    off
safety         metasafe
precommit      1048576
segmentsize    4194304
```

### Precommit Buffer

In some situations it may be advantageous for throughput to reduce write
syscalls through the use of the precommit buffer. A fixed-size file,
`pre_commit`, is mmap-ed and used to hold new writes until the file reaches the
predefined size, or the writer explicitly flushes the buffer. However, readers
will not see any messages from the precommit buffer until they are flushed
(materialized) to a data file. 

## Operations

Operators of applications that use JLog will want to become familiar with the
`jlogctl` command. This is the tool through which one can view and manipulate
aspects of a JLog. It has numerous subcommands to perform different operations,
and in all cases it requires either the current working directory to be an
existing JLog, or the path to a JLog specified with the `-j` option.

**NOTE:** Operations that alter JLog configuration or metadata are not safe to
perform when there are active writers and/or subscribers. If unsure whether a
given operation is safe, err on the side of caution and stop any applications
or services that are utilizing the JLog before proceeding.

### Viewing State

View the current list of subscribers with the `subscriber` subcommand. This is
safe to do at any time.

```
# /opt/circonus/bin/jlogctl subscriber -j /opt/noit/prod/log/noitd.feed/
                        stratcon-fi3 @ 00000058:00000144
                            ~0000003 @ 00000058:00000144
```

Each line of output starts with the subscriber's name, followed by `@`, then a
tuple of the data file name and the byte offset into that file where the
subscriber is currently reading. Both the file name and offset are in
hexadecimal format.

Subscriber names that begin with `~` are _transient_ subscribers. Transient
subscribers always begin reading at the most recent available message and do not
retain a permanent checkpoint. If a transient subscriber disconnects and then
reconnects later, it will miss any messages written in the interim. This is
useful for subscribers that are only concerned about current data, such as the
Alerting feed for a Circonus Enterprise Broker. One would not want "stale" data
to arrive over the alerting feed if a broker is disconnected for some time. By
contrast, a broker's Storage feed must continue where it left off to ensure a
complete record of all metrics gathered by the broker.

### Troubleshooting

JLog is a low-level API, only concerned with reading and writing log messages
and maintaining subscriber state. What the messages _mean_ and the effect of
problems on applications that are writing and/or reading JLog data differ
depending on the specifics of each application's usage. Nevertheless, some
common pathologies exist and JLog's behavior in these situations should inform
the specific troubleshooting steps for a given application.

#### Unusual Filesystem Usage

Writing to a JLog is independent of reading. In a healthy, steady state, there
should not be more than 1-2 data files present, when subscribers are keeping up
with the influx of new messages. If subscribers are not reading fast enough,
data files will accumulate faster than they are being consumed, leading to
increased filesystem usage.

If there are no subscribers reading, writers will continue filling data files
and creating new ones, potentially consuming all available filesystem space. If
you notice increasing filesystem usage in a JLog directory, check that
subscribers are active and making progress by running `jlogctl subscriber` as
noted above. Each successive output should show the filename and/or offset
changing.

A subscriber that is not making any progress may have become disconnected. Make
sure that whatever application should be reading from the JLog is running and
operating correctly. If the subscriber is making progress, but too slowly,
check for resource starvation on the subscriber's end, and ensure that
sufficient network bandwidth exists between the subscriber and the JLog system.

If a subscriber's checkpoint points to a file that does not exist, that
subscriber will stall, and new messages will continue to accumulate in later
files. In this case, it is necessary to repair the JLog. First, stop the
writing application. Next, run `jlogctl repair`, which will scan the directory
for data files and attempt to correct any irregularities in checkpoints and the
metastore.

In the following example, a Circonus Enterprise Broker is observed to have
unexpected filesystem usage in its JLog directory,
`/opt/noit/prod/log/noitd.feed`.

```
# cd /opt/noit/prod/log/noitd.feed
# ls -l
-rw-r-----. 1 broker broker 4194304 Aug  4 14:50 0000005d
-rw-r-----. 1 broker broker   12741 Aug  4 14:50 0000005d.idx
-rw-r-----. 1 broker broker 4194304 Aug  4 14:54 0000005e
-rw-r-----. 1 broker broker   10864 Aug  4 14:54 0000005e.idx
-rw-r-----. 1 broker broker 4194304 Aug  4 15:01 0000005f
-rw-r-----. 1 broker broker   10967 Aug  4 15:01 0000005f.idx
-rw-r-----. 1 broker broker 4194304 Aug  4 15:06 00000060
-rw-r-----. 1 broker broker   14739 Aug  4 15:06 00000060.idx
-rw-r-----. 1 broker broker 4194304 Aug  4 15:10 00000061
-rw-r-----. 1 broker broker   12827 Aug  4 15:10 00000061.idx
-rw-r-----. 1 broker broker 2948760 Aug  4 15:14 00000062
-rw-r-----. 1 broker broker   14632 Aug  4 15:14 00000062.idx
-rw-r-----. 1 broker broker       8 Aug  4 14:50 cp.7374726174636f6e2d666933
-rw-r-----. 1 broker broker       8 Aug  4 15:14 cp.7e30303030303033
-rw-r-----. 1 broker broker      16 Aug  4 15:06 metastore
-rw-r-----. 1 broker broker 1048580 Aug  4 15:12 pre_commit 
```

Checking the subscriber status, we see that `stratcon-fi3` has a checkpoint
that points to a nonexistent file:

```
# /opt/circonus/bin/jlogctl subscriber
	                    stratcon-fi3 @ 00000050:00000000
	                        ~0000003 @ 00000062:00000585
```

This subscriber cannot make progress, so we stop the `noitd` service and
repair:

```
# systemctl stop noitd

# /opt/circonus/bin/jlogctl repair
fixing checkpoint cp.7374726174636f6e2d666933 data 00000050:00000000 != 0000005d:00000000
#
```

At this point, we can check the subscriber state again before starting the
application back up:

```
# /opt/circonus/bin/jlogctl subscriber
                        stratcon-fi3 @ 0000005d:00000000
                            ~0000003 @ 00000062:00000585

# systemctl start noitd
```

We can see that the subscriber's checkpoint has been updated to the start of
the oldest available file. This is where it will pick up when it reconnects.

#### Application Errors

It is possible, through software bugs or system-level issues, for an
application that writes to JLog to report an error. This could happen at
startup, during the opening of a JLog for writing, or during ongoing operation,
if some event prevents a JLog write from succeeding.

Generally speaking, the error should be fairly obvious from the JLog error
message. Some common issues include:
* Incorrect file permissions on the JLog directory and/or one or more files in
  the directory.
* Corruption stemming from a previously filled filesystem or application crash.
* Corruption resulting from improper removal or alteration of JLog files
  outside of normal application activity (such as someone deleting or
  overwriting files).

For instances where corruption is suspected, running a `jlogctl repair` will
usually restore proper functionality. If it does not, contact Circonus Support
for further assitance.
