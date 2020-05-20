---
title: Tags
weight: 20
---

# Tags

Tags in IRONdb are represented as `category:value pairs` that are separated by the colon (`:`) character.
Legal characters in an IRONdb tag category are defined by (perl RE syntax):

    perl -e '$valid = qr/[`+A-Za-z0-9!@#\$%^&"'\/\?\._-]/;

Tag values allow all of the above characters plus colon (`:`) and equals (`=`).

Any tag characters that do not fall into this set can still be ingested if they
are base64 encoded and passed in a special wrapper format.  More on this below.

Tags are ingested into IRONdb by placing the tags after the metric name with a 
tag separator character sequence: `|ST` and enclosed in square brackets `[]`. 
Commas separate each tag.

Examples:

    foo|ST[a:b]
    bar|ST[c:d]
    quux|ST[region:us-east-1,app:myapp]
    
Tags (including category and value) are limited to 256 characters for each tag.

Tags that contain characters outside of the acceptable set can be ingested by base64 encoding.
To store a metric like:

    foo|ST[~(category):<value>]
    
Where tilde `~`, parens `()`, and greater/less `<>` are outside of the character set you would encode
the category and value separately as base64 and enclose them in `b""`.  For example:

    foo|ST[b"fihjYXRlZ29yeSk=":b"PHZhbHVlPg=="]
    
It is always safe to encode *all* incoming tags in this way, the server will decide if the name
is safely representable without encoding and store the metric name decoded if it can.

> Note that this encoding also applies to tag searches if the search uses an unsupported character
> See [Searching Tags](/irondb/api/data-retrieval/)

## Tag Queries

Tag queries can be used to find or perform deletion of metrics using a boolean tag search.

### Query syntax

A query follows this eBNF syntax:

    query-param = all-of | any-of | not
    all-of = "and(" query-tag-list ")"
    any-of = "or(" query-tag-list ")"
	not = "not(" query-tag-el ")"
    query-tag-list = query-tag-el | query-tag-el "," query-tag-list
    query-tag-el = all-of | any-of | not | tag-category:tag-value | /cat regex/:/val regex/ | glob

A `not` clause may only contain a single expression, whereas `and`/`or` may each contain a list of expressions.
Each expression may be a literal `key:value` to match, a regular expression, or a glob match syntax.

Regular expressions follow the PCRE2 syntax and are of the form:

    /category regex/:/value regex/

Note that you can apply regular expressions independently to category or value or both:

    category:/value regex/
    /category regex/:value

Glob syntax supports the wildcard "`*`" and can be used as a completer:

    categ*:value
    category:val*
    *:*

The last will match every tag and pull everything for the account.

There are several special tags:

* `__name`
* `__check_uuid`
* `__activity`
* `__type`

Which do not explicitly appear in metric names but can be used to find metrics
anyway. For example, you could query activity periods for all metrics within a
given `__check_uuid` even if none of those metrics were submitted with tags.

The `__activity` tag uses a special syntax to select only metrics that have data
(also know as activity) in a specific time range.  The value of the `__activity`
tag in the search expression should take the format of `<start_seconds>-<end_seconds>`
where each is represented in seconds since UNIX epoch. An example to find metrics
named `query_count` with data between 1569869100 to 1569870000 would be:

`and(__name:query_count,__activity:1569869100-1569870000)`

The `__type` tag uses a limited syntax not supporting regular expression
matching. It can match three literal values: `histogram`, `numeric`, and
`text`.  As an example of matching only metrics that have seen histogram
data, `and(__type:histogram)` could be integrated into the search expression.

If your query uses an unsupported tag character you must enclose the query in base64
notation:

`and(b"...":b"...")`

To pass through the unsupported characters. Note that the asterisk (`*`) for
glob syntax is allowed unencoded for searches, but not for tag categories or
values themselves.

If using regular expression patterns, the `/ /` should not be encoded. To
perform a regex match on `(foo|bar)`, you would use the form
`b/KGZvb3xiYXIp/`.

See the examples below for more color.

### Query Examples

You have ingested the following metrics:

    foo|ST[region:us-east-1,app:myapp]
    bar|ST[region:us-east-2,app:myapp]
    baz|ST[region:us-west-1,app:myapp]
    quux|ST[region:us-west-2,app:yourapp]

To find all of the metrics under `app:myapp` your query would be:

`and(app:myapp)`

To find all of the metrics in `us-east` regardless of sub-region you would do:

`and(region:us-east-*)` in glob syntax or:

`and(region:/us-east-.*/)` in regex syntax.

To find `bar` or `quux` you could either do:

`or(__name:bar,__name:quux)`

or:

`or(and(region:us-east-2,app:,myapp),and(region:us-west-2,app:yourapp))`
