---
title: PostgreSQL
---

## PostgreSQL {#PostgreSQL}
 * **Category:** database
 * **Dataflow:** pull
 * **Default Port:** 5432

This check type performs a custom SQL query of your PostgreSQL database.

Pre-defined SQL queries will populate the SQL Query field for you, from there you can customize it to suit your needs. Pre-defined SQL queries for PostgreSQL checks include:
 * autovac
 * connections
 * tables
 * transactions
 * wal_files

Advanced Configuration options allow you to set Server Authorization, use SSL, or to change the default Period (60 second), Timeout (10 seconds), and Port (5432).

Refer to the [Example SQL Query Parsing](/circonus/data-collection/check-types/oracle#ExampleSQLQueryParsing) in the description of the Oracle check, above. Tutorials exist [online](http://www.w3schools.com/sql/default.asp) for those unfamiliar with SQL.
