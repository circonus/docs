# Search Version 3 {#SearchVersion3}

Previous implementations of search within Circonus were based in the PostgreSQL
database that holds metadata about all the objects in Circonus, including the
list of available metrics.  Version 3 moves searching away from Postgres and
into the IRONdb time-series database that is the ultimate authority for all
things metric storage. This move empowers the Circonus UI to make use of all of
IRONdb's powerful tagging support.

At this time, only metric searches use this syntax. All other object types,
such as Checks, Alerts, etc. are searched using the existing [V2
syntax](/SearchingV2.md).

## Searching Metric Stream Tags

If you are supplying stream tags on the metrics you submit, you can search on
them using an expression that matches one or more tags. Expressions may be a
literal `category:value` for exact matches, a regular expression, or a glob
(wildcard) match string. You can use different types of expressions for the
category versus the value, as well (see below).

### Pattern Expressions

Patterns can be used in the category or the value, or both.

#### Regular Expression Patterns

Regular expressions follow the Perl-Compatible Regular Expression, v2 (PCRE2)
[syntax](https://www.pcre.org/current/doc/html/pcre2syntax.html), and are enclosed in `/ /`:
* `/category regex/:/value regex/`

#### Glob Patterns

Glob patterns use `*` as a wildcard, and can be used as prefix or suffix
completers or to identify a substring match:
* `categ*:value`
* `category:val*`
* `*egory:*alu*`

### Logical Operators

Matching tags may be added to or excluded from the result set based on the
Boolean operators `and`, `or`, and `not`.

Both `and` and `or` accommodate a single expression as well as a
comma-separated list of expressions:

| Query | Description |
|-------|-------------|
| `and(foo:bar)`          | exactly `foo:bar` |
| `and(foo:bar,baz:quux)` | all of `foo:bar` and `baz:quux` |
| `or(foo:bar,baz:quux)`  | any of `foo:bar` or `baz:quux` |

The `not` operator may only contain a single expression:
* `not(other:thing)`

Operators can also be grouped for more complex queries:
* `and(and(*:thing),not(other:thing))` : All `thing`s except `other:thing`

### Built-In Tags

There is a set of synthetic, "built-in" tag categories that appear for _all_
metrics, regardless of whether they were submitted with any other tags:

|Category|Description|
|--------|-----------|
| `__check_broker`    | Name of the broker on which the check runs |
| `__check_bundle_id` | ID of the check\_bundle |
| `__check_id`        | ID of the check |
| `__check_module`    | Name of the broker module that implements the check type |
| `__check_name`      | Name of the check |
| `__check_target`    | Target of the check |
| `__check_uuid`      | UUID of the check |
| `__name`            | Metric name |

### Tag Search Examples

#### Basic Examples

| Query          | Description |
|----------------|-------------|
| `and(app:myapp)`        | Category is `app`, value is `myapp` |
| `and(region:us-east-*)` | Category is `region`, value starts with `us-east-` |
| `not(env:dev*)`         | Elide tags where category is `env` and value starts with `dev` |

#### Using The Built-In Categories

| Query          | Description |
|----------------|-------------|
| `and(__check_broker:Chicago, IL, US)`    | All metrics on all checks that run on the broker "Chicago, IL, US" |
| `and(__check_bundle_id:1234)`            | All metrics on all checks in the check bundle `1234` |
| `and(__check_id:5678)`                   | All metrics on check ID `5678` |
| `and(__check_module:json)`               | All metrics on all checks that use the `json` module/type |
| `and(__check_name:My Check)`             | All metrics on all checks named "My Check" |
| `and(__check_target:myhost.example.com)` | All metrics on all checks having the target `myhost.example.com` |
| `and(__check_uuid:c0702928-5242-4939-a23c-b3fb5902b8a1)` | All metrics on the check whose UUID is `c0702928-5242-4939-a23c-b3fb5902b8a1` |
| `and(__name:foo)`                        | All metrics named `foo` |

#### Regular Expression Examples

| Query          | Description |
|----------------|-------------|
| <code>and(app:/^(my&#124;your)app$/)</code> | The value begins with `my` or `your`, followed by `app` |
| `and(region:/^eu-west-[12]$/)`              | Value is `eu-west-1` or `eu-west-2` |
| `not(env:/^dev/)`                           | Elide tags where category is `env` and value starts with `dev` |

#### Combining Expressions Examples

| Query          | Description |
|----------------|-------------|
| `or(__name:foo,__name:/^bar/)`      | Metric name is _either_ `foo` or something that starts with `bar` |
| `and(app:myapp,env:stage)`          | Has _both_ `app:myapp` and `env:stage` |
| `or(and(app:myapp,env:prod),and(app:yourapp,env:stage))` | Has both `app:myapp` and `env:prod` _or_ has both `app:yourapp` and `env:stage` |
| `and(and(app:myapp),not(env:dev))`  | Has `app:myapp` but _does not_ have `env:dev` |
| `and(__check_id:5678,app:myapp)`    | Metric is part of check `5678` and is tagged `app:myapp` |
| `and(__check_bundle_id:1234,app:*)` | Metric is part of check\_bundle `1234` and is tagged in the `app` category |

## Advanced Explorer

The advanced metrics explorer tool exists to help with learning how the new V3
Search works. On the Metrics Explorer page, clicking the "Adv" button at the
right end of the search bar opens the Advanced Explorer, which will help you
learn how to construct advanced tag search queries.

![Image: 'advanced_metrics_explorer.png'](/images/circonus/advanced_metrics_explorer.png)

For the primary field (Metric), a bare query term, e.g. `foo`, `foo*`, or
`/^foo/` may be entered to search for metric names.  A search may be refined by
entering terms in one or more additional fields. For example, entering
`available` in the Metric field and `10.9.8.7` in the Target field would result
in the query:

```
available and(__check_target:10.9.8.7)
```

Which would locate any metric named `available` on a check whose target is
`10.9.8.7`.
