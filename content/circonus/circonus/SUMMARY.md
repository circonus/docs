# Circonus Users' Guide {#CirconusUsersGuide}

* [Overview](/README.md)

### Data Collection

* [Data Model](/Data.md#Data)
  * [Data Types](/Data.md#DataTypes)

* [Data Collection](/Data/Overview.md)
  * [Hosts](/Data/Overview.md#Hosts)
  * [Brokers](/Data/Overview.md#Brokers)
  * [Active Collection (Polling)](/Data/Overview.md#ActiveCollection)
  * [Passive Collection](/Data/Overview.md#PassiveCollection)

* [Checks](/Data/Checks.md)
  * [Adding a check](/Data/Checks.md#AddingaCheck)
  * [Reviewing checks](/Data/View/Checks.md)
  * [Editing a Check](/Data/Checks/Edit.md)
  * [Copying a Check](/Data/Checks/Clone.md)
  * [Deleting a Check](/Data/Checks/Delete.md)
  * [Check Types](/Data/CheckTypes.md)
    * [Apache](/Data/CheckTypes/Apache.md)
    * [CAQL](/Data/CheckTypes/CAQLCheck.md)
    * [CIM](/Data/CheckTypes/CIM.md)
    * [CloudWatch](/Data/CheckTypes/CloudWatch.md)
    * [Collectd](/Data/CheckTypes/Collectd.md)
    * [Composite](/Data/CheckTypes/Composite.md)
    * [CouchDB](/Data/CheckTypes/CouchDB.md)
    * [Custom](/Data/CheckTypes/Custom.md)
    * [DHCP](/Data/CheckTypes/DHCP.md)
    * [DNS](/Data/CheckTypes/DNS.md)
    * [Elasticsearch](/Data/CheckTypes/Elasticsearch.md)
    * [External](/Data/CheckTypes/External.md)
    * [Ganglia](/Data/CheckTypes/Ganglia.md)
    * [Google Analytics](/Data/CheckTypes/GoogleAnalytics.md)
    * [HaProxy](/Data/CheckTypes/HAProxy.md)
    * [HTTP](/Data/CheckTypes/HTTP.md)
    * [HTTPTrap](/Data/CheckTypes/HTTPTrap.md)
    * [IMAP](/Data/CheckTypes/IMAP.md)
    * [JMX](/Data/CheckTypes/JMX.md)
    * [JSON](/Data/CheckTypes/JSON.md)
    * [Keynote](/Data/CheckTypes/Keynote.md)
    * [LDAP](/Data/CheckTypes/LDAP.md)
    * [Memcached](/Data/CheckTypes/Memcached.md)
    * [Microsoft SQLServer](/Data/CheckTypes/MicrosoftSQLServer.md)
    * [Momentum](/Data/CheckTypes/Momentum.md)
    * [Mongo DB](/Data/CheckTypes/MongoDB.md)
    * [Munin](/Data/CheckTypes/Munin.md)
    * [MySQL](/Data/CheckTypes/MySQL.md)
    * [NewRelic](/Data/CheckTypes/NewRelic.md)
    * [NGiNX](/Data/CheckTypes/NGiNX.md)
    * [Node Agent (NAD)](/Data/CheckTypes/NodeAgentNAD.md)
    * [Node Windows Agent](/Data/CheckTypes/NodeWindowsAgent.md)
    * [NRPE](/Data/CheckTypes/NRPE.md)
    * [NTP](/Data/CheckTypes/NTP.md)
    * [Oracle](/Data/CheckTypes/Oracle.md)
    * [Ping](/Data/CheckTypes/Ping.md)
    * [POP3](/Data/CheckTypes/POP3.md)
    * [PostgreSQL](/Data/CheckTypes/PostgreSQL.md)
    * [Redis](/Data/CheckTypes/Redis.md)
    * [Resmon](/Data/CheckTypes/Resmon.md)
    * [Riak](/Data/CheckTypes/Riak.md)
    * [SMTP](/Data/CheckTypes/SMTP.md)
    * [SNMP](/Data/CheckTypes/SNMP.md)
    * [SSH2](/Data/CheckTypes/SSH2.md)
    * [statsd](/Data/CheckTypes/statsd.md)
    * [TCP](/Data/CheckTypes/TCP.md)
    * [Varnish](/Data/CheckTypes/Varnish.md)
    * [Windows Agent](/Data/CheckTypes/WindowsAgent.md)

* [Metrics](/Data/View/Metrics.md)
  * [Metrics Grid View](/Data/View/Metrics.md#MetricsGridView)
  * [Metrics List View](/Data/View/Metrics.md#MetricsListView)
  * [Metric Clusters](/Data/View/MetricClusters.md)
    * [Creating Metric Clusters](/Data/View/MetricClusters.md#CreateCluster)
    * [Add Metric Clusters to Graphs](/Data/View/MetricClusters.md#EditingExistingGraphs)
    * [Cluster Health](/Data/View/MetricClusters.md#ClusterHealth)

* [Hosts](/Data/View/Hosts.md)

* [Templates](/Data/Templates.md)
  * [Creating a Template](/Data/Templates.md#CreatingaTemplate)
  * [Syncing Templates With Hosts](/Data/Templates.md#SynchronizingTemplatesWithHosts)

* [Tags](/Tags.md#Tags)

* [Search](/SearchingV2.md#SearchVersion2)
  * [Advanced Search Builder](/SearchingV2.md#AdvancedSearchBuilder)
* [Metric Search](/SearchingV3.md)
  * [Metrics Explorer](/SearchingV3.md#advanced-explorer)

### Alerting

* [Contact Groups](/Alerting/ContactGroups.md#ContactGroups)
  * [Creating Contact Groups](/Alerting/ContactGroups.md#CreatingContactGroups)
  * [Adding Members](/Alerting/ContactGroups.md#AddingMembers)
  * [Configuring Contact Groups](/Alerting/ContactGroups.md#ConfiguringContactGroups)
  * [Custom Alert Formats](/Alerting/ContactGroups.md#CustomAlertFormats)
  * [Webhook Notifications](/Alerting/ContactGroups.md#WebhookNotifications)
  * [OpsGenie](/Alerting/ContactGroups.md#OpsGenie)
  * [PagerDuty Options](/Alerting/ContactGroups.md#PagerDutyOptions)
  * [Slack](/Alerting/ContactGroups.md#Slack)
  * [VictorOps](/Alerting/ContactGroups.md#VictorOps)
  * [Suspending Notifications](/Alerting/ContactGroups.md#SuspendingNotifications)
* [Configuring Rulesets](/Alerting/Rules/Configure.md)
  * [Establishing Dependencies](/Alerting/Rules/Configure.md#EstablishingDependencies)
* [Ruleset Groups](/Alerting/RuleGroups/Configure.md)
* [Reviewing Alerts](/Alerting/Reviewing.md)
* [Acknowledging Alerts](/Alerting/Acknowledge.md)
* [Account Alerts](/Alerting/AccountAlerts.md)
* [Setting a Maintenance Window](/Alerting/Maintenance.md)

### Visualization

* [Graphs](/Visualization/Graph/Create.md)
  * [Creating a graph](/Visualization/Graph/Create.md)
     * [Finding Metrics](/Visualization/Graph/Create.md#FindingMetrics)
  * [Viewing Graphs](/Visualization/Graph/View.md)
     * [Annotations](/Visualization/Graph/View.md#Annotations)
  * [Time Navigation](/Visualization/Graphs/View/Time.md)

  * [Numeric Data in Graphs](/Visualization/Graph/Numeric.md)
    * [Data Manipulation](/Visualization/Graph/Numeric.md#DataManipulation)
     * [Using Textual Data in Graphs](/Visualization/Graph/Textual.md)
     * [Graphing Composite Numerics](/Visualization/Graph/Numeric/Composite.md)
   * [Histogram Visualizations](/Visualization/Graph/Histograms.md)
     * [Histograms: Understanding Histograms](/Visualization/Graphs/View/Histograms.md)
     * [Combining Different Data Types (Putting it all together)](/Visualization/Graph/Combination.md)
  * [Annotations: Managing Events](/Visualization/Graph/Annotations.md)
  * [Worksheets](/Visualization/Graphs/View/Worksheets.md)
     * [Advanced Worksheet Controls](/Visualization/Graphs/View/Worksheets/Advanced.md)
  * [Sharing](/Visualization/Graphs/View/Sharing.md)

* [Dashboards](/Dashboards.md)
   * [Creating a dashboard](/Dashboards.md#CreatingaDashboard)
   * [Widgets](/Dashboards.md#Widgets)
      * [Alerts](/Dashboards.md#Alerts)
      * [Chart](/Dashboards.md#Chart)
      * [Gauge](/Dashboards.md#Gauge)
      * [Graph](/Dashboards.md#Graph)
      * [HTML](/Dashboards.md#HTML)
      * [List](/Dashboards.md#List)
      * [Status](/Dashboards.md#Status)
      * [Text](/Dashboards.md#Text)
   * [Dashboard Options](/Dashboards.md#DashboardOptions)
   * [Sharing a Dashboard](/Dashboards.md#SharingaDashboard)
   * [Setting a Dashboard as Your Default](/Dashboards.md#SettingaDashboardasYourDefault)

### Analytics

* [Analytics Overlays](/Visualization/Graphs/View/Overlays.md)
    * [Capacity Planning](/Visualization/Graphs/View/Overlays/Analytics.md#CapacityPlanning)
    * [Anomaly Detection](/Visualization/Graphs/View/Overlays/Analytics.md#AnomalyDetection)
    * [Service Level Monitoring](/Visualization/Graphs/View/Overlays/Analytics.md#ServiceLevelMonitoring)
    * [Graph Comparison](/Visualization/Graphs/View/Overlays/Analytics.md#GraphComparison)
    * [Other Analytics](/Visualization/Graphs/View/Overlays/Analytics.md#OtherAnalytics)

* [Circonus Analytics Query Language (CAQL)](/CAQL.md)
* [CAQL Reference Manual](/caql_reference.md)
    * [CAQL Data Flow and Data Structures](/caql_reference.md#DataFlowandDataStructures)
      * [Processing Units](/caql_reference.md#ProcessingUnits)
      * [From CAQL Statements to Processing Units](/caql_reference.md#FromCAQLStatementstoProcessingUnits)
    * [CAQL Syntax](/caql_reference.md#CAQLSyntax)
      * [Identifiers](/caql_reference.md#Identifiers)
      * [Function Definitions](/caql_reference.md#FunctionDefinitions)
      * [String Literals](/caql_reference.md#StringLiterals)
      * [Number Literals](/caql_reference.md#NumberLiterals)
      * [Duration Literals](/caql_reference.md#DurationLiterals)
      * [Boolean Values](/caql_reference.md#BooleanValues)
      * [Operators](/caql_reference.md#Operators)
      * [The Pipe Operator](/caql_reference.md#ThePipeOperator)
      * [Advanced composition with slot arguments](/caql_reference.md#Advancedcompositionwithslotarguments)
    * [CAQL Function Tables](/caql_reference.md#FunctionTables)
      * [Global Functions](/caql_reference.md#GlobalFunctions)
      * [Package each](/caql_reference.md#Packageeach)
      * [Package fill](/caql_reference.md#Packagefill)
      * [Package find](/caql_reference.md#Packagefind)
      * [Package forecasting](/caql_reference.md#Packageforecasting)
      * [Package group_by](/caql_reference.md#Packagegroup_by)
      * [Package histogram](/caql_reference.md#Packagehistogram)
      * [Package math](/caql_reference.md#Packagemath)
      * [Package metric](/caql_reference.md#Packagemetric)
      * [Package op](/caql_reference.md#Packageop)
      * [Package outlier](/caql_reference.md#Packageoutlier)
      * [Package rolling](/caql_reference.md#Packagerolling)
      * [Package search](/caql_reference.md#Packagesearch)
      * [Package stats](/caql_reference.md#Packagestats)
      * [Package time](/caql_reference.md#Packagetime)
      * [Package window](/caql_reference.md#Packagewindow)

### Administration

* [Administration](/Administration.md)
  * [Personal Profile Management](/Administration/Profile.md)
  * [Account Management](/Administration/Account.md)
     * [User Management](/Administration/Account/Users.md)
        * [Adding Users](/Administration/Account/Users.md#InvitingUsers)
        * [Changing User Privileges](/Administration/Account/Users.md#ChangingUserPrivileges)
        * [Removing Users](/Administration/Account/Users.md#RemovingUsers)
   * [SAML 2.0 Integration](/Administration/Account/SAMLIntegration.md)
   * [Broker Management](/Administration/Account/BrokerManagement.md)

* [Brokers](/Administration/Brokers.md#Brokers)
  * [Installing a Broker](/Administration/Brokers.md#Installation)
  * [Updating a Broker](/Administration/Brokers.md#Updating)
  * [Reinstalling a Broker](/Administration/Brokers.md#Reinstallation)
  * [Services](/Administration/Brokers.md#Services)
  * [Logs](/Administration/Brokers.md#Logs)
  * [Important Files and Directories](/Administration/Brokers.md#ImportantFilesandDirectories)
  * [Configuring a Custom Module with Reconnoiter](/Administration/Brokers.md#ConfiguringaCustomModulewithReconnoiter)
  * [Troubleshooting](/Administration/Brokers.md#Troubleshooting)

### Automation

* [API Overview](/API.md#API)
  * [Creating an Auth Token](/API.md#CreatinganAuthToken)
  * [Authorizing an Application](/API.md#AuthorizinganApplication)
  * [Retiring a Token](/API.md#RetiringaToken)


## Appendix

* [Supported Platforms](/SupportedPlatforms.md)
* [Keyboard Shortcuts](/KeyboardShortcuts.md)
* [Tech Support](/TechSupport.md)