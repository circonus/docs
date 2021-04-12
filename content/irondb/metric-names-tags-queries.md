---
title: Metric Names and Tags
weight: 20
---

# Metric Names and Tags

## Canonical Metric Names

Canonical Metric Names in IRONdb are the combination of a [metric name](#metric-names) and [tags](#tags).  For a general overview, canonical metric names would follow the following BNF description:
```
<canonical-metric-name> ::= <metric-name><tags-section>
<metric-name> ::= <characters>
<tag-section> ::= (<stream-tags> | <measurement-tags>)*
<stream-tags> ::= "|ST[" <tagset> "]" | ""
<measurement-tags> ::= "|MT{" <tagset> "}" | ""
<tagset> ::= <tag> "," <tagset> | <tag> | ""
<tag>  ::= <tag-category> ":" <tag-value> | <tag-category>
```
To be canonical:
 * A full canonical metric name must be less than 4095 characters in length.
 * `<tagsets>` must have duplicate `<tag>` items removed, and then sorted lexicographically by category, and then value.  

Submissions will be canonicalized before storage.

Examples:
 * `my_metric_name`
 * `my_metric_name|ST[color:blue,env:prod]`
 * `my_metric_name|MT{}|ST[env:prod]|MT{foo}|ST[color:blue]`

The final example would canonicalize into the previous example since measurement-tags are not currently stored.

### Metric Names

Metric names in Circonus may be an string of bytes other than a null character, or the stream-tag or measurement-tags identifiers (`|ST[` or `|MT{`).

### Stream Tags

Stream tags, as part of the metric name, are considered part of the unique identifier for the metric stream.

### Measurement Tags

While part of the specification, Measurement Tags are experimental and should not be used at this time.  They are not part of the unique identifier of a metric stream.

## Tags

Tags in IRONdb are represented as `category:value pairs` that are separated by
the colon (`:`) character.

Category strings may contain upper- and lowercase letters (`A-Z` and `a-z`),
numerals (`0-9`), and the following characters:

```
`+!@#$%^&"'/?._-
```

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

Which do not explicitly appear in metric names but can be used to find metrics
anyway. For example, you could query activity periods for all metrics within a
given `__check_uuid` even if none of those metrics were submitted with tags.

The `__activity` tag uses a special syntax to select only metrics that have data
(also know as activity) in a specific time range.  The value of the `__activity`
tag in the search expression should take the format of `<start_seconds>-<end_seconds>`
where each is represented in seconds since UNIX epoch. An example to find metrics
named `query_count` with data between 1569869100 to 1569870000 would be:

`and(__name:query_count,__activity:1569869100-1569870000)`

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

### `match impl` search options

While primarily used for the `__name` tag, there are other options that can be invoked for specific search types on tags.  These are known as "match impl" and have four options and can be activated with an optional `[<type>]` invocation at the beginning of the value.

 * `default`  - Literal matches with glob (`*`) support - as it's name implies, this is the default form
 * `exact`    - Literal without glob support - useful for matching metrics with a `*` character
 * `re`       - The following string is a regex - this is synonymous with `tag_cat:/<regex>/`
 * `graphite` - The string is part of a graphite-ingested name.  This function allows IRONdb to use graphite-specific search indexes for better performance.  

example:   `and(__name:[graphite]prod.thing.nyc2.meter.worker.counter)`  
example:   `and([graphite]prod.*.*.key:[re]foo.*bar[0-9]{5})`
