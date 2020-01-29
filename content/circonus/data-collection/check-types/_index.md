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
| [Apache](/circonus/data-collection/check-types/apache) | pull | 80 for http, 443 for https |
| [CAQL](/circonus/data-collection/check-types/caql-check) | pull | N/A |
| [CIM](/circonus/data-collection/check-types/cim) | pull | 5988 |
| [CloudWatch](/circonus/data-collection/check-types/cloudwatch) | pull | 443 (not configurable) |
| [Collectd](/circonus/data-collection/check-types/collectd) | push | 25826 (not configurable) |
| [Composite](/circonus/data-collection/check-types/composite) | pull | N/A |
| [CouchDB](/circonus/data-collection/check-types/couchdb) | pull | 5984 |
| [Custom](/circonus/data-collection/check-types/custom) | pull | N/A |
| [DHCP](/circonus/data-collection/check-types/dhcp) | pull | 67 |
| [DNS](/circonus/data-collection/check-types/dns) | pull | 53 |
| [Elasticsearch](/circonus/data-collection/check-types/elasticsearch) | pull | 9200 |
| [External](/circonus/data-collection/check-types/external) | pull | N/A |
| [Ganglia](/circonus/data-collection/check-types/ganglia) | push | 8946 |
| [HAProxy](/circonus/data-collection/check-types/haproxy) | pull | 80 |
| [HTTP](/circonus/data-collection/check-types/http) | pull | 80 for http, 443 for https |
| [HTTPTrap](/circonus/data-collection/check-types/httptrap) | push | 43191 |
| [IMAP](/circonus/data-collection/check-types/imap) | pull | 143 |
| [JMX](/circonus/data-collection/check-types/jmx) | pull | as specified, between 0 and 65535 |
| [JSON](/circonus/data-collection/check-types/json) | pull or push (see [HTTPTrap](/circonus/data-collection/check-types/HTTPTrap)) | 80 for pull, 43191 for push |
| [Keynote](/circonus/data-collection/check-types/keynote) | pull | 80 for http, 443 for https |
| [LDAP](/circonus/data-collection/check-types/ldap) | pull | 389 |
| [Memcached](/circonus/data-collection/check-types/memcached) | pull | 11211 |
| [Microsoft SQLServer](/circonus/data-collection/check-types/microsoftsqlserver) | pull | 1433 |
| [Momentum](/circonus/data-collection/check-types/momentum) | pull | 2025 |
| [Mongo DB](/circonus/data-collection/check-types/mongodb) | pull | 28017 |
| [Munin](/circonus/data-collection/check-types/munin) | pull | 4949 |
| [MySQL](/circonus/data-collection/check-types/mysql) | pull | 3306 |
| [NewRelic](/circonus/data-collection/check-types/newrelic) | pull | 443 (not configurable) |
| [NGiNX](/circonus/data-collection/check-types/nginx) | pull | port of NGiNX server |
| [Node Agent (NAD)](/circonus/data-collection/check-types/nodeagentnad) | pull | 2609 |
| [Node Windows Agent](/circonus/data-collection/check-types/nodewindowsagent) | pull | 2609 |
| [NRPE](/circonus/data-collection/check-types/nrpe) | pull | 5666 |
| [NTP](/circonus/data-collection/check-types/ntp) | pull | 123 |
| [Oracle](/circonus/data-collection/check-types/oracle) | pull | 1521 |
| [Ping](/circonus/data-collection/check-types/ping) | pull | N/A |
| [POP3](/circonus/data-collection/check-types/pop3) | pull | 110 |
| [PostgreSQL](/circonus/data-collection/check-types/postgresql) | pull | 5432 |
| [Redis](/circonus/data-collection/check-types/redis) | pull | 6379 |
| [Resmon](/circonus/data-collection/check-types/resmon) | pull | 81 |
| [Riak](/circonus/data-collection/check-types/riak) | pull | 8098 |
| [SMTP](/circonus/data-collection/check-types/smtp) | pull | 25 |
| [SNMP](/circonus/data-collection/check-types/snmp) | pull | 161 |
| [SSH2](/circonus/data-collection/check-types/ssh2) | pull | 22 |
| [statsd](/circonus/data-collection/check-types/statsd) | push | 8125 |
| [TCP](/circonus/data-collection/check-types/tcp) | pull | as specified, between 0 and 65535 |
| [Varnish](/circonus/data-collection/check-types/varnish) | pull | 81 |
| [Windows Agent](/circonus/data-collection/check-types/windowsagent) | pull | 34332 |
