---
title:
draft: true
---

# Updating

Updating a Circonus Inside deployment uses the same procedure as initial
installation, which is the `run-hooper` script.
```
/opt/circonus/bin/run-hooper
```

Updates must always be done in the same sequence as [initial
installation](/InstallGeneral.md#InstallationSequence), and on all nodes.
Updating some nodes and not others is not supported.

## Reconfiguration

Occasionally, changes to the product will require a reconfiguration of each
node in a Circonus Inside deployment. These are infrequent, but important
updates, encountered when there are changes to role run order or the removal of
obsolete roles.

The `run-hooper` script will check for new reconfiguration notices and notify
the operator if a re-run of `self-configure` is required on a node.
Reconfiguration is required if the node config file is older than one or more
notice dates.

This manual includes a list of [reconfiguration notices](/ReconfigNotices.md).
