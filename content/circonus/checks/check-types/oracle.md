---
title: Oracle
---

# Oracle {#Oracle}

 * **Category:** database
 * **Dataflow:** pull
 * **Default Port:** 1521

This check type performs a custom SQL query of your Oracle database.

Advanced Configuration options allow you to set Server Authorization, append column names, or to change the default Period (60 second), Timeout (10 seconds), and Port (1521).

## Example SQL Query Parsing {#ExampleSQLQueryParsing}

Here is an example of how SQL query results are parsed for database checks:

| | Col1 | Col2 | Col3 |
|---|---|---|---|
| Row1 | Name1 | Val1 | Val3 |
| Row2 | Name2 | Val2 | Val4 |

Circonus would parse the above example into the following metrics:
 * **Name1`Col2** -> Val1
 * **Name1`Col3** -> Val2
 * **Name2`Col2** -> Val3
 * **Name2`Col3** -> Val4

Tutorials exist [online](http://www.w3schools.com/sql/default.asp) for those unfamiliar with SQL.
