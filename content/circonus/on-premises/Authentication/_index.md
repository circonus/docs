---
title:
---

# Authentication {#Authentication}
Circonus supports multiple methods of authentication, all of which are configured via the site.json file as discussed in the [Inside Install Guide](https://login.circonus.com/resources/docs/inside/InstallGeneral.html#AuthenticationSettings).


#### Default Auth {#DefaultAuth}
If an authentication method is not specified in the site.json, then the default setting will be used. This default means that Circonus will use its internal auth mechanism. Users are identified via email and passwords are salted and hashed in the internal database. Authorization is handled the Account Profile pages by adding users to an account and assigning them to a role (admin, normal, read only).


#### LDAP Auth {#LDAPAuth}
LDAP authentication instructs Circonus to attempt to bind to an LDAP server as the user tries to log in. Further details are discussed in the [LDAP section](/Authentication/LDAP.md).


#### Header Auth {#HeaderAuth}
Header authentication tells Circonus that some outside source, typically a proxy of some kind, is going to handle the actual login. That source will then inject a header with the username into the Circonus authentication request. Further details are discussed in the [Header section](/Authentication/Header.md).
