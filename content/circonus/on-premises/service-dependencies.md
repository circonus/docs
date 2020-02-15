---
title: Service Dependencies
weight: 70
---

# Service Dependencies {#ServiceDependencies}

Below is a list of services which, when restarted or failed over, should have other services restarted as well to maintain a consistent state.  The services are listed in the order they should be restarted.

 * When [Web DB](/circonus/on-premises/roles-services/web-db) is restarted or failed over, restart the following services, in order:
  1. [Fault Detection](/circonus/on-premises/roles-services/fault-detection)
  1. [Notification](/circonus/on-premises/roles-services/notifications)
  1. [grover_queue](/circonus/on-premises/roles-services/hub#circonus-grover_queue)
  1. [ca_processor](/circonus/on-premises/roles-services/ca)

 * When [MQ](/circonus/on-premises/roles-services/mq) is restarted or failed over, restart the following services, in order:
  1. [Stratcon](/circonus/on-premises/roles-services/stratcon)
  1. [Fault Detection](/circonus/on-premises/roles-services/fault-detection)
  1. [Notification](/circonus/on-premises/roles-services/notifications)
  1. [Web Frontend](/circonus/on-premises/roles-services/web-frontend)
  1. [API](/circonus/on-premises/roles-services/api)
