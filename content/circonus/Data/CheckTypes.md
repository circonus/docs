# Check Types {#CheckTypes}
Most Circonus checks are configured the same way; you enter a target host, make some tweaks to the advanced options, test, and finish. However, some of checks listed below are different enough that they warrant more detailed explanation.


### Check Types Chart {#CheckTypesChart}
This summary chart displays the header information from the section for each Check Type. Refer to the individual section for each Check Type for more detailed information about that Check Type.

Click on any Check name below to jump directly to the section for that Check.

| Check | Data Flow | Default Port |
|---|---|---|
| [Apache](/Data/CheckTypes/Apache.md) | pull | 80 for http, 443 for https |
| [CAQL](/Data/CheckTypes/CAQLCheck.md) | pull | N/A |
| [CIM](/Data/CheckTypes/CIM.md) | pull | 5988 |
| [CloudWatch](/Data/CheckTypes/CloudWatch.md) | pull | 443 (not configurable) |
| [Collectd](/Data/CheckTypes/Collectd.md) | push | 25826 (not configurable) |
| [Composite](/Data/CheckTypes/Composite.md) | pull | N/A |
| [CouchDB](/Data/CheckTypes/CouchDB.md) | pull | 5984 |
| [Custom](/Data/CheckTypes/Custom.md) | pull | N/A |
| [DHCP](/Data/CheckTypes/DHCP.md) | pull | 67 |
| [DNS](/Data/CheckTypes/DNS.md) | pull | 53 |
| [Elasticsearch](/Data/CheckTypes/Elasticsearch.md) | pull | 9200 |
| [External](/Data/CheckTypes/External.md) | pull | N/A |
| [Ganglia](/Data/CheckTypes/Ganglia.md) | push | 8946 |
| [Google Analytics](/Data/CheckTypes/GoogleAnalytics.md) | pull | 443 (not configurable) |
| [HAProxy](/Data/CheckTypes/HAProxy.md) | pull | 80 |
| [HTTP](/Data/CheckTypes/HTTP.md) | pull | 80 for http, 443 for https |
| [HTTPTrap](/Data/CheckTypes/HTTPTrap.md) | push | 43191 |
| [IMAP](/Data/CheckTypes/IMAP.md) | pull | 143 |
| [JMX](/Data/CheckTypes/JMX.md) | pull | as specified, between 0 and 65535 |
| [JSON](/Data/CheckTypes/JSON.md) | pull or push (see [HTTPTrap](/Data/CheckTypes/HTTPTrap.md)) | 80 for pull, 43191 for push |
| [Keynote](/Data/CheckTypes/Keynote.md) | pull | 80 for http, 443 for https |
| [LDAP](/Data/CheckTypes/LDAP.md) | pull | 389 |
| [Memcached](/Data/CheckTypes/Memcached.md) | pull | 11211 |
| [Microsoft SQLServer](/Data/CheckTypes/MicrosoftSQLServer.md) | pull | 1433 |
| [Momentum](/Data/CheckTypes/Momentum.md) | pull | 2025 |
| [Mongo DB](/Data/CheckTypes/MongoDB.md) | pull | 28017 |
| [Munin](/Data/CheckTypes/Munin.md) | pull | 4949 |
| [MySQL](/Data/CheckTypes/MySQL.md) | pull | 3306 |
| [NewRelic](/Data/CheckTypes/NewRelic.md) | pull | 443 (not configurable) |
| [NGiNX](/Data/CheckTypes/NGiNX.md) | pull | port of NGiNX server |
| [Node Agent (NAD)](/Data/CheckTypes/NodeAgentNAD.md) | pull | 2609 |
| [Node Windows Agent](/Data/CheckTypes/NodeWindowsAgent.md) | pull | 2609 |
| [NRPE](/Data/CheckTypes/NRPE.md) | pull | 5666 |
| [NTP](/Data/CheckTypes/NTP.md) | pull | 123 |
| [Oracle](/Data/CheckTypes/Oracle.md) | pull | 1521 |
| [Ping](/Data/CheckTypes/Ping.md) | pull | N/A |
| [POP3](/Data/CheckTypes/POP3.md) | pull | 110 |
| [PostgreSQL](/Data/CheckTypes/PostgreSQL.md) | pull | 5432 |
| [Redis](/Data/CheckTypes/Redis.md) | pull | 6379 |
| [Resmon](/Data/CheckTypes/Resmon.md) | pull | 81 |
| [Riak](/Data/CheckTypes/Riak.md) | pull | 8098 |
| [SMTP](/Data/CheckTypes/SMTP.md) | pull | 25 |
| [SNMP](/Data/CheckTypes/SNMP.md) | pull | 161 |
| [SSH2](/Data/CheckTypes/SSH2.md) | pull | 22 |
| [statsd](/Data/CheckTypes/statsd.md) | push | 8125 |
| [TCP](/Data/CheckTypes/TCP.md) | pull | as specified, between 0 and 65535 |
| [Varnish](/Data/CheckTypes/Varnish.md) | pull | 81 |
| [Windows Agent](/Data/CheckTypes/WindowsAgent.md) | pull | 34332 |
