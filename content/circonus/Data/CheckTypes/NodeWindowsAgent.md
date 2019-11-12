## Node Windows Agent {#NodeWindowsAgent}
 * **Category:** agent
 * **Dataflow:** pull
 * **Default Port:** 2609

This check type checks windows-specific metrics using the Node Agent available on [github](https://github.com/circonus-labs/nad).

**Note:**
> This is not the same as the Windows Agent Check. Circonus has an extension in NAD that allows it to pull Windows metrics and report them. This check is used when the user does not have (and does not want to install) .NET 4.0 and doesn't want to install our normal Windows agent. It is recommended that you use the Windows Agent Check.

The metrics that are returned are dependent on the category that you select during the creation process. It should be noted that some categories do not return any metrics (as there are no metrics to return), in which case the only metric returned is "`services [0]`".


### Installing Node Windows Agent {#InstallingNodeWindowsAgent}
The Node Agent Windows Check works because Circonus has coded Windows Management Instrumentation (WMI) functionality into NAD itself. It doesn't require any external scripts or anything else to run, and it would work correctly even with no external scripts.

To run the Node Windows Agent, follow these instructions:
 1. Download and install Node onto the host Windows machine. You can download Node at http://nodejs.org/en/download.
 1. Download a zip of the NAD source code onto the host Windows machine. Go to https://github.com/circonus-labs/nad and click the "Download ZIP" button.
 1. Unzip the source code file.
 1. Launch an administrator terminal window. (Open the command prompt, running as an administrator.)
 1. Change directories into the source code directory:
```
 cd <path to unzipped NAD source code file>
```
 1. Run this command:
```
node nad -c config
```

Once this procedure is complete, the Node Windows Agent should now be listening on port 2609.


#### Installing Node Windows Agent with FreeBSD {#InstallingNodeWindowsAgentwithFreeBSD}
Download nad with wget.

As root, in the nad-master directory, execute
`gmake install-freebsd`. Make sure `‘rsync’` is installed.

The init script defaults to nad being enabled. If you wish to disable nad, add `nad_enable=”NO”` to `/etc/rc.conf`.

Additionally, if you wish to override the default options, you may add them to `rc.conf` as nad_flags.


#### Installing Node Windows Agent with SmartOS {#InstallingNodeWindowsAgentwithSmartOS}
Download nad with wget.

As root, in the nad-master directory, execute `gmake install`

After you install, you should be able to use `curl http://localhost:2609/` to see the metrics.
