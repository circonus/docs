---
title: HTTP
---

## HTTP {#HTTP}
 * **Category:** general
 * **Dataflow:** pull
 * **Default Port:** 80 for http, 443 for https

This check type checks website performance and availability.

You will need to enter the full URL of the resource to check. If server authorization is necessary for this resource, you will need to enter the server authorization information (Auth Username, Auth Password, Auth Method) under "Advanced Configuration". You can also enter a payload to send and copy and paste a CA Certificate under "Advanced Configuration".

The regular expression is matched against the body of the response globally. The first capturing match is the key and the second capturing match is the value. Each key/value extracted is registered as a metric for the check.

![Image: 'http_advanced_configuration3.png'](/images/circonus/http_advanced_configuration3.png)
