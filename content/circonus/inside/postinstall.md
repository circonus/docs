---
title:
---

# Post Install Instructions {#PostInstallInstructions}
After your install is complete, you will need to perform each of the following procedures to begin using Circonus:

 1. Install your [IRONdb&reg; license](/PostInstall.md#InstallIRONdbLicense) on each `data_storage` node.
 1. Create a [super-admin](/PostInstall.md#SuperAdmins).
 1. Add and configure a [broker](/PostInstall.md#AddingBrokers).
 1. Setup system [selfchecks](/PostInstall.md#Selfchecks).
 1. Create your first [account](/PostInstall.md#CreatingAccounts).

Procedures for each of these steps are described in the subsections below.

**Note:**
> Your Circonus Inside version should be updated regularly. Keep the Enterprise Brokers up-to-date and the CA updated and backed up regularly.

## Install IRONdb License

Your IRONdb&reg; license was generated for you during the sales process. 

Please contact Circonus Support (support@circonus.com) if you do not yet have a
copy of your license.

Once you have received your license, paste it between the
`<licenses></licenses>` tags in `/opt/circonus/etc/licenses.conf` on all nodes
in the `data_storage` role.  This file is created by Hooper if it does not
exist, but is left alone otherwise. The updated file should look something like
this:

```
<?xml version="1.0" encoding="utf8" standalone="yes"?>
<licenses>
  <license id="1" sig="(base64-encoded signature)">
    <requestor>Circonus</requestor>
    <snowth>1</snowth>
    <company>Your Company Name</company>
  </license>
</licenses>
```

Save the updated file and then restart the "snowth" service:
 * EL7: `sudo systemctl restart circonus-snowth`
 * OmniOS: `sudo svcadm restart snowth`

Repeat this process on each system in the `data_storage` role.

## Super Admins {#SuperAdmins}
Super-admins have admin access to every account, as well as access to a special
admin section of the system, located at `https://acme-client.com/admin` .  The
`/admin` section is used to create accounts, brokers, and users. Only
super-admins have access to this part of the system.

The first user you create must be a super-admin.  To do this, log into any host
running the `web_frontend` role and run this script, replacing the
first/lastname and email values:

```
/www/bin/setup/create_super_admin.pl -f Firstname -l Lastname -e Email
```

You can now navigate to `https://acme-client.com/login/` and log in as the super-admin.


## Adding Brokers {#AddingBrokers}
Add a broker to the internal "circonus" account to enable Selfchecks (next
step). Use the following procedure:

 1. Go to https://acme-client.com/admin/broker/new.
 1. Enter the following information:
  * Name - This is the name the broker is identified with in the UI.
  * IP Address - This is the address where Stratcon (the data aggregator) can talk to the broker.
  * Account - Select the "circonus" account.

This procedure will add a broker entitlement slot into the system and put it
into an "unprovisioned" state.  Next, install the broker software package on a
system and provision it using its bundled configuration tool.  To find
documentation on this process, please refer to the [Broker
Installation](https://login.circonus.com/resources/docs/user/Administration/Brokers.html#Installation)
subsection of the Administration section in the User Manual.

If you later decide to make this broker "public" (grant access to all
accounts), you can visit the "/admin/broker" page, search for the broker in
question, click on it to edit, and change the account to "All Accounts". The
broker that handles the Selfchecks should remain on the "circonus" account or
be public, but should not be moved to another individual account.


## Selfchecks {#Selfchecks}
Circonus Inside operations are monitored via two methods: internally and externally.

Services that are not in the alerting pathway are monitored internally by your Circonus Inside install.

Services that are in the alerting pathway need an external monitor to ensure that alerts will still be sent out in the event that the service goes down.  All Circonus Inside customers are given a limited Circonus Software as a Service (SaaS) account for this purpose.  If you cannot use a SaaS account, please let Support know and they will work with you on an alternate solution (support@circonus.com).

Selfchecks are created under the system's "circonus" account, which is created by default during the install.  To access this account, navigate to the "/account/circonus/dashboard" page as a super-admin.

As part of the standard Post-Installation procedures, we advise using the "circonus" account to create a contact group which will be notified on any internal systems issue.  For details on contact groups, refer to the [Contact Groups](/Docs/Alerting/ContactGroups.md) subsection in the User Manual, located in the Alerting section.

To set up the selfchecks for a contact group, you will need the broker id and the contact group name.  Run the following script on any `web_frontend` node:

```
/www/bin/inside/create_selfchecks.pl -b <broker_id> -c <contact group name>
```

To find the `broker_id`, visit the "/admin/broker" page and search for the broker you want to use. The ID will be in the leftmost column in the search results.

## Creating Accounts {#CreatingAccounts}
Make an account for normal Circonus use with the following procedure:

  1. Navigate to `https://acme-client.com/admin/account/new`.
  1. Enter the following information:
   * Name - This is name of the account.
   * URL - This will be filled in based on the name. This is how you will access the account; e.g. using `https://acme-client.com/account/<url>/profile` where "`<url>`" is this URL.
   * Timezone - The timezone used for displaying dates and times in the UI. Typically this is set to the local timezone where the majority of account users are located.
   * Description - This is optional, but can be useful for identification or instructions.
   * Metric limit -  This is provided to let you limit metrics internally. If you don't want to worry about limits, just enter a large number for now.
  1. Click "Create Account".
