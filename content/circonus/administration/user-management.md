---
title: User Management
weight: 20
---

# User Management

## Adding Users

Click the "New +" button and a dialog will appear allowing you to input the new user's email address and desired role. An invitation will be sent via email to that user.

![Image: 'account_invitation2.png'](/images/circonus/account_invitation2.png)

Until the invitation is accepted or ignored by the recipient, it will be listed in the "Pending Invitations" section. You may withdraw an unanswered invitation at any time from this section.

![Image: 'account-invited-user.png'](/images/circonus/account-invited-user.png)

If the user does not have a Circonus account, they will need to sign up for one and confirm their email address before accepting an invitation. 

## Changing User Privileges

An Admin may change a user's role using the dropdown menu button next to that user's profile.

### User Roles

On Circonus Inside Accounts, user privileges based on the role that user is assigned to.   Users with roles have access to options as appropriate to their role, but do not have access to options assigned to other roles.

The following roles can be assigned to users:
 * Admin - Users with this role can add, remove, or modify other users and their roles, perform account management, and all Normal role abilities.
 * Normal - Users can add/remove metrics, graphs, alerts, and control most of the system other than Admin-only roles.
 * ReadOnly - Users can browse, search, and view non-admin items, but cannot change things.

## Removing Users

An Admin may use the dropdown menu button next to a user's profile to remove them from the account.
