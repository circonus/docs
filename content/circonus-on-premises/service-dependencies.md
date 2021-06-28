---
title: Service Dependencies
weight: 70
---

# Service Dependencies

Below is a list of services which, when restarted or failed over, should have
other services restarted as well to maintain a consistent state.  The services
are listed in the order they should be restarted.

 * When [Web DB](/circonus/on-premises/roles-services/web-db) is restarted or
   failed over, restart the following services:
  1. [Notification](/circonus/on-premises/roles-services/notifications)

