---
title:
---

# Service Dependencies {#ServiceDependencies}
Below is a list of services which, when restarted or failed over, should have other services restarted as well to maintain a consistent state.  The services are listed in the order they should be restarted.

 * When [Web DB](/Roles/web_db.md) is restarted or failed over, restart the following services, in order:
  1. [Fault Detection](/Roles/fault_detection.md)
  1. [Notification](/Roles/notification.md)
  1. [grover_queue](/Roles/hub.md#circonus-grover_queue)
  1. [ca_processor](/Roles/ca.md)

 * When [MQ](/Roles/mq.md) is restarted or failed over, restart the following services, in order:
  1. [Stratcon](/Roles/stratcon.md)
  1. [Fault Detection](/Roles/fault_detection.md)
  1. [Notification](/Roles/notification.md)
  1. [Web Frontend](/Roles/web_frontend.md)
  1. [API](/Roles/api.md)
