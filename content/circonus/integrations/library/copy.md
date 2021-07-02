---
title: Copy an Integration
weight: 30
---

# Copy an Integration

![Image: 'primary_check_view_copy3.png'](/images/circonus/primary_check_view_copy3.png)

You can copy a check to a new host without recreating the check from scratch. Navigate to the primary view of the check, then choose "Copy Check" from the Menu at top right.. A dialog will appear allowing you to edit the check's name and supply a host for the new check. You will have the option to copy all rules on metrics in the current check to the new metrics on the new check.  All configuration options on the new check will be identical to the original check, except for the host.

![Image: 'primary_check_copy3.png'](/images/circonus/primary_check_copy3.png)

**Note:**
> Creating a new check from an existing one via the copy method can seem convenient.  This is a simplified shortcut for making checks that are largely the same, in small quantities.  The [Circonus API](https://login.circonus.com/resources/api) is a more robust solution for making more than a trivial number of checks with similar configuration.
