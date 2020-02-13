---
title: MQ
weight: 90
---

# MQ {#MQ}

The Circonus Message Queue (MQ) is the center for most message passing among systems such as [stratcon](/circonus/on-premises/roles-services/stratcon), [fault detection](/circonus/on-premises/roles-services/fault-detection), [notification](/circonus/on-premises/roles-services/notifications), and others.

The MQ is an Erlang and RabbitMQ process running under the names `circonus-epmd` and `circonus-rabbitmq`.

RabbitMQ keeps log files in `/var/log/circonus/rabbitmq`.

Additionally, RabbitMQ has a management interface running on port 55672, accessible in your browser with the username/password: guest/guest. RabbitMQ also has a management tool locally on the box: `/opt/rabbitmq/sbin/rabbitmqctl`.

The management UI in the browser is the recommended method for data gathering.  From this tool, you can see the state of the cluster, connected clients, exchanges, queues and message rates, etc.

## Restarting MQ {#RestartingMQ}

If a node in the cluster is offline, the preferred method of restarting it is to first ensure that both the `circonus-rabbitmq` and `circonus-epmd` service have been stopped.

Start `circonus-epmd` first, then start `circonus-rabbitmq`.  Once both have been started via the management interface, you should see a process running on the local box and see the node reconnect to the cluster.

Further RabbitMQ documentation can be found on their site: http://www.rabbitmq.com/documentation.html

## FQ {#FQ}

For FQ documentation, refer to the [FQ Interface](/circonus/on-premises/fq-interface) section of this manual and to the FQ documentation in the Circonus Labs [Github Repository](https://github.com/circonus-labs/fq).
