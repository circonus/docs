---
title: Service Dependencies
weight: 70
---

# Service Dependencies {#ServiceDependencies}
Below is a list of services which, when restarted or failed over, should have other services restarted as well to maintain a consistent state.  The services are listed in the order they should be restarted.

 * When [Web DB](/Roles/web_db) is restarted or failed over, restart the following services, in order:
  1. [Fault Detection](/Roles/fault_detection)
  1. [Notification](/Roles/notification)
  1. [grover_queue](/Roles/hub#circonus-grover_queue)
  1. [ca_processor](/Roles/ca)

 * When [MQ](/Roles/mq) is restarted or failed over, restart the following services, in order:
  1. [Stratcon](/Roles/stratcon)
  1. [Fault Detection](/Roles/fault_detection)
  1. [Notification](/Roles/notification)
  1. [Web Frontend](/Roles/web_frontend)
  1. [API](/Roles/api)
