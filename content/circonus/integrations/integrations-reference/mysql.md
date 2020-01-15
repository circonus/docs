---
title: MySQL
---

## MySQL {#MySQL}
 * **Category:** database
 * **Dataflow:** pull
 * **Default Port:** 3306

This check type performs a custom SQL query of your MySQL database.

Pre-defined SQL queries will populate the SQL Query field for you, from there you can customize it to suit your needs. Pre-defined SQL queries for MySQL checks include:
 * binlog status
 * connections
 * InnoDB buffer pool
 * locks
 * query cache
 * tables
 * transactions

Advanced Configuration options allow you to set Server Authorization, use SSL, or to change the default Period (60 second), Timeout (10 seconds), and Port (3306).

Refer to the [Example SQL Query Parsing](/circonus/integrations/check-types/oracle#ExampleSQLQueryParsing) in the description of the Oracle check, above. Tutorials exist [online](http://www.w3schools.com/sql/default.asp) for those unfamiliar with SQL.
