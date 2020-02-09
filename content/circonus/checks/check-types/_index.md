---
title: Check Types
weight: 30
---

# Check Types {#CheckTypes}
Most Circonus checks are configured the same way; you enter a target host, make some tweaks to the advanced options, test, and finish. However, some of checks listed below are different enough that they warrant more detailed explanation.


### Check Types Chart {#CheckTypesChart}
This summary chart displays the header information from the section for each Check Type. Refer to the individual section for each Check Type for more detailed information about that Check Type.

Click on any Check name below to jump directly to the section for that Check.

| Check | Data Flow | Default Port |
|---|---|---|
| [Apache](/circonus/checks/check-types/apache) | pull | 80 for http, 443 for https |
| [CAQL](/circonus/checks/check-types/caql-check) | pull | N/A |
| [CIM](/circonus/checks/check-types/cim) | pull | 5988 |
| [CloudWatch](/circonus/checks/check-types/cloudwatch) | pull | 443 (not configurable) |
| [Collectd](/circonus/checks/check-types/collectd) | push | 25826 (not configurable) |
| [Composite](/circonus/checks/check-types/composite) | pull | N/A |
| [CouchDB](/circonus/checks/check-types/couchdb) | pull | 5984 |
| [Custom](/circonus/checks/check-types/custom) | pull | N/A |
| [DHCP](/circonus/checks/check-types/dhcp) | pull | 67 |
| [DNS](/circonus/checks/check-types/dns) | pull | 53 |
| [Elasticsearch](/circonus/checks/check-types/elastic-search) | pull | 9200 |
| [External](/circonus/checks/check-types/external) | pull | N/A |
| [Ganglia](/circonus/checks/check-types/ganglia) | push | 8946 |
| [HAProxy](/circonus/checks/check-types/haproxy) | pull | 80 |
| [HTTP](/circonus/checks/check-types/http) | pull | 80 for http, 443 for https |
| [HTTPTrap](/circonus/checks/check-types/httptrap) | push | 43191 |
| [IMAP](/circonus/checks/check-types/imap) | pull | 143 |
| [JMX](/circonus/checks/check-types/jmx) | pull | as specified, between 0 and 65535 |
| [JSON](/circonus/checks/check-types/json) | pull or push (see [HTTPTrap](/circonus/checks/check-types/httptrap)) | 80 for pull, 43191 for push |
| [LDAP](/circonus/checks/check-types/ldap) | pull | 389 |
| [Memcached](/circonus/checks/check-types/memcached) | pull | 11211 |
| [Microsoft SQLServer](/circonus/checks/check-types/microsoft-sql-server) | pull | 1433 |
| [Mongo DB](/circonus/checks/check-types/mongodb) | pull | 28017 |
| [Munin](/circonus/checks/check-types/munin) | pull | 4949 |
| [MySQL](/circonus/checks/check-types/mysql) | pull | 3306 |
| [NGiNX](/circonus/checks/check-types/nginx) | pull | port of NGiNX server |
| [Node Agent (NAD)](/circonus/checks/check-types/node-agent-nad) | pull | 2609 |
| [Node Windows Agent](/circonus/checks/check-types/node-windows-agent) | pull | 2609 |
| [NRPE](/circonus/checks/check-types/nrpe) | pull | 5666 |
| [NTP](/circonus/checks/check-types/ntp) | pull | 123 |
| [Oracle](/circonus/checks/check-types/oracle) | pull | 1521 |
| [Ping](/circonus/checks/check-types/ping) | pull | N/A |
| [POP3](/circonus/checks/check-types/pop3) | pull | 110 |
| [PostgreSQL](/circonus/checks/check-types/postgresql) | pull | 5432 |
| [Redis](/circonus/checks/check-types/redis) | pull | 6379 |
| [Resmon](/circonus/checks/check-types/resmon) | pull | 81 |
| [Riak](/circonus/checks/check-types/riak) | pull | 8098 |
| [SMTP](/circonus/checks/check-types/smtp) | pull | 25 |
| [SNMP](/circonus/checks/check-types/snmp) | pull | 161 |
| [SSH2](/circonus/checks/check-types/ssh2) | pull | 22 |
| [statsd](/circonus/checks/check-types/statsd) | push | 8125 |
| [TCP](/circonus/checks/check-types/tcp) | pull | as specified, between 0 and 65535 |
| [Varnish](/circonus/checks/check-types/varnish) | pull | 81 |
| [Windows Agent](/circonus/checks/check-types/windows-agent) | pull | 34332 |
