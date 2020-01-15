---
title: Integrations Reference
---

# Check Types {#CheckTypes}
Most Circonus checks are configured the same way; you enter a target host, make some tweaks to the advanced options, test, and finish. However, some of checks listed below are different enough that they warrant more detailed explanation.


### Check Types Chart {#CheckTypesChart}
This summary chart displays the header information from the section for each Check Type. Refer to the individual section for each Check Type for more detailed information about that Check Type.

Click on any Check name below to jump directly to the section for that Check.

| Check | Data Flow | Default Port |
|---|---|---|
| [Apache](/circonus/integrations/check-types/apache) | pull | 80 for http, 443 for https |
| [CAQL](/circonus/integrations/check-types/caql-check) | pull | N/A |
| [CIM](/circonus/integrations/check-types/cim) | pull | 5988 |
| [CloudWatch](/circonus/integrations/check-types/cloudwatch) | pull | 443 (not configurable) |
| [Collectd](/circonus/integrations/check-types/collectd) | push | 25826 (not configurable) |
| [Composite](/circonus/integrations/check-types/composite) | pull | N/A |
| [CouchDB](/circonus/integrations/check-types/couchdb) | pull | 5984 |
| [Custom](/circonus/integrations/check-types/custom) | pull | N/A |
| [DHCP](/circonus/integrations/check-types/dhcp) | pull | 67 |
| [DNS](/circonus/integrations/check-types/dns) | pull | 53 |
| [Elasticsearch](/circonus/integrations/check-types/elasticsearch) | pull | 9200 |
| [External](/circonus/integrations/check-types/external) | pull | N/A |
| [Ganglia](/circonus/integrations/check-types/ganglia) | push | 8946 |
| [HAProxy](/circonus/integrations/check-types/haproxy) | pull | 80 |
| [HTTP](/circonus/integrations/check-types/http) | pull | 80 for http, 443 for https |
| [HTTPTrap](/circonus/integrations/check-types/httptrap) | push | 43191 |
| [IMAP](/circonus/integrations/check-types/imap) | pull | 143 |
| [JMX](/circonus/integrations/check-types/jmx) | pull | as specified, between 0 and 65535 |
| [JSON](/circonus/integrations/check-types/json) | pull or push (see [HTTPTrap](/circonus/integrations/check-types/HTTPTrap)) | 80 for pull, 43191 for push |
| [Keynote](/circonus/integrations/check-types/keynote) | pull | 80 for http, 443 for https |
| [LDAP](/circonus/integrations/check-types/ldap) | pull | 389 |
| [Memcached](/circonus/integrations/check-types/memcached) | pull | 11211 |
| [Microsoft SQLServer](/circonus/integrations/check-types/microsoftsqlserver) | pull | 1433 |
| [Momentum](/circonus/integrations/check-types/momentum) | pull | 2025 |
| [Mongo DB](/circonus/integrations/check-types/mongodb) | pull | 28017 |
| [Munin](/circonus/integrations/check-types/munin) | pull | 4949 |
| [MySQL](/circonus/integrations/check-types/mysql) | pull | 3306 |
| [NewRelic](/circonus/integrations/check-types/newrelic) | pull | 443 (not configurable) |
| [NGiNX](/circonus/integrations/check-types/nginx) | pull | port of NGiNX server |
| [Node Agent (NAD)](/circonus/integrations/check-types/nodeagentnad) | pull | 2609 |
| [Node Windows Agent](/circonus/integrations/check-types/nodewindowsagent) | pull | 2609 |
| [NRPE](/circonus/integrations/check-types/nrpe) | pull | 5666 |
| [NTP](/circonus/integrations/check-types/ntp) | pull | 123 |
| [Oracle](/circonus/integrations/check-types/oracle) | pull | 1521 |
| [Ping](/circonus/integrations/check-types/ping) | pull | N/A |
| [POP3](/circonus/integrations/check-types/pop3) | pull | 110 |
| [PostgreSQL](/circonus/integrations/check-types/postgresql) | pull | 5432 |
| [Redis](/circonus/integrations/check-types/redis) | pull | 6379 |
| [Resmon](/circonus/integrations/check-types/resmon) | pull | 81 |
| [Riak](/circonus/integrations/check-types/riak) | pull | 8098 |
| [SMTP](/circonus/integrations/check-types/smtp) | pull | 25 |
| [SNMP](/circonus/integrations/check-types/snmp) | pull | 161 |
| [SSH2](/circonus/integrations/check-types/ssh2) | pull | 22 |
| [statsd](/circonus/integrations/check-types/statsd) | push | 8125 |
| [TCP](/circonus/integrations/check-types/tcp) | pull | as specified, between 0 and 65535 |
| [Varnish](/circonus/integrations/check-types/varnish) | pull | 81 |
| [Windows Agent](/circonus/integrations/check-types/windowsagent) | pull | 34332 |
