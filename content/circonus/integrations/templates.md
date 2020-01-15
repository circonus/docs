---
title:
---

# Advanced Configuration {#AdvancedConfiguration}

![Templates are now deprecated in favor of the richer Check and CheckBundle API endpoints.](/images/circonus/template_deprecated.png)

Templates allow the cookie-cutter application of check bundles on one host (the master host) to a set of other hosts. This feature allows users to configure a set of checks against a single target host through the UI and avoid the complication of repeating this work against all like hosts.

A template can contain only checks from a single master host, but does not need to contain all checks against that host. This allows building a set of templates (basic UNIX system, basic Windows system, web server, database server, etc.) and applying more than one template to a set of target hosts.


## Creating a Template {#CreatingaTemplate}

![Image: 'template_blank_plus3.png'](/images/circonus/template_blank_plus3.png)

The "New +" button in the "Integrations:Templates" screen will provide a dialog to create a new template based on the checks from a current host in the system.

![Image: 'template_add3.png'](/images/circonus/template_add3.png)

Enter a name for the Template and choose a host from the "Host:" selector to serve as the master host.

Completing this dialog will result in a new blank template.

![Image: 'template_blank3.png'](/images/circonus/template_blank3.png)

From here you can add checks from the selected master host and target hosts to which the template shall be applied.


### Adding Hosts {#AddingHosts}
Click the "Menu" button and choose "Add Host" to open a dialog, as shown in the screenshot below.

![Image: 'template_add_host3.png'](/images/circonus/template_add_host3.png)

Select the target host from the list.

![Image: 'template_select_host3.png'](/images/circonus/template_select_host3.png)


### Adding Check Bundles {#AddingCheckBundles}
Click the "Menu" button and choose "Add Bundle" to open a dialog, as shown in the screenshot below.

![Image: 'template_add_bundle3.png'](/images/circonus/template_add_bundle3.png)

The completed template looks like the image below.

![Image: 'template_complete3.png'](/images/circonus/template_complete3.png)

If the "Ruleset Sync" option is enabled, all the rulesets on the master Check Bundles will be copied to the Target Hosts' Check Bundles when the template is applied or re-synced.


## Working with Templates {#WorkingwithTemplates}
Once a template has check bundles associated with it and hosts on which it can act, you can remove, unbind, or deactivate both checks and hosts.


### Checks {#Checks}
 * **unbind:**
 * **remove:**
 * **deactivate:**


### Hosts {#Hosts}
 * **unbind:**
 * **remove:**
 * **deactivate:**

Once any of these changes have been made, you must click "Save & Apply" to make the changes take effect.


## Synchronizing Templates With Hosts {#SynchronizingTemplatesWithHosts}
Any check that is the product of a template may not be modified through the normal check modification process. Instead, the check on the master host that is the source of the template may be modified. To prevent massive unintended changes, when a master check is altered, the template becomes unsynchronized and must be manually synchronized with all target hosts. This can be accomplished via the "Menu" button and choosing "Sync Template" under the pertinent template.

If the "Ruleset Sync" option is checked, all the rulesets on the master Check Bundles will be copied to the Target Hosts' Check Bundles when the template is applied or re-synced.
