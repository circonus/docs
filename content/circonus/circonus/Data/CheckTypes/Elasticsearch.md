## Elasticsearch {#Elasticsearch}
 * **Category:** database
 * **Dataflow:** pull
 * **Default Port:** 9200

This check type pulls statistics from elasticsearch.

[Elasticsearch](http://www.elasticsearch.org/) is a flexible and powerful open source, distributed, real-time search and analytics engine because of its robust set of APIs and query DSLs, with clients for the most popular programming languages. Almost any action can be performed using a simple RESTful API using JSON over HTTP.

With an elasticsearch check, you can set alerts within Circonus to send notifications allowing you to make any necessary changes to your resources. Several Circonus features are powered by elasticsearch.

Adding elasticsearch telemetry collection in Circonus can be done by selecting the elasticsearch check type and entering the node name. Circonus then collects a plethora of statistics from the cluster node.

Circonus collects information from elasticsearch in JSON format via the elasticsearch NoSQL database's native interface. Circonus turns these JSON documents into metrics for trending and alerting. Circonus uses this to track the inserts, deletes, and the searches performed on each node.
