# Search Version 2 {#SearchVersion2}
Version 2 of Circonus searching moves away from the analyzed "combination of items" field and instead looks at the name or title of the item on the particular page or widget.

The searching takes place in our Postgres database and makes use of the pg_trgm module and the concept of similarity. When you search for an item like "foo", Circonus sends that term to the DB and asks for items with a similar name. You can still use wildcards; for example, if you search for "foo*", Circonus instead sends a like query for anything starting with foo.

This similarity means that if we have an item with the title "Foobar" and we search for "foo", our title is similar enough to match. However, if our title is "Foobar server statistics", searching for just "foo" is not similar enough due to the extra bits that don't match, so here we would want to search for "foo*".  Details on how this similarity works are at the end of this section.


### Basic Search Examples {#BasicSearchExamples}

Search for names _similar_ to the word "foo":

    foo

Search for the exact name "foo"

    "foo"

Search for names beginning with "foo":

    foo*

Search for names that contain "foo" either at the start, end, or in the middle:

    *foo*

Search for names similar to "foo bar":

    foo bar

Search for a specific IP or hostname:

    "192.168.1.1"
    "www.circonus.com"

Search for names that contain "foo" followed by "bar" but with possible other items in between:

    "*foo*bar*"

### Narrowing Search Using Specific Terms {#NarrowingSearchUsingSpecificTerms}
There will be times where you want to narrow your search by providing additional details, like a check type, or a broker name, etc.  To accomplish this, each item has a list of fields that you can specify in parenthesis to refine searches. Some examples of this would include:

Search for a check with the name like foo on the Ashburn broker:

    foo (broker:Ashburn*)

If needed, you can narrow by multiple items separated by a comma:

    foo (tags:os:linux,datacenter:ashburn)

If the term you want to search on has a comma in it, to prevent the system from treating that as a list wrap the term in quotes:

    foo (name:"name, with comma")


### Default Search Field and Available Terms {#DefaultSearchFieldandAvailableTerms}
Below is a list of objects that can be searched, what the primary field is we search on, and a list of all available terms to further refine the search.

Note: Metrics search uses a different syntax. See the [Metric
Search](/SearchingV3.md) for details on how to search for metrics. All other
object types and their available search terms are described below.

Alerts:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|host / target|string|The host the metric is from|*|
|name / check_name|string|Name of check||
|metric / metric_name|string|Name of the metric||
|type / module|string|The type of check (http, json, etc.)||
|broker|string|Name of the broker||
|active|boolean (0,1)|If the alert is cleared or not||
|tags|string|Tags associated with this object||

Annotations:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|title|string|Annotation title|*|
|description|string|Annotation description||
|category|string|Annotation category||
|start_on_epoch|integer|Epoch seconds start on (>=)||
|stop_on_epoch|integer|Epoch seconds stop on (<=)||

Checks:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|name / check_name|string|Name of check|*|
|check_uuid|string|UUID of an individual check||
|check_bundle_id|integer|ID of the check bundle the check is in||
|type / module|string|The type of check (http, json, etc.)||
|host / target|string|The host the check runs on / against||
|broker|string|Name of the broker the check is on||
|active|boolean (0,1)|If the check is currently active||
|tags|string|Tags associated with this object||

Checks Bundles: (API-only)

|Term|Type|Description|Primary Field|
|---|---|---|---|
|name / check_name|string|Name of check bundle|*|
|type / module|string|The type of check (http, json, etc.)||
|host / target|string|The host the check runs on / against||
|active|boolean (0,1)|0 = bundle has no active checks, 1 = bundle has at least one active check||
|tags|string|Tags associated with this object||


Contact Groups:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|name|string|Name of contact group|*|
|tags|string|Tags associated with this object||

Graphs:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|title|string|Graph title|*|
|description|string|Graph description||
|notes|string|Graph notes||
|tags|string|Tags associated with this object||

Maintenance Windows:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|maintenance_item|string|The name of the "thing" in maintenance, i.e. the metric name, host, etc.|*|
|type|string|The type of thing in maintenance (host, check, account, metric)||
|notes|string|Notes on the maintenance window||
|tags|string|Tags associated with this object||

Metric Clusters:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|name|string|Name of cluster|*|
|description|string|Description of the metric cluster||
|tags|string|Tags associated with this object||

Rules:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|metric_name|string|Name of the metric this ruleset is tied to|*|
|check_name /  name|string|Name of check||
|host / target|string|Host the metric is for||
|broker|string|Name of the broker||
|type / module|string|The type of check (http, json, etc.)||
|check_id|integer|ID of the check||
|check_bundle_id|integer|ID of the check bundle||
|active|boolean (0,1)|If the metric is currently being collected||
|active_check|boolean (0,1)|If the check the metric was collected from is currently active||
|tags|string|Tags associated with this object||

Ruleset Groups:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|name|string|Name of ruleset group|*|
|tags|string|Tags associated with this object||

Templates:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|name|string|Name of template|*|
|master_host / host / target|string|Master host of template||
|notes|string|Notes on template||
|tags|string|Tags associated with this object||

Worksheets:

|Term|Type|Description|Primary Field|
|---|---|---|---|
|title|string|Title of worksheet|*|
|description|string|Description of worksheet||
|notes|string|Notes on worksheet||
|tags|string|Tags associated with this object||


### Filtering Search Results with Tags {#FilteringSearchResultswithTags}
Circonus also allows you to use tags to filter your search results in the same way you would refine the search using a specific term as above.

