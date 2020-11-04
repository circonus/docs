---
title: CA
weight: 30
---

# CA

The CA role runs the Circonus private Certificate Authority, which handles the
SSL communication between
[stratcon](/circonus/on-premises/roles-services/stratcon), the
[brokers](/circonus/on-premises/roles-services/broker), the web UI, and the
[API](/circonus/on-premises/roles-services/api), as well as user facing
services if so configured.

CA utilizes OpenSSL for its certificate signing. The home directory is in
`/opt/circonus/CA`. **If you are running multiple CA hosts, and/or have a
multi-datacenter deployment, this directory will need to be synced regularly to
all non-primary hosts. A daily sync is recommended.**

A single service, `circonus-ca_processor`, runs on the CA machine.  This
process listens to notifications from the database and signs any pending
Certificate Signing Requests (CSRs), loading the new certificate back into the
database.

If for any reason you are not receiving certificates, either when installing
Circonus or when adding new services or brokers, try restarting the
`circonus-ca_processor` service. This should cause the service to sign any
pending CSRs and then begin listening again for new entries.

