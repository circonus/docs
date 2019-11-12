## Our Integrations {#OurIntegrations}
Our checks are the nuts-and-bolts of our service integrations; to begin collecting data you must first setup a check. If you select _Checks_ under the _Integrations_ main menu section, you'll see a grid of all the service integrations we have for data collection. If a service has an _active_ bar it means there's at least one active check in the system of that type.

![Image: 'data_integrations_grid.png'](/assets/data_integrations_grid.png?raw=true)

To search across all checks in your account, use the search bar above the grid on this page. Otherwise, click an integration to view checks of that type, add new ones, or view documentation for that integration type. Those are all available in the tabbed view of the check module page:

![Image: 'data_integrations_module.png'](/assets/data_integrations_module.png?raw=true)

Select the _Existing_ tab to view a list of existing checks of the current type, or select the _Add New_ tab to begin adding a new check of the current type.


## Adding a Check {#AddingaCheck}
After you're on the check module page for the appropriate integration type, select the _Add New_ tab to begin the addition process.


### Step 1: Selecting a broker {#Step1bSelectingabroker}
Circonus has a good idea if [perspective](/Data.md#BrokersandPerspective) matters when running a check, and handles Perspective Checks and Non-perspective Checks differently. See below.

#### Perspective Checks {#PerspectiveChecks}
![Image: 'data_check_add_perspective.png'](/assets/data_check_add_perspective.png?raw=true)

Circonus considers the check to be a perspective check if the results can vary depending on the location of the broker performing the assessment. In this case you will see checkboxes to allow you to select multiple brokers; the check will be run from each of the selected brokers. You must select at least one broker, but you are not limited to one.

#### Non-perspective Checks {#NonperspectiveChecks}
![Image: 'data_check_add_nonperspective.png'](/assets/data_check_add_nonperspective.png?raw=true)

Circonus considers a check to be non-perspective if the results will not vary based on the location of the broker performing the assessment. In this case you will see a dropdown selector to select only a single broker.


### Step 2: Check-specific configuration {#Step2Checkspecificconfiguration}
This part of the process varies widely based on the check type. For the purposes of this example, we'll be using the _HTTP_ check type to check the main "circonus.com" website. The intricacies of each check type are explored in more detail in the [Check Types](/Data/CheckTypes.md) section of this manual.

![Image: 'data_check_add_1.png'](/assets/data_check_add_1.png?raw=true)

The HTTP check requires a URL and, like most checks, will resolve any FQDN and provide a choice of using the FQDN (i.e. `circonus.com`) or the resolved IP address (i.e. `199.15.226.60`). You may use a short name as a check target provided that it is resolvable in the default domain configured on the broker. Refer to the [Checks Terminology](/Data.md#Checks) section for more information. If the URL doesn't resolve, you will get an error message notifying you of the issue, and you may proceed anyway if you wish (for example, this may happen if you're running the check on an Enterprise Broker using a custom DNS setup). Click _Configure_ to proceed to the next step. 

![Image: 'data_check_add_2.png'](/assets/data_check_add_2.png?raw=true)

In this example, we leave the IP address selected, forego any advanced HTTP-specific configuration, and click _Test_ to continue to the final step.


### Step 3: Metrics selection {#Step3Metricsselection}

Once the _Test_ button is clicked, the broker which was previously selected will be asked to run the check in test mode.  This may take a few seconds, but it will retrieve all the metrics and let you pick and choose which metrics to actually collect.

![Image: 'data_check_add_3.png'](/assets/data_check_add_3.png?raw=true)

You have the option to rename your check to something more descriptive or appropriate.  Note that the host, the type, and the perspective from which it is run are metadata associated with each check. Your name need not contain that information as it is redundant.

The last task is to select the metrics for which you want to enable collection. You may either select metrics individually or filter the metrics using Regular Expressions that will determine which metrics are collected.

#### Individual Metric Selection
If you choose to select individual metrics, those that are selected will be the only ones transmitted from the broker back into the rest of Circonus to be available for alerting and visualization. Those that are not selected will simply be ignored. You can come back and change these selections later, but while they are deselected no data will be collected.

![Image: 'data_check_add_4a.png'](/assets/data_check_add_4a.png?raw=true)

The "Filter Results" box will allow quick reduction of the list for fast select/deselection for large result sets.  This can be used with "All" and "None" to quickly and painlessly work with very large lists of metrics.

#### Allow/Deny Metric Filters
If you are setting up a check type with unknown metrics or metrics which may change, you might want to use _Allow/Deny Filters_ instead of selecting individual metrics. In this case, select the _Allow/Deny Filters_ tab on the last step and add filters to the list there. Each filter consists of a Regular Expression for matching metric names, and a choice of either "allow" or "deny" which determines if each metric matched by the RegExp will be allowed or denied. The "allow all unmatched" checkbox determines what happens to metrics which aren't matched by any filters. If it's checked, all metrics will be allowed unless explicitly denied. If it's unchecked, all metrics will be denied unless explicitly allowed.

![Image: 'data_check_add_4b.png'](/assets/data_check_add_4b.png?raw=true)

Once you're satisfied with your metric selections or filters, clicking _Create_ will add the check to the broker and make its output available to the rest of the tools in Circonus.
