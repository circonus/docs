---
title: Administration
---

# Administration {#Administration}
Refer to the [installation manual](https://login.circonus.com/resources/docs/inside/PostInstall.html#SuperAdmins) for instructions to create a Circonus super admin. Once created, the super admin has access to the global admin section of the site, located at `https://domain/admin`. From there, the super admin may create or edit accounts, users, and brokers.

## Accounts {#Accounts}
Accounts can be managed via the "/admin/account" section of the admin interface.  You may create as many accounts as you like, and you can limit them to any number of hosts you wish.

It is recommended that you create an account for each group that wishes to use the system. This helps further organize data and can help scale the system should one group start using Circonus more heavily than another.

## Brokers {#Brokers}
New brokers can be added via the "/admin/broker" section of the admin interface.  The name of the broker can help identify the machine it runs on and where it is located.  The IP is required to be open to the stratcons so they can pull down data. The admin ties this broker to whichever account is to be the "owner" of the broker.

The owning account is the only account allowed to make edits to the broker in the UI and attach a contact group to it to be notified if it disconnects.  Further accounts can then be tied to the broker as "shared accounts", which gives them the ability to provision checks on the broker.

## Checks {#Checks}
The "Checks" portion of the admin interface is a read-only tool designed to help with further troubleshooting.

The interface allows you to search by check ID (as seen in the web UI URLs) or by name.  Viewing the details of a check then provides you with a UUID of the check, which is used internally in many of the systems (brokers, fault detection, etc.). Viewing the check details also provides some broker details and metric information.

The metrics listed are all of the currently active metrics, along with their event IDs as used by the fault detection and notification systems, and also along with the number of rules associated with each metric.

## Users {#Users}
Additional users and super admins can be added via the "/admin/user" section of the admin interface.  From there, you can also reset lost passwords or deactivate logins.
