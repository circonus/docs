---
title: CA
weight: 30
---

## CA {#CA}
The CA role runs the Circonus private Certificate Authority, which handles the SSL communication between [stratcon](/circonus/on-premises/roles-services/stratcon), the [brokers](/circonus/on-premises/roles-services/broker), the web UI, and the [API](/circonus/on-premises/roles-services/api), as well as user facing services if so configured.

CA utilizes openssl for its certificate signing. The home directory is in `/opt/circonus/CA`. If you are running a backup Circonus infrastructure, this directory will need to be synced.

A single service, `circonus-ca_processor`, runs on the CA machine.  This process listens to notifications from the database and signs any pending Certificate Signing Requests (CSRs).

If for any reason you are not receiving certificates, either when installing Circonus or when adding new services or brokers, try restarting the `circonus-ca_processor` service. This should cause the service to sign any pending CSRs and then begin listening again for new entries.

**Note:**
> The CA should be kept up-to-date and backed up regularly.