For example, to search for items with the word "foo" that are tagged with "application:bar", you would enter the following search terms:

    foo (tags:application:bar)

To filter your search results using multiple tags, separate the tags with commas (,). For example:

    foo (tags:application:bar,os:omnios)


### How Similarity Works {#HowSimilarityWorks}
As stated above, the default analysis for a search result is how similar it is to a search term on the primary field. This boils down to how many of the trigrams (groups of 3 characters) made from this term match the trigrams of the term we are matching.

For example, let's assume we are using the search term "foo", and searching for 2 checks, one simply called "foobar", and the other called "foobar host stats". Note that Circonus search is case insensitive, so examples will be in lower case.

First, this is what the trigrams for the terms look like:

```
circonus=> select show_trgm('foo');
        show_trgm
-------------------------
 {"  f"," fo",foo,"oo "}
```

```
circonus=> select show_trgm('foobar');
              show_trgm
-------------------------------------
 {"  f"," fo","ar ",bar,foo,oba,oob}
```

```
circonus=> select show_trgm('foobar host stats');
                                          show_trgm
---------------------------------------------------------------------------------------------
 {"  f","  h","  s"," fo"," ho"," st","ar ",ats,bar,foo,hos,oba,oob,ost,"st ",sta,tat,"ts "}
```

Now that we've broken down our terms, we need to compare their trigrams.  In order for us to say a term is similar enough to return it in a search, the two trigrams have to have a 30% similarity.

So matching foo on itself we can see that it is a 100% match:

```
circonus=> select similarity('foo', 'foo');
 similarity
------------
          1
```

And if we look at foo compared to foobar, we see they are similar enough to match:

```
circonus=> select similarity('foo', 'foobar');
 similarity
------------
      0.375
```

However, when we look at foo vs foobar host stats, we cross the edge of similarity due to the extra characters in the name:

```
circonus=> select similarity('foo', 'foobar host stats');
 similarity
------------
   0.157895
```


So while you might expect foobar host stats to match because it starts with foo, it didn't because it wasn't similar enough.  In this case you have two options, first would be to simply add a    to your search to pull everything starting with foo, or if you still wanted to only get items that are similar, just add more of the string you want.

```
circonus=> select similarity('foobar', 'foobar host stats');
 similarity
------------
   0.388889
```
or
```
circonus=> select similarity('foobar host', 'foobar host stats');
 similarity
------------
   0.666667
```


### Check Types {#CheckTypes}

Some check types are shortened in the UI for brevity or to make it clearer what is being checked.  The below table translates what the UI shows to how the type is stored in the database.

|UI Name|Search Name|
|---|---|
|apache|http:apache|
|cim|cim|
|cloudwatch|cloudwatch|
|collectd|collectd|
|composite|composite|
|couchdb|json:couchdb|
|dcm|dcm|
|dhcp|dhcp|
|dns|dns|
|elasticsearch|elasticsearch|
|external|external|
|ga:campaigns|googleanalytics:m2|
|ga:content|googleanalytics:m3|
|ga:ecommerce|googleanalytics:m4|
|ga:events|googleanalytics:m7|
|ga:goals|googleanalytics:m6|
|ga:searches|googleanalytics:m5|
|ga:visitors|googleanalytics:m1|
|ganglia|ganglia|
|haproxy|haproxy|
|http|http|
|http_test|http_test|
|httptrap|httptrap|
|imap|imap|
|jmx|jmx|
|json|json|
|keynote|keynote|
|keynote_pulse|keynote_pulse|
|ldap|ldap|
|memcached|memcached|
|momentum|snmp:momentum|
|momentum|ec_console|
|mongodb|json:mongodb|
|mssql|sqlserver|
|munin|munin|
|mysql|mysql|
|newrelic|newrelic_rpm|
|nginx|nginx|
|nodeagent|json:nad|
|nodewindowsagent|circonuswindowsagent:nad|
|nrpe|nrpe|
|ntp|ntp|
|oracle|oracle|
|ping|ping_icmp|
|pop3|pop3|
|postgres|postgres|
|rabbitmq|rabbitmq|
|redis|redis|
|resmon|resmon|
|riak|json:riak|
|selfcheck|selfcheck|
|smtp|smtp|
|snmp|snmp|
|snmptrap|snmptrap|
|ssh2|ssh2|
|statsd|statsd|
|tcp|tcp|
|varnish|varnish|
|vmware|vmware|
|windows|circonuswindowsagent|


## Advanced Search Builder {#AdvancedSearchBuilder}
The advanced search builder tool exists to help with learning how the new Search (v2) works. On supported pages, after expanding the search field you will see an "advanced" button to the right of the search field. Clicking this will expand the advanced search builder which will help you learn how to construct advanced search queries.
![Image: 'Advanced_Search_Builder2.png'](/images/circonus/Advanced_Search_Builder2.png)

Within the primary field, you may use quotation marks for exact matching ("foo"), wildcard asterisks for substring matching (foo*, *foo, or *foo*bar*), or plain text for trigram matching.

Within the non-primary fields, only exact matching and substring matching is supported. Note that your non-primary field entries will be automatically wrapped in quotation marks if you don't use wildcards.


## Searching Documentation {#SearchingDocumentation}
This User Manual, as well as the [API Documentation](https://login.circonus.com/resources/api), are searchable as well. However, the search bar in the documentation does not use the same Search functionality described above. Instead, this search bar is powered by a Google Custom Search.
