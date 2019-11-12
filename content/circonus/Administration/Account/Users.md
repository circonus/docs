## User Management {#UserManagement}

### Adding Users {#AddingUsers}
Click the plus (+) button beside "Invited Users" and a dialog will appear allowing you to input the new user's email address and desired privilege level. An invitation will be sent via email to that user.

![Image: 'account_invitation2.png'](/assets/account_invitation2.png?raw=true)

Until the invitation is accepted or ignored by the recipient, it will be listed in the "Invited Users" section. You may withdraw an unanswered invitation at any time by clicking the circular "X" button beside the invitation.

![Image: 'account-invited-user.png'](/assets/account-invited-user.png?raw=true)

If the user does not have a Circonus account, they will need to sign up for one and confirm their email address before accepting an invitation. If they already have an existing account with the email address you specified, then they will see their pending message indicator light up the next time they log into Circonus. They will then be able to accept this invitation from the [personal profile management](/Administration/Profile.md) screen and gain access to that account.


### Changing User Privileges {#ChangingUserPrivileges}
You may drag a user's email address from one privilege column to another. For example, screenshot below shows the "customerservice@circonus.com" user being dragged from the Admin Users list to the Normal Users list:

![Image: 'account-drag-user.png'](/assets/account-drag-user.png?raw=true) 

This screenshot shows the "customerservice@circonus.com" after being moved, listed among the Normal Users:

![Image: 'account-dropped-user.png'](/assets/account-dropped-user.png?raw=true)


#### User Roles {#UserRoles}
On Circonus Inside Accounts, user privileges can be further modified by assigning users roles. Users with roles have access to options as appropriate to their role, but do not have access to options assigned to other roles.

The following roles can be assigned to users:
 * Admin - Users with this role can add, remove, or modify the privilege settings of other users.
 * Alerts - Users with this role can respond to alerts and modify alert rules.
 * Data - Users with this role can modify checks or templates.
 * Trending - Users with this role can change graphs and worksheets.

Besides the Admin role, these roles are not available on Circonus SaaS accounts. Normal users have access to all of the privileges of the Alerts, Data, and Trending roles, and Read-Only users have access to none of those privileges.

Note that users with an assigned role can still view all of the pages and options granted by full account access. For example, users with the Data role can still view graphs, although only users with the Trending role can edit them.


### Removing Users {#RemovingUsers}
To revoke a user's access to this account, an Admin can click the circular "X" button next to the user's email address.
