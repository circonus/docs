---
title: Dashboards
hidecards: true
weight: 15
---

# Dashboards

To manage your dashboards, navigate to “Dashboards” within the main navigation. Here, you’ll see a listing of available dashboards.

![Dashboards overview page](/images/circonus/dashboards-overview.png)

Dashboards can be sorted by title (alphabetically), by type (alphabetically), or by the date they were last modified. You can also search dashboards by entering an expression using our [Search Query Language](/circonus/appendix/search/). Clicking “Adv” to the right of the search field will reveal a modal where you can enter a phrase corresponding to the dashboard title you’re trying to find. 

## Dashboard Types

There are three main categories of dashboards within Circonus: system, service, and custom. New Circonus users will initially only see the system dashboard and various service dashboards.

### System Dashboard

There is a single system dashboard known as the “Standard Circonus Dashboard.” This dashboard enumerates various usage data from your account such as the number of metrics, hosts, alerts, dashboards, brokers, and users. 

![System Dashboard](/images/circonus/system-dashboard.png)

This is the only dashboard universally available to all accounts regardless of which integrations are installed. The “Standard Circonus Dashboard” cannot be cloned, edited, archived, or deleted; nor can it be made private — it will appear for all users within an account.

For most Circonus users, the system dashboard will be the default dashboard seen upon login as well as when clicking the Circonus icon in the upper left. As the default dashboard, it will also be located at the top of the dashboards list and accented in blue. 

### Service Dashboards

Service dashboards are automatically created after the installation of a given integration. Below is an example service dashboard for Linux:

![Linux Dashboard](/images/circonus/linux-dashboard.png)

Circonus currently provides system dashboards for the following integrations:

- FreeBSD
- OSX
- Circonus Unified Agent (Self-Monitoring)
- Linux
- Windows
- MySQL
- PostgreSQL
- NGINX
- Apache
- Kubernetes
- Memcached
- ZFS
- RabbitMQ

From the dashboards overview page, you can choose to view the associated check for a service dashboard by clicking the arrow to the right of its “View” button. Service dashboards cannot be cloned, edited, archived, or deleted; nor can they be made private — they will appear for all users within an account.

### Custom Dashboards

Custom dashboards are those created with our intuitive dashboard builder. With the builder, you can create dashboards with tabs, sections, widgets, and variables completely of your choosing. 

From the dashboards overview page, custom dashboards can be managed by clicking the arrow to the right of their “View” button. From the dropdown, you can choose to edit, clone, archive, or delete custom dashboards. By default, custom dashboards are “Private,” or only visible to the user who created them. However, you can make them available to all users within your account by selecting “Make Available to Account” from the dropdown. Conversely, if they are available to all users in your account, you can make them private by selecting “Make Private” from the dropdown. The last option within the dropdown is “API Object.” Selecting this option reveals the API object for that dashboard which can be copied and pasted for use in custom dashboard automation.

To create a new custom dashboard, click the “Create” button in the upper right of the dashboards overview page. 

### Legacy Custom Dashboards

Older Circonus accounts may also have access to legacy custom dashboards and the associated legacy dashboard creator. 

From the dashboards overview page, legacy custom dashboards can be managed by clicking the arrow to the right of their “View” button. From the dropdown, you can choose to clone or delete custom dashboards. (To edit a custom legacy dashboard, simply click the “View” button itself. All editing options are available while viewing them.) Unlike service dashboards or new custom dashboards, legacy custom dashboards can be set as your default dashboard in place of the system dashboard. Just select “Make default” from the dropdown. As with newer custom dashboards, the last option with the dropdown is to access the dashboard’s “API Object” for use in custom dashboard automation.  

For older Circonus accounts, users can create a new legacy custom dashboard by clicking the arrow to the right of the “Create” button in the upper right and selecting “Create Legacy Dashboard.”