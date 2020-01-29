---
title: Deleting
---

## Deleting a Check {#DeletingaCheck}
![Image: 'data_checks_delete_bundle3.png'](/images/circonus/data_checks_delete_bundle3.png)

When viewing a check from the "Integrations:Checks" page, the Menu at top right has a "Delete Bundle" option. Clicking this option will delete the entire bundle of checks. This means that the check will be deleted and if the check runs on one or more brokers, then it will be deleted from all brokers.

If you would simply like to disable a check from a given broker, click "view check" to access the primary check view and [manage the brokers](/Data/Checks/Edit#Addingandremovingbrokers) from there. Simply uncheck a broker from the list to disable the check on that broker.

**Warning:**
> Deleting a check is permanent. All metrics and all data may be lost forever.
