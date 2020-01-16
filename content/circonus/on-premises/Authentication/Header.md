---
title: Header
---

## Header {#Header}
Header authentication is one method to handle [authentication](/Authentication.md) in Circonus. However, with this method, instead of Circonus doing auth, another service authenticates the user, and then injects a header with the user's username into each Circonus authentication request.

Configuration of the header auth method is handled in the site.json as documented in the [Inside Install Guide](https://login.circonus.com/resources/docs/inside/InstallGeneral.html#header).


### Authorization {#Authorization}
Authorization through the header auth method needs to be done with some other backing service in order to look up what groups the user has membership in.

Typically this is LDAP. Settings for LDAP can be found in the LDAP section of the [Inside Install Guide](https://login.circonus.com/resources/docs/inside/InstallGeneral.html#LDAP) and an explanation of its workings can be found in the [LDAP section](/Authentication/LDAP.md) of this guide.

If LDAP is not an option, you can create a small web service that exposes the users's information via JSON.  This service will be requested via an HTTP GET, and the username can be inserted into the URL by placing the {username} macro in it.

This service should then return JSON, which will look like this:
```
{
  "firstname": "Circonus",
  "lastname": "User",
  "email": "circonus.user@example.com",
  "groups": [ "foo", "bar", "baz" ]
}
```

The group mapping to the Circonus role will work exactly as described for LDAP, in the  [LDAP section](/Authentication/LDAP.md).


### Troubleshooting {#Troubleshooting}
Header auth can be debugged in the following ways:

First, you can setup the auth functions to log any errors to the header_auth log by adding the follow setting to the web log configuration file documented [here](/WebLogs.md):
```
header_auth DEBUG
```

Secondly, there are multiple test scripts located at the path `/www/bin/auth/header`. All of these scripts can be run as `./scriptname -h` to get a list of arguments. The scripts include:

 * `lookup_user.pl` - If you are using the lookup_url and a web service to return user info, this script will poll that URL with the given username and print what it sees. If you are backing the auth with LDAP, use the LDAP test script.

 * `check_account_roles.pl` - Given a username, this script will look up the user and print out a list of accounts to which they will have access, a list of accounts to which they will lose access, and will identify if they will be a Circonus super admin.
