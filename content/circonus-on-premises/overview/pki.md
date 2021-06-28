---
title: PKI
weight: 20
---

# PKI

Circonus utilizes SSL encryption when communicating over potentially "unsafe" channels.

The Circonus [Certificate Authority (CA)](/circonus/on-premises/roles-services/ca) is configured during your install and runs on a single machine (with a possible backup).  Processes on the CA machine look for new brokers being configured and new services being added, and automatically sign certificates when the CA receives a new Certificate Signing Request (CSR).  This communication happens via listen/notify triggers in the Web DB.

Initially, externally facing services, such as the web UI, the API, and streaming, may be signed with a Circonus CA certificate. If so, users may be prompted to accept the cert upon their first visit.  You may provide commercial (or other third party) certificates for these services; please see the [installation](/circonus/on-premises/installation/getting-started/#public-key-infrastructure-pki) [manual](/circonus/on-premises/installation/installation/#addressing-pki-requirements) for further details.

For information about connectivity issues, refer to the [PKI Connectivity Troubleshooting](/circonus/on-premises/troubleshooting/#pki-connectivity-troubleshooting) section.
