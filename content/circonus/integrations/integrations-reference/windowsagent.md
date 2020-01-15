---
title: Windows Agent
---

## Windows Agent {#WindowsAgent}
 * ** Category:** agent
 * **Dataflow:** pull
 * **Default Port:** 34332

This check type returns specific Windows metrics using the Circonus Windows Agent. Note the Circonus Windows Agent must be installed on the target host server.

**Note:**
> This is not the same as the Node Windows Agent Check. While the metrics are similar, this check is used when the user has .NET 4.0 and has installed the Circonus Windows agent. It is recommended that you use this Check rather than the Node Windows Agent Check.

The metrics that are returned are dependent on the category that you select during the creation process. It should be noted that some categories do not return any metrics (as there are no metrics to return), in which case the only metric returned is "`services [0]`".

The current Circonus Windows Agent msi can be downloaded [here](http://updates.circonus.net/windows/).

Windows Installer includes a number of command line arguments that can be useful when installing the Circonus Windows Agent from the msi file. The command prompt must be opened using the "run as administrator" option to use most of these options.

Consult the Windows Installer SDK for [documentation](https://msdn.microsoft.com/en-us/library/ms717358(v=vs.110).aspx) on the command line syntax.


#### Command Line Arguments {#CommandLineArguments}
Legend:
msiexec /Option <Required Parameter> [Parameter](/Optional)

| Install Options | |
|---|---|
| </package | /i> <Product.msi> |  Installs or configures a product |
| /a <Product.msi> | Administrative install - Installs a product on the network |
| /j<u|m> <Product.msi> [<Transform List>](//t) [<Language ID>](//g) | Advertises a product - m to all users, u to current user |
| </uninstall | /x> <Product.msi | ProductCode> | Uninstalls the product |
| **Display Options** | |
| /quiet | Quiet mode, no user interaction |
| /passive | Unattended mode - progress bar only |
| /q[/n|b|r|f](/n|b|r|f) |  Sets user interface level (see below) |
| /q n | Sets user interface level: No UI |
| /q b | Sets user interface level: Basic UI |
| /q r | Sets user interface level: Reduced UI |
| /q f | Sets user interface level: Full UI (default) |
| /help |  Help information |
| **Restart Options** | |
| /norestart | Do not restart after the installation is complete |
| /promptrestart | Prompts the user for restart if necessary |
| /forcerestart | Always restart the computer after installation |
| **Logging Options** | |
| /l[/i|w|e|a|r|u|c|m|o|p|v|x|+|!|*](/i|w|e|a|r|u|c|m|o|p|v|x|+|!|*) <LogFile> | Produces a log (see below) |
| /l i <LogFile> | Produces a log of Status messages |
| /l w <LogFile> | Produces a log of Nonfatal warnings |
| /l e <LogFile> | Produces a log of All error messages |
| /l a <LogFile> | Produces a log of Start up of actions |
| /l r <LogFile> | Produces a log of Action-specific records |
| /l u <LogFile> | Produces a log of User requests |
| /l c <LogFile> | Produces a log of Initial UI parameters |
| /l m <LogFile> | Produces a log of Out-of-memory or fatal exit information |
| /l o <LogFile> | Produces a log of Out-of-disk-space messages |
| /l p <LogFile> | Produces a log of Terminal properties |
| /l v <LogFile> | Produces a log of Verbose output | 
| /l x <LogFile> | Produces a log of Extra debugging information |
| /l + <LogFile> | Produces a log, appending it to an existing log file |
| /l ! <LogFile> | Produces a log, flushes each line to the log |
| /l * <LogFile> | Produces a log of all information, except for v and x options (Verbose output and extra debugging information) |
| /log <LogFile> |  Equivalent of /l* <LogFile> (See above) |
| **Update Options** | |
| /update <Update1.msp>[/;Update2.msp](/;Update2.msp) | Applies update(s) |
| /uninstall <PatchCodeGuid>[/;Update2.msp](/;Update2.msp) /package <Product.msi | ProductCode> | Remove update(s) for a product |
| **Repair Options** | |
| /f[/p|e|c|m|s|o|d|a|u|v](/p|e|c|m|s|o|d|a|u|v) <Product.msi | ProductCode> | Repairs a product (See below) |
| /f p <Product.msi | ProductCode> | Repairs a product only if file is missing |
| /f o <Product.msi | ProductCode> | Repairs a product if file is missing or an older version is installed (default) |
| /f e <Product.msi | ProductCode> | Repairs a product if file is missing or an equal or older version is installed |
| /f d <Product.msi | ProductCode> | Repairs a product if file is missing or a different version is installed |
| /f c <Product.msi | ProductCode> | Repairs a product if file is missing or checksum does not match the calculated value |
| /f a <Product.msi | ProductCode> | Repairs a product, forces all files to be reinstalled |
| /f u <Product.msi | ProductCode> | Repairs all required user-specific registry entries (default) for a product |
| /f m <Product.msi | ProductCode> | Repairs all required computer-specific registry entries (default) for a product |
| /f s <Product.msi | ProductCode> | Repairs all existing shortcuts (default) for a product |
| /f v <Product.msi | ProductCode> | Runs from source and recaches local package for a product |


#### Example Command Line Argument {#ExampleCommandLineArgument}
Note that the command prompt must be opened using the "run as administrator" option.

It is possible to run a silent install from the command prompt using the following command:
```
CirconusWindowsAgent-current.msi /q INSTALL=<WINDOWS|CONSOLE|IIS>`
```
