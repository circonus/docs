---
title: DNS
---

# DNS

 * **Category:** general
 * **Dataflow:** pull
 * **Default Port:** 53

This check type monitors your DNS server responses.

You can select a record to look up and a specify a Record Type:
 * A - Name to number for IPv4 (i.e. circonus.com -> 66.225.209.241)
 * AAAA - Name to number for IPv6
 * PTR - Number to name (i.e. 66.225.209.241 -> circonus.com)
 * TXT - Text record
 * MX - Mail exchange
 * CNAME - Canonical name
 * NS - Nameserver
