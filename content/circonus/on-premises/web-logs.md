---
title: Additional Web Logs
weight: 40
---

# Additional Web Logs

Both the [API](/circonus/on-premises/roles-services/api) and [web frontend](/circonus/on-premises/roles-services/web-frontend), as well as many maintenance scripts, can be configured for additional logging.  Logs have 5 levels of detail, listed here from most to least verbose:

 * DEBUG
 * INFO
 * WARN
 * ERROR
 * FATAL

Logging is configured via the file `/www/etc/logging.conf`.

This file may not exist; if it does not, create it.  Each line in the file will specify the type of information to be logged and the level of detail.  The following is a list of items that can be logged:

 * composite - Logs communication to the composite broker, mostly the incoming user equation, and the translated equation used by the backend.

 * dispatch - The dispatcher directs requests the the appropriate location. This will log the URI of the request, as well as any potential redirections built into the system.  If users are receiving 404 or 403 errors on requests that are known to work, this can help trace the source of the errors.

 * ldap - Debugging information when talking to an LDAP server for auth.

 * psgi - Logs details about the requests and responses (including the full payloads) sent to the API.  Usually results in a large amount of data in the logs, so is best to only turn on as needed then back off.

 * reconnoiter - This logs all communication to the [brokers](/circonus/on-premises/roles-services/broker) and [stratcon](/circonus/on-premises/roles-services/stratcon).  If a broker is not activating on the [hub](/circonus/on-premises/roles-services/hub) role, this log can show why.  If pages that show check statuses, broker connections, or API requests are failing, this can be used to determine if the systems can not talk or if the broker isn't able to create or run the check.

 * search - logs the queries and params that are used when searching via the API or UI

Each log is written to `/www/logs/<name>-YYYY-MM-DD` and they are rotated daily.

Each log stream type, and level should be on a line by themselves.  The following is an example `logging.conf` file.
```
reconnoiter DEBUG
search INFO
dispatch FATAL
```

Shell environment variables can also be used to influence logging configuration.   This is particularly useful when testing scripts from the command line.

 * `CIRCONUS_LOG_EXTRA` - This may contain a comma-separated list of individual log types and severity levels.  Values here override any other config, such as `logging.conf`, with the exception of `CIRCONUS_LOG_EVERYTHING` (described below), which will not be overridden.
   ```
CIRCONUS_LOG_EXTRA='reconnoiter D,db D' /www/bin/script
   
```
 * `CIRCONUS_LOG_EVERYTHING` - When set to any non-empty string other than "0" (the number zero), this will ensure that absolutely everything is logged.
