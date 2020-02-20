---
title: LDAP
weight: 20
---

# LDAP

As one method to handle [authentication](/circonus/on-premises/authentication/), Circonus allows for integration with LDAP and mapping of LDAP groups to provide authorization to accounts within Circonus. (This differs from the authentication method described in the [Header](/circonus/on-premises/authentication/header/) section.)

Setup of LDAP integration is handled in the site.json as documented in the [Inside Install Guide](/circonus/on-premises/installation/installation/#LDAP).

Once this is configured, when a user logs in, Circonus will take their username + password and attempt to bind to LDAP as them. Failure to bind will result in a failed login, and a message will be sent to the user to check their password / check with the administer of their setup.

Logins time out after the specified time, set via the site.json (default 1 day), or if their remote IP changes.

## Authorization

Authorization is handled by mapping a group in LDAP to a role on a Circonus account. We recommend that LDAP setups use the memberOf plugin to quickly and simply provide the group memberships with the user object. If this plugin is not available, group membership needs to be queried via search filter, and this method is far less performant.

To add a mapping to a role/account, an admin must access the role admin interface. An "LDAP Integration" section and an "Add Mapping" button will be visible from that page when LDAP is configured.

Clicking "Add Mapping" will present you with a drop down to select an account, and a text field to enter the group name (typically the CN). You can click "Add Mapping" again to add multiple accounts at once. Once done, click "Save" to save the settings.

After a user logs in, Circonus will look up their group memberships and compare that to all the LDAP mappings. When it finds one, it will link the user to that account with that role. These mappings are checked on each login.

## Troubleshooting

LDAP integration can be debugged in the following ways:

First, you can setup the LDAP log by adding a line to the web log configuration file documented [here](/circonus/on-premises/web-logs):
```
ldap DEBUG
```
This will create an LDAP log with the path `/www/logs` that will show any fatal errors.

Secondly, there are multiple test scripts located at `/www/bin/auth/ldap`. All of these scripts can be run as `./scriptname -h` to get a list of arguments. The scripts include:

 * `test_login.pl` - This script asks for the users password and attempts to bind as them.

 * `check_membership.pl` - This script will simply output the list of groups of which you are a member, that it finds. This is useful for testing your group search filter or for verifying that your memberOf plugin is showing membership in a way that Circonus understands.

 * `check_account_roles.pl` - This script compares your memberships in LDAP to roles in Circonus and their mapping. The script then outputs lists of accounts to which you will have access, a list of accounts to which you will lose access, and will identify if you will be a Circonus super admin.
