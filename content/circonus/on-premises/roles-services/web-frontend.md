---
title: Web Frontend
weight: 140
---

# Web Frontend

`circonus-http` is a perl web service running under Apache HTTPD on port 80. In front of this service is `circonus-ssl-term`, which listens on port 443 to terminate SSL connections and forward them to the backend.

Web Frontend and [API](/circonus/on-premises/roles-services/api) are similar in their application code and logging setup, therefore debugging techniques for one typically work on the other.  The default set of logs are the apache logs (rotated hourly):

 * `circonus_access_log`
 * `circonus_error_log`
 * `circonus_ssl_access_log`
 * `circonus_ssl_error_log`

By default, the web frontend does not come with any additional logs enabled.  To enable additional logging, see the [Additional Web Logging](/circonus/on-premises/web-logs) section.

Internal UI application errors can be found in the `circonus_error_log`. These errors will likely be in the form of perl stacktraces or exceptions.  Some errors can be resolved by restarting the `circonus-http` service. For help with all other errors, contact Circonus Support (support@circonus.com).

## Memcached

In addition to the Apache HTTPD processes, web frontend also runs a memcached service.  This service is setup in a cluster across all the web frontend nodes and services items, such as cached copies of users and accounts, as well as across security tokens.

Should users report problems with accessing the site, such as requests being rejected or incorrect security permissions, you can attempt to restart the `circonus-memcached` service, and then have the users reload the page and try their requests again.

## Web Frontend PKI Files

 * `/www/etc/ssl/ca.crt`
 * `/www/etc/ssl/<hostname>.crt`
 * `/www/etc/ssl/<hostname>.key`

**Note:**
>You will also see `web.crt` and `web.key`. These are the user facing certificates and not involved in internal SSL communication.
