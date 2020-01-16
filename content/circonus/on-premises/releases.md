---
title: Releases
---

# Release Notes: 2019-03-11

## caql_broker

Version: 0.1.1551739521

* No user-visible changes.

## data_storage

Version: 0.1.1552074869 (8c8c2dc)

* Make efficiency changes to internal locking mechanisms to improve CPU
  utilization.
* Fix bug where metadata deletions could break in-memory indexes.

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1551984179 (8833a44)

* Implements the full functionality of the /metric endpoint and switches from
  using the standalone implementation of metric search, to the new version
  incorporated into the GoAPI metric service.
* Fixes some issues with v3 IRONdb query parsing when using metric search.
* Fixes a memory leak that was occurring with use of an upstream library.
* Fixes an issue with JSON parsing that was affecting several services.
* Removes or converts all use of the `metric_notes` table to the new
  `ruleset_notes` table.

## libmtev

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 1.6.4

* Fix mtev_hooks to be usable with more compiler warning flags.
* Fix starvation issue in fq module hook polling.

## Notification

Version: 0.1.1551816825 (18e4517)

* No user-visible changes.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 0.1.1551739521 (42e84df)

* Increase max metric name length in HTTPtrap module.

## Web UI/API

Version: 0.1.1552061759 (32e54a3)

* Add support for clustered Enterprise Brokers for fault tolerance. This is a
  beta feature.
* Bugfix for dashboard metric selection dialog.
---
title:
---

# Release Notes: 2019-03-25

## caql_broker

Version: 0.1.1552591160

* Minor logging change.

## data_storage

Version: 0.1.1553020531 (ace1097)

* Support caching metric metadata in NNT cache.
* Add support for pulling tagged stats by adding a "format=tagged" querystring
  to the stats.json API endpoint.
* Move `snowthimport` error log message "file already found" to the debug log.
* Fix typo in statistics: "hits_meta" is now "hit_meta".

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1553269234 (68f1106)

* Efficiency improvements to reduce calls to `data_storage` backend.
* Better handling of lost database connections.
* Metric search speed improvements.
* Add support for new metric API query parameters, `active_start`, `active_end`
  * See "Metric Search Query Parameters" in the [Circonus API docs](https://login.circonus.com/resources/api/calls/metric).

## libmtev

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 1.6.5

* mtev_memory: prevent multiple gc_return queue deinit (crash fix)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 0.1.1552591160 (0996c30)

* Filterset fixes for stream tags.

## Web UI/API

Version: 0.1.1553276106 (09e6ec8)

* (UI) Allow the timeline to be shown above shared graphs, including alerts and
  text metrics from the current graph, if desired.
* (UI) Updated the Metrics Explorer and Metric Detail pages so when a metric
  has multiple types (numeric, text, histogram) due to a type change, the user
  can switch between all available types for historic data visibility.
* (UI) Added a heads-up legend on the graph when in datapoint select mode
  (enter this mode by holding down the 's' key and hovering over the graph).
* (API) Add support for new metric API query parameters, `active_start`,
  `active_end`
  * See "Metric Search Query Parameters" in the [Circonus API docs](https://login.circonus.com/resources/api/calls/metric).
---
title:
---

# Release Notes: 2018-09-03

Includes changes since release 2018-08-16

## data\_storage

Version: 0.1.1536172853

* Expose stream tags in search results from the Lua API
* New, optional journal and background job for managing activity tracking
  outside the normal ingest path
* CAQL: new `group_by` function
* Stop statically linking libzfs, always dlopen() if available
* Parse "seconds.milliseconds" from incoming histogram records
* Fix log enable/disable options (-L/-l)
* Replace Lua histogram implementation with one that makes use of the C
  functions from libcircllhist for efficiency.
* Prevent race in the REST delete endpoints
* Add check-wide delete methods for raw and numeric rollup data

## fault\_detection

Version: 0.1.1534363526

* Add flag to disable rule processing

## libmtev

Version: 1.5.4

* Fix `mtev.shared_seq()` producing duplicate keys during startup.
* Add `mtev_cluster_node_get_idx` to get a node's deterministic offset in a
  cluster topology.
* Make `mtev_hash_merge_as_dict` safe for NULL values.
* Fix reported memory leak in DWARF reading.
* Fix race conditions in freeing `mtev_websocket_client_t`.
* Fix race in lua state (mtev lua coroutine) GC.
* Remove local callback latency tracking.
* Add per-pool callback latency tracking.
* Skip epoch reclamation in threads that have never freed anything.
* Always do asynchronous barrier epoch collection from the eventloop.
* Batch asynchronous epoch reclamation to reduce epoch synching.
* Fix lua/ssl\_upgrade eventer actuation.
* Add granular lua garbage collection configuration. default: step 1000
  time before a full collect.
* Monitor process now passes TERM, QUIT, and INT signals to child.
* Fix a bug where we were not always closing the socket/connection in
  `lua_web_resume` - could cause connections to hang.
* Fix a lock contention issue that occurred at startup.
* Fix a memory leak in the lua path.
* Fix some clean targets in the Makefile that were inadequate.
* Move some logging from error log to debug log.
* Fix `gc_full=1` to fire on every invocation as documented.
* Fix asynchronous memory reclamation.
* Protect against attempting to close invalid file descriptors.
* Do proper cleanup of eventer objects, even if not registered.
* Fix internal accounting stats for eventer allocations.
* Don't gate startup of event loops.
* Fix a leak of per-thread Lua closure structs.

## Reconnoiter

Version: 0.1.1536172454

* Change the default behavior of check stats to not be perpetually
  cumulative (and thus potentially memory exhausting).
* Fix null-termination of tags in a Prometheus check
* Avoid null dereference in Lua checks
* Move to new Lua garbage-collection capabilities in libmtev 1.5
* Initiate Lua GC whenever returning from a coroutine
* Fix incorrect initialization function for check stats
* `noit_check_resolver` should protectively initialize

## Web UI/API

Version: 0.1.1536180382

* UI: Fix JS error when sharing a graph.
* UI: Performance fix for check creation stalled when a large number of
  metrics are present.
* UI: Fix bug related to honoring grid preference on worksheet and
  metrics pages.
* UI: Fix bug where a plus (+) character wasn't searchable within a 
  metric name.
* UI: Fix problem with metric names not showing correctly in metric list 
  dialogs.

---
title:
---

# Release Notes: 2019-07-29

[EL7 pinned repo](https://login.circonus.com/resources/docs/inside/InstallCentos.html#el7-repo): `baseurl=http://updates.circonus.net/centos/7/release-20190729/x86_64/`

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of the 2019-07-01 release, GoAPI no longer uses the PostgreSQL database
for metric searches, so it is necessary to run this script before updating to
the current release, if you have not already. If you are updating from a
release prior to 2019-05-06, run this script immediately after updating.**

## caql_broker

Version: 0.1.1564054667 (17914d0)

* Fix bug where checks were not replicating in a cluster, due to an ACL
  problem.

## data_storage

Version: 0.1.1564067063 (29c2d48)

* Fix a bug in CAQL `find()` where fully completed queries would be reported as
  truncated.
* Don't truncate CAQL `find()` queries that have been running for less than 4
  seconds.
* Fix bug where we would occasionally return null data when doing a proxy using
  the rollup endpoint.
* Fix rare crash bug in journal replication.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

Version (faultd): 0.1.1563974858 (d20e534)

* No user-facing changes

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.11.0

* No changes since [2019-06-03](/Changelog/20190603.md#fq)

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1563940604 (1fdc21c)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality. In
> previous releases, the new search functionality needed to be enabled with an
> environment variable setting: `GOAPI_IRONDB_TAG_SEARCH`. That variable
> setting is no longer needed or used.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* Bug: URL decoding was being processed more than once on some requests,
  resulting in changes to search queries.

## Hooper

Version: 0.1.1564162107 (a9bdb41) (EL7, OmniOS)

Version: 0.1.1564162107 (fcd1316) (EL6)

* Fix permission issue with stratcon REST API and the `noit_version_check.js`
  script. A missing ACL rule caused the script to be unable to pull broker
  capability information.
* Add a module-load configuration to stratcon, a new dependency of the existing
  `raw_ingestor` module that loads metric data into IRONdb.
* Configure a watchdog glider for faultd so that crash reporting works
  properly.

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.6.24

* Change the http/1 driver to drain inbound data before completing the request
  (empty reponses to HTTPtrap checks).
* Always remove epoll registration when migrating to a new thread (IRONdb crash
  bug on Linux).
* Fix eventer reference tracking for cross-thread triggers (IRONdb crash bug).

## notification

Version: 0.1.1551816825 (18e4517)

* No changes since [2019-03-11](/Changelog/20190311.md#notification)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1563977300 (cc1af6f)

* (broker) Avoid double logging of HTTP errors in the HTTPtrap module.
* (broker, caql_broker) Increase timeout for cluster configuration pulling.

## Web UI/API

Version: 0.1.1564083169 (5cc55db)

* UI: Ruleset creation UI now disables non-working features (buttons and fields
  that will not function until the ruleset is saved), then refreshes after the
  first save.
* UI: Enable display of deleted rulesets (such as when linked from an alert
  view).
* UI: paging_size preferences could lead to timeout in loading graphs page.
* UI: Fix how metric names containing pluses are decoded (from the URI) on the
  Metric Details page.

## web_stream

Version: 0.1.1556920684 (e0a3880)

* No changes since [2019-05-06](/Changelog/20190506.md#webstream)
---
title:
---

# Release Notes: 2018-11-05

## caql\_broker

Version: 0.1.1541163185 (8d216aa)

* Fix histogram handling.
* Surface more warnings in the error log.
* Don't log the first HTTP retry.

## data\_storage

Version: 0.1.1541107572 (386a237)

* Performance improvements to parsing surrogate database at startup.
* Fix some potential crashes.
* Disable saving ptrace stdout output files in the default circonus-watchdog.conf file.
* Improve error checking when opening NNTBS timeshards.
* Improve surrogate DB startup informational logging.
* Various memory usage optimizations to reduce the amount of memory needed for snowthd to operate.
* Remove global variables from Backtrace.io traces.
* Add ability to delete surrogates from the system that are no longer used.
* Remove temporary files used during reconstitute - there were a handful of
  files staying on disk and taking up space unnecessarily.
* Increase timeout for pulling raw data during reconstitutes.
* Adopt a more time- and space-efficient strategy for graphite searches.
* Fix logging bug where long lines could end up running together.
* Fix crash bug in histogram fetching API.

## FQ

Related roles: mq

Version: 0.10.14

* No user-facing changes since 0.10.12.

## libmtev

Related roles: broker, data\_storage, stratcon, web\_stream

Version: 1.5.19

* Have luamtev use a default pool concurrency of 1, add -n option.
* Disable log dedup in luamtev by default.
* Fix improper calculation of required space in base64 encode/decode that could
  allow two bytes of overrun in decoding into a "too small" buffer.
* Make `mtev_memory_{begin,end}` recursively safe.
* Use asynch barrier SMR in jobqs.
* Avoid clipping last letter off long log lines.
* Apply lua GC on next tick and not inline.
* Make "cs" the default jobq memory safety level.
* Fix off-by-on error in `lua_web` lua stack management (crash fix).
* Move SMR maintenance into the eventer (out of a callback).
* Fix livelock in `mtev_intern` when racing for a removed object.
* Make the SMR cleanup in thread termination asynch (fix CPU burn).

## Reconnoiter

Related roles: broker, data\_storage, stratcon, web\_stream

Version: 0.1.1541084944 (ec587d4)

* Better validation within the ping\_icmp module.
* Send full metric name with tags to web\_stream service. Fix for tagged
  metrics not showing up in graph play and dashboards.
* Transient checks failed to update `target_ip` and `name`.
* Expose selfcheck metrics under the "broker" namespace as well.
* Explicitly disable dedup on noit feed elements. Fix for "gappy" collection of
  some metrics.

## Web UI/API

Version: 0.1.1541117507 (96212ab)

* UI: Remove "beta" decal from CAQL integrations menu.
* UI: Stop mass updating `last_modified_*` on checks by bundle. Fixes unnecessary
  DB query.
* API: Set check target to existing value on update if not passed by client.
* UI: Re-introduce 'last values' to check details page at metric load time.

---
title:
---

# Release Notes: 2018-12-03

## caql_broker

Version: 0.1.1543406236 (0ba5459)

* Add a counter for dropped messages.
* Add `/v2` to metric_cluster URL.

## data_storage

Version: 0.1.1543521136 (dace2b5)

* Increased speed of surrogate cache loading at startup.
* Add `snowthsurrogatecontrol` tool, which allows offline review and
  modification of the surrogate database.
* Fix reconstitute bug edge case where certain metric names would cause the
  reconstitute to spin/cease progress.
* Fix bug where certain HTTP requests could hang.
* Change default raw db conflict resolver to allow overriding old data with
  flatbuffer data from a higher generation.
* Fix crash in metric serialization.
* Memory utilization improvements.
* Memory-leak fixes.

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1543502147 (c9c5e08)

* Preserve escape sequences in alert_formats JSON from database.
* Add `X-Circonus-More-Items` response headers to metrics search responses,
  when needed.
* base64-encode all name/tag queries when sending search requests to
  data\_storage/IRONdb.

## Hooper

Version: 0.1.1543866611 (0a308b7)

* Add crash-reporting support (Backtrace) to web_stream.
* Restart stratcon service when its package updates.
* Add custom-generated Diffie-Hellman (DH) parameters for stratcon TLS
  connections.
* Fix first-time setup issue with missing MQ directory.
* Change a comment line in circonus.conf so as not to interfere with GoAPI
  config parsing.

## libmtev

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 1.5.26

* Fix DNS fast failures in lua that could cause null pointer dereference.
* Fix support for aco-style REST handlers. This bug manifested as failed upload
  support.
* Fix naming of aco events. They now report the underlying event.
* Rearchitect the watchdog timeouts to allow children to cooperate and signal
  into the correct thread so we get a SIGTRAP-induced stack trace from the
  offending thread. (only systems with pthread_sigqueue, like Linux).
* Articulate in logs and in glider invocation which thread watchdogged.
* Fix hangs in HTTP content upload when clients paused in the middle of a block
  (bug introduced in 1.5.24)
* Fix ACO registry mismanagement causing crashes.
* Fix leak of `ck_epoch_record` on thread termination.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 0.1.1543411336 (2f9fa32)

* Fix null-pointer dereference in DNS check.
* Include thread names for jlog threads (assists with debugging).

## Web UI/API

Version: 0.1.1543608912 (eb918bc)

* Update selfchecks with metrics relevant to enzo-c.
* Fix for invalid search query errors.
* Add `graphite_tls` to check modules database table for new installations.
* Let `create_super_admin.pl` take a password on the command-line. This allows
  for more automation for initial setups.
* UI: Fix viewing of metric names containing a "/" character.
* API: Fix for database deadlock when updating large numbers of checks in a
  single transaction.
* UI: Do not show broken link in popup dialog on graphs page.
* UI: Fix graph cluster datapoint expansion to properly handle histogram
  metrics from new GoAPI search service.
* API: Document that GoAPI search supports the `X-Circonus-More-Items` response
  header for paged results.
* UI: Clean up the layout of the Integrations module grid.
---
title:
---

# Release Notes: 2018-12-17

## caql_broker

Version: 0.1.1544737073 (b5c4ce9)

* Fix issue with search results not being updated regularly. Expect more load
  on the search API endpoint after updating.
* Fix issue with caql-broker not being able to start when a snowth node was
  reconstituting.

## data_storage

Version: 0.1.1544734951 (83e0481)

* Two related bug fixes in the surrogate DB that manifest with metrics whose
  total stream tag length is more than 127 characters. Metrics with such tag
  sets could appear to be missing from search results.  Metrics that do not
  have any stream tags, or whose total tag set is less than 127 characters, are
  not affected.
* Fix bug that causes hanging when trying to delete certain metrics.
* Fix occasional crash related to reading NNTBS data.
* Add optional metric-delete debug logging.

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1544719966 (ce6484c)

* Add HTTP basic auth support to metric search endpoint

## Hooper

Version: 0.1.1544473897 (53351fe)

* Allow multiple `caql_broker` hosts, configured as a cluster.
* Restart GoAPI search service on changes to `circonus.conf` template.

## Web UI/API

Version: 0.1.1544731582 (c8659a4)

* UI: Check details bugfix: when decoding a histogram 'last value', don't error
  on 0 values.
---
title:
---

# Release Notes: 2019-02-25

## caql_broker

Version: 0.1.1549926243

* No user-visible changes.

## data_storage

Version: 0.1.1550864137 (f65de2d)

* Node will now log error and exit when writes to RocksDB fail - previously, it
  would log the message and continue running, which could lead to data loss.
* Fix off-by-one area in internal metric data storage struct that could cause
  potential crashes.
* Fix license expiration date display bug on GUI.
* Add optional metric prefix parameter to `/tag_cats` and `/tag_vals` APIs.
* Fixes to several timeout issues.

## libmtev

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 1.6.3

* When spawning a child asynch job within an existing asynch job, persist the
  subqueue assignment rather than always making it the first subqueue every
  time. This will help in job scheduling fairness.
* Expose `EVENTER_ASYNCH_COMPLETE` as a preferred and more descriptive literal
  for the old `EVENTER_ASYNCH` literal. `EVENTER_ASYNCH` is informally
  deprecated.
* Add aco support for non-simple asynch work (with all three asynch call
  phases).
* Add aco support for enqueueing asynch work with deadlines.
* Add support for eliding asynch work on jobs when a deadline is set and no
  cancellation type is provided (don't start work when it is already past the
  deadline).
* Fix fair scheduling of subqueues when there is a single job in flight.
* Add test for jobs subqueues and deadlines.
* Add stats exposure for mtev_intern pools, including via the mtev console.
* Change `mtev_hash` implementation to XXH64 to improve speed.
* Fix `mtev_intern` freelist manipulation bug resulting in leaks and crashes.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 0.1.1549926243 (ee165e9)

* Expose libmtev stats in stratcond.

## Web UI/API

Version: 0.1.1550868640 (6d03bcf)

* Deprecated metric notes+link in the metric API (this was the same as ruleset
  notes+link and now will be available only via rulesets.) Also removed notes
  from the metric details page.
* Fix account-level metric count rollup to update hourly with the maximum
  active metric count in the last 24 hours. This adds JustSendData support to
  the value.
---
title:
---

# Release Notes: 2019-02-11

## caql_broker

Version: 0.1.1549570160 (752f3ab)

* No user-visible changes.

## data_storage

Version: 0.1.1549590295 (eeb1fc4)

* Fix stats and dashboard for NNTBS data
* Enhance snowthsurrogatecontrol to dump all fields, as well as reverse or
  deleted records.
* Fix various bugs that could result in crashes or deadlocks.
* Various performance improvements.
* Improvements to Graphite tag search - respect Graphite name hierarchy in
  search results.

## Hooper

Version: 0.1.1548792217 (772364f) (EL7, OmniOS)

Version: 0.1.1548792217 (381819a) (EL6)

* Add hub cron job to act on the broker reconstitute queue in the DB.


## libmtev

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 1.6.1

* Add HTTP/2 support (via libnghttp2).
* Reduce memory usage in highly concurrent configurations on Linux by limiting
  the number of file descriptors in a given invocation of epoll_wait.
* Fix memory leak in SMR queue during thread shutdown.
* Make base64 decoding also accept URL alphabet (rfc4648).
* Fix crash in hash to lua table conversion where value is NULL.
* Provide mtev_intern compaction as a side effect of mtev_intern_release (this
  prevents pathological mmap leaks if programmers fail to compact).
* Fix several http bugs around payload reading.
* Fix mtev.notify/mtev.waitfor when the notify originates in an unyieldable
  context and a waitfor is pending. (C -> lua -> C -> lua -> mtev.notify)
* Fix bug in mtev.notify/mtev.waitfor where trying to notify from an
  unyieldable context multiple times in a row could cause crashes or hangs.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 0.1.1549550897 (6eb4764)

* Fix crash bugs involving DNS resolver cache.

## Web UI/API

Version: 0.1.1549662440 (b05c4d1)

* UI: Fix decommission broker button.
---
title:
---

# Release Notes: 2019-06-17

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

## caql_broker

Version: 0.1.1559587566 (08cc154)

* Better enforcement of search API timeouts.

## data_storage

Version: 0.1.1560384233 (97d6e38)

* Fix crash in full delete due to buffer overflow in an error message. The code
  has been audited for similar usage patterns and safer functions swapped in.
* Removed a misleading "missing activity cf" message from the errorlog on
  startup.
* Default text fetching to provide a prior sample if the requested start offset
  is between recorded samples. Expose `lead=<true|false>` query string
  parameter, defaulting to true.
* Prevent null pointer exception in the data replication path when the check
  name is undefined. (crash fix)
* CAQL: Assert that start times are before or equal to end times in queries.


## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1560472428 (ae192c7)

* The `/check` and `/metric_cluster` endpoints are converted from the Perl
  service to GoAPI services.
* Bug: User tokens that were still active, but were associated with a user with
  removed role or other permissions were failing to authenticate on `/account`
  endpoints.
* Bug: The `_active` field for the `/check` endpoint could contain inaccurate
  data.
* Improved thread safety, eliminating some unlikely, but possible, race
  conditions.
* Bug: The parser for v3 metric search queries contained a problem that could
  result in certain searches, containing unclosed quotation marks, triggering a
  process crash.
* Bug: Metric search v3 query processing was not correctly handling colon
  characters in tag values.

## Hooper

Version: 0.1.1560781040 (4c961bb) (EL7, OmniOS)

Version: 0.1.1560781040 (5bfd2ea) (EL6)

* Remove obsolete data import cron job from web_frontend hosts. This was an old
  feature for bringing historical, external data into Snowth. This can now be
  done by sending data to a broker and specifying the timestamp.
* Updated caql_broker configuration template, allows for including all API
  hosts in caql_broker configuration, not just the first one.
* circonus-ssl-term service is now native systemd (EL7 only)

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.6.13

* Fix crash (double free) in sending AMQP messages in duplicate, seen in
  faultd.
* Avoid DWARF scanning in luamtev by default, speeding up application start.
* Add hooks and a module for watching HTTP request servicing.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1560360681 (f9bd840)

* Broker: HTTPtrap checks will now report the number of metrics filtered
  (suppressed from collection), in addition to the number collected ("stats").

## Web UI/API

Version: 0.1.1560553557 (f17fcea)

* API: The `/check` and `/metric_cluster` endpoints are converted from the Perl
  service to GoAPI services.
* UI Bug: Grid Graphs' legends in narrow viewports (under 1200px) can be
  unreadably narrow, so they're now allowed to be wider, up to the full grid's
  width.
* UI Bug: The HTTP check config was missing the 'uri' field so when
  creating/editing a check, any entered target URL was reduced to only the host
  (the path was stripped off).
* UI Bug: When creating a graph from the Metrics Explorer, use the metrics'
  display names (without stream tags) when possible.
* When creating an HTTPtrap check in the UI, the new check will now default to
  non-asynchronous data collection, because this is more logical for most
  people.
* Updated the design of informational grids across the detail pages.
* UI Bug: Fixed the check module page's 'Existing' tab, where deleting a check
  would cause other checks to erroneously disappear.
* UI Bug: Fixed the 'Authorize PagerDuty' button on not-yet-authorized
  PagerDuty Contact Groups.
* UI Bug: Fixed user count shown on system dashboard, so it doesn't include the
  automatic account user.
* UI: Improved Dashboard list page: added sorting arrows to the table column
  header links, and made Title the default sort field.
* UI Bug: Fixed prompt modals' datepickers so they aren't clipped by the modal
  body.
* UI: Fixed Metrics Explorer bug: selecting a metric for graph creation, then
  paging to the next or previous page of metrics would forget the selected
  metrics from non-visible pages.
* Bug: Fixed error with missing lib "Circonus::DB" in check tag migration
  script.
* Updated Metric Details page so it now shows its Check UUID and canonical
  Metric name, and also indicates that the tags shown at the bottom of the page
  are not editable and are actually coming from its Check Bundle.
---
title:
---

# Release Notes: 2019-10-07

[EL7 pinned
repo](https://login.circonus.com/resources/docs/inside/InstallCentos.html#el7-repo):
`baseurl=http://updates.circonus.net/centos/7/release-20191007/x86_64/`

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of the 2019-07-01 release, GoAPI no longer uses the PostgreSQL database
for metric searches, so it is necessary to run this script before updating to
the current release, if you have not already. If you are updating from a
release prior to 2019-05-06, run this script immediately after updating.**

## caql_broker

Version: 0.1.1566485402 (461cc6c)

* No changes since [2019-08-26](/Changelog/20190826.md#caqlbroker)

## data_storage

Version: 0.1.1570133025 (aed1386)

* Performance improvements related to opening raw timeshards.
* Various performance improvements related to data fetching:
  * Less piecemeal work is performed, which means that long runs of fetches are
    performed in the same jobq and not fanned out as extensively.
  * Epoch/apocalypse times for numeric fetches are accelerated using activity
    tracking.
  * The /rollup `engine=dispatch` endpoint now does a simple merge of nntbs and
    raw.
  * Legacy /rollup behaviour of a complex nntbs/raw/nntbs sandwich is available
    via `engine=dispatch_coarsen`.
* Greatly improve performance when fetching rollup data for a stream that has
  no historic data before the starting time and for which there are many prior
  raw timeshards. This improves the fetch time from tens of seconds to tens of
  milliseconds.
* Bug: Fix memory leaks in raw data iterator and surrogate db loading.
* Bug: Change the `/fetch` API endpoint to perform work in the
  `snowth_fetch_remote` and `snowth_fetch_local` jobqs. It was using an
  incorrect jobq before.
* Bug: Fix use-after-free that could cause crashes when using the `/fetch` API
  endpoint.
* Bug: Fix `ck_fifo` usage to prevent memory misuse that could lead to crashes
  when loading the surrogate DB or processing journal replication data.
* Bug: Fix various potential crashes in reconstitute/rebalance.
* Bug: Fix console web UI to prevent abusive loading of json data after a
  suspended connection is reestablished.
* Change raw data reconstitute to use flatbuffers instead of M records. **This
  is a breaking change for reconstitute. Once a node is upgraded to this
  version or later, all other nodes must be upgraded before reconstitute will
  work properly again.**
* Add `surrogate_database/@{latest_future_bound,implicit_latest}` and track the
  latest arriving value for metrics accordingly. Expose them via find according
  to a `latest` query string parameter.
* Performance improvements in database iteration - should improve both insert
  and fetch operations.
* Bug: Ensure that surrogate db reconstitute is finished before inserting text
  and histogram records during reconstitute to avoid potential race conndition
  when updating the surrogate db.
* CAQL: Support for labeling multiple output streams with `label()` function.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

Version (faultd): 0.1.1569426459 (d5a4a92)

* Fix off-by-one error in metric name length when counting the number of
  rulesets that exist for a metric.

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.12.0

* No changes since [2019-08-12](/Changelog/20190812.md#fq)

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1569618092 (e4dbbe6)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality. In
> previous releases, the new search functionality needed to be enabled with an
> environment variable setting: `GOAPI_IRONDB_TAG_SEARCH`. That variable
> setting is no longer needed or used.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* Bug: an error in the data service internal protobuf handling was causing
  errors when processing data results that contained null values.

## Hooper

Version: 0.1.1570471055 (7205b93) (EL7, OmniOS)

Version: 0.1.1570035842 (6a67415) (EL6)

* Disable and remove the Graphite/snowth proxy service, whose functionality is
  now part of GoAPI. This resolves potential listener port conflicts.

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.8.4

* Fix alignment issue in logging related to freeing built flatbuffers. This
  requires a patched flatcc 0.4.3, or 0.5.0 or later. configure.in was updated
  to enforce this requirement. The bug manifested as a crash on large log
  messages (10s of kilobytes or more).
* Fix MPMC `ck_fifo` in `mtev_log` to be 16-byte aligned (crash bug).
* File-based (and stderr) logs now split newlines into separate annotated log
  statements making logs easier to read.
* Address several crash issues with ACO+eventer interaction
* The stock web UI javascript was fixed to prevent a flurry of queued API
  requests when the application comes back up after an interruption and the UI
  remained active in the browser.
* Elide a function call in the logging path when zipkin spans aren't active.
* Update the web support to assist displaying clusters.

## notification

Version: 0.1.1551816825 (18e4517)

* No changes since [2019-03-11](/Changelog/20190311.md#notification)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1569513096 (cf512e0)

* Fix allowable metric name size in function that pulls metrics from JSON
  input.

## Web UI/API

Version: 0.1.1570212862 (6fde7bd)

* Updated design of login pages and added new feature affordance area.
* Bugfix: Correct hosts page counts for active checks and metrics.
* Update UI notifications system so most notifications are now inline instead
  of using modals.
* Limit memory growth and retire apache worker process above 500MB RSS to avoid
  OOM conflict.
* UI improvement: Replaced all icons and refined page config controls across
  the entire UI.
* Bugfix: brokers that connect in to stratcon (NAT mode) would incorrectly
  cause notifications that they could not be reached. This has been silenced.

## web_stream

Version: 0.1.1566849557 (a3e7e11)

* No changes since [2019-09-09](/Changelog/20190909.md#webstream)
---
title:
---

# Release Notes: 2019-05-20

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

## caql_broker

Version: 0.1.1558034337 (cfc7f5a)

* Raise read-limit for HTTP requests from 1Mb to 20Mb, allowing for larger
  histogram fetches from snowth/IRONdb.

## data_storage

Version: 0.1.1557957963 (2a19201)

* Move surrogate activity updates into its own column family. This
  significantly reduces the I/O required for most surrogate db updates.
  Previously when activity records were updated, the entire surrogate entry was
  rewritten. Now, if the only change is updating activity, a much smaller
  update will be done. **This change modifies the surrogate database structure,
  breaking backward compatibility. A node that has been updated cannot be
  downgraded.**
* Reduce likelihood of timeout when fetching recent numeric rollup data via
  Lua.
* `/rollup/` API and CAQL fetching functions now correctly defer reads on
  replication delay.
* Performance improvements when debugging is disabled.
* Add surrogate checkpoint latency stats.
* Delete metric search metadata flush can be disabled by
  `x-snowth-metadata-flush` header.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
May 6.

Version (faultd): 0.1.1557855801 (9fc051c)

* Add support for tag filtering on `__name` and `__check_uuid` tags.
* Crash reporting will include the site domain for better identification by
  Circonus Support. This brings faultd crash reporting up to parity with
  reporting for other components.

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1558239122 (c0284db)

* Improved connection error handling for both PostgreSQL and IRONdb database
  connections.

## Hooper

Version: 0.1.1558015453 (a26f55d)

* Configure circonus.conf key `Snowth::timeout` to avoid CAQL graph errors due
  to negative timeout value.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1558037805 (a297fa8)

* Improved error logging in the httptrap check module.

## Web UI/API

Version: 0.1.1558117472 (88bb20a)

* UI: Removed check tag filters and filter sets from the UI. These features
  were incompatible with stream tags.
* UI: Improved graph histogram data processing times by 30-60% (not including data
  transfer times).
* UI Bug: Added a default `Snowth::timeout` value to prevent graph CAQL errors if
  the configuration key isn't set.
* Bug: When creating or editing a check on a broker whose ID doesn't match its
  group ID, a spurious error was thrown, saying the broker was invalid.
* Bug: Changing the alias of a broker group would take an excessive amount of
  time, during which check creation would not work for that broker. This is now
  substantially quicker.
---
title:
---

# Release Notes: 2019-01-28

## data_storage

Version: 0.1.1547680638 (621adb0)

* Fix proxy bug in the `/find` API where certain proxy calls were being
  truncated, leading to incomplete results.
* Added `each:sub(x)` and `each:exp(x)` operators to CAQL.
* Performance improvements to full metric delete.
* Deduplicate surrogate IDs from the database on startup.

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1548373085 (6ab7c11)

* Fix issue with metric wildcard search

## Hooper

Version: 0.1.1548274159 (b26474f) (EL7, OmniOS)

Version: 0.1.1547669091 (c11b383) (EL6)

* Remove old broker version check cron job from hub role.
* Add new broker version check cron job on stratcon role. Fixes erroneous
  "Update Software" notification in the web UI.
* Add new snowth metadata directory to support future tag features (EL7, OmniOS
  only)

## Web UI/API

Version: 0.1.1548429557 (e0f4bf7)

* UI: When adding a new metrics search datapoint to a graph, the view will
  scroll down to that datapoint, auto-expand it, and set focus on the search
  query field.
* UI/API: Remove all second-order numeric types: derive2, derive2_stddev, counter2,
  counter2_stddev.
---
title:
---

# Release Notes: 2019-06-03

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

## caql_broker

Version: 0.1.1559062556 (522f7c7)

* No user-facing changes

## data_storage

Version: 0.1.1559241333 (30cfa8d)

* Graphite: ensure `/find` endpoints emit valid JSON.
* Fix invalid JSON being returned from `/tag_cats` and `/tag_vals` API
  endpoints.
* Increase default `surrogate_writer` jobq concurrency to 6 (from 1).
* Fix race in metrics db (search indexes) where some metrics might be omitted
  during index construction.
* Fix crash when /rollup rollup_span == 0 (and require rollup_span > 0).
* Faster setmeta serialization for merge.
* Change histogram quantile/sum/mean operations to return approximations that
  minimize the relative error.
* Bug/CAQL: Fix `histogam:count_below()` to also count samples in the current
  bucket, as the documentation states.
* Bug/CAQL: `histogram:stddev()` will return nan for histograms with a single
  value not 0.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
May 6.

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.11.0

* Use socket keep-alives for client/server connections.
* Fix use-after-free bug in lua ffi client bindings.
* Use native systemd service configuration on EL7.

## Hooper

Version: 0.1.1559334691 (1ec1464) (EL7, OmniOS)

Version: 0.1.1558637582 (4cf3ea8) (EL6)

* Use the appropriate service manager for circonus-fq on EL7, now that it is
  native systemd.
* Fix ruby compile error in fault_detection role if the [new site.json attributes](/Changelog/20190506.md#faultdetection)
  are left out.
* If crash reporting is enabled, it should be set up for the fault_detection
  role (faultd).

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.6.12

* Fix crash bug when an SSL/TLS listener has npn set to "none" explicitly and a
  client tried to upgrade via ALPN.
* SECURITY: bug fix in http authentication handling where thread fan out could
  short-circuit ACLs with allow.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1559059743 (8b4bec9)

* Broker: Make httptrap immediate (async) mode more efficient.
* Broker: Improve httptrap and prometheus measurement batching.
* Broker: Add REST endpoint to redirect to the owning node in a cluster.
* Broker: fix crash bug where a bad metric name can produce a null metric
  record.
* Broker: Add `java.lang.Object` to the whitelist of types that JMX checks will
  collect.
* Stratcon: add a REST endpoint for showing the config.
* Broker: enable new OpenTSDB ingestion module.

## Web UI/API

Version: 0.1.1559324336 (a95bc39)

* Ruleset API cid is now numeric, fixes API Object display for Dynamic Alerting
  rulesets.
* Preliminary Ruleset Tag Filter support for Dynamic Alerting (alpha).
* Bug: fixed the case where creating a maintenance window with a null start
  time (starting 'now') would throw an error.
* Allow the creation of maintenance windows in the past, to retroactively
  affect uptime reports.
* Added a new check type: Kubernetes (via the Prometheus module).
* When creating or editing a check, allow users to proceed even if DNS lookup
  of the target fails.
---
title:
---

# Release Notes: 2019-09-23

[EL7 pinned
repo](https://login.circonus.com/resources/docs/inside/InstallCentos.html#el7-repo):
`baseurl=http://updates.circonus.net/centos/7/release-20190923/x86_64/`

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of the 2019-07-01 release, GoAPI no longer uses the PostgreSQL database
for metric searches, so it is necessary to run this script before updating to
the current release, if you have not already. If you are updating from a
release prior to 2019-05-06, run this script immediately after updating.**

## caql_broker

Version: 0.1.1566485402 (461cc6c)

* No changes since [2019-08-26](/Changelog/20190826.md#caqlbroker)

## data_storage

Version: 0.1.1568996292 (276d4f8)

* Performance and correctness improvements to reconstitute.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

Version (faultd): 0.1.1568056007 (7799d6f)

* No user-facing changes.

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.12.0

* No changes since [2019-08-12](/Changelog/20190812.md#fq)

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1569001079 (6219c5c)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality. In
> previous releases, the new search functionality needed to be enabled with an
> environment variable setting: `GOAPI_IRONDB_TAG_SEARCH`. That variable
> setting is no longer needed or used.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* No user-facing changes.

## Hooper

Version: 0.1.1566853977 (bd6c6c1) (EL7, OmniOS)

* No changes since [2019-09-09](/Changelog/20190909.md#hooper)

Version: 0.1.1566836624 (a6acd3e) (EL6)

* No changes since [2019-08-26](/Changelog/20190826.md#hooper)

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.8.0

* Performance improvements in the eventer (reduced overhead of tracking
  callback latencies).

## notification

Version: 0.1.1551816825 (18e4517)

* No changes since [2019-03-11](/Changelog/20190311.md#notification)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1568908358 (25a9b3e)

* Performance: (broker) adopt the same batching of submissions on generic
  socket listeners (e.g., graphite) as is used in the httptrap module.
* Bug: (broker) Fix memory leak in metric setting when metric name is bad.

## Web UI/API

Version: 0.1.1568922877 (668cb9c)

* UI improvement: Display number of results and pages in Metrics Explorer.

## web_stream

Version: 0.1.1566849557 (a3e7e11)

* No changes since [2019-09-09](/Changelog/20190909.md#webstream)
---
title:
---

# Release Notes: 2019-07-15

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of the 2019-07-01 release, GoAPI no longer uses the PostgreSQL database
for metric searches, so it is necessary to run this script before updating to
the current release, if you have not already. If you are updating from a
release prior to 2019-05-06, run this script immediately after updating.**

## caql_broker

Version: 0.1.1562943629 (afe4314)

* Support metric naming with the CAQL `label()` function

## data_storage

Version: 0.1.1562962679 (4e29274)

* Dump out query text to error log on a parse error with tag query finds.
* Optimize surrogate replay and prevent/repair corruption via auto-repair.
* Increase default concurrency in `process_journal` and `data_read` jobqs.
* CAQL: Return an error on find calls if no account information is found.
* CAQL: Add labels for outputs, enabling custom naming for CAQL check metrics.
* Fix memory leaks in the metrics database related to searching for metrics.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

Version (faultd): 0.1.1557855801 (9fc051c)

* No changes since [2019-05-20](/Changelog/20190520.md#faultdetection)

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.11.0

* No changes since [2019-06-03](/Changelog/20190603.md#fq)

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1562941176 (9b703e3)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality. In
> previous releases, the new search functionality needed to be enabled with an
> environment variable setting: `GOAPI_IRONDB_TAG_SEARCH`. That variable
> setting is no longer needed or used.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* Metric search API calls may see improved performance as the service is now
  using activity metadata returned from IRONdb to determine metric active
  status. This reduces the complexity of the metric search operation and the
  number of queries sent to IRONdb.

## Hooper

Version: 0.1.1562337738 (f204493) (EL7, OmniOS)

Version: 0.1.1562337738 (68ffa47) (EL6)

* Update stratcon ACL config to allow retrieval of libmtev application stats.

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.6.18

* Make HTTP/1 flush/flush_asynch automatic.
* Add HTTP auto-flushing that defaults to a bchain size (~32k).
* Add `mtev_http_response_auto_flush` to control HTTP auto-flushing.
* Support `idle_timeout` on listener accepted sockets.
* Provide thread-safe access to http append methods.
* Reference count events during trigger to avoid freeing while in use.
* Add thread safety fixes to `mtev_intern`.
* Add preloads configuration option to lua_web/lua_general modules
* Add foreground SIGINT, SIGQUIT, and SIGTERM signals to call plain-old
  `exit()`.
* Add `mtev_{set,get}_app_name` functions to help in places where we need the
  config root.
* Add `mtev_http_request_payload_complete` to help consumers correctly
  determine if they should stop calling `mtev_http_request_consume_read`.
* `MTEV_MAYBE` macros will no longer initialize the entire initial buffer, only
  the first element (performance improvement).

## notification

Version: 0.1.1551816825 (18e4517)

* No changes since [2019-03-11](/Changelog/20190311.md#notification)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1562699734 (35247e6)

* (libnoit) Fix possible overflow in tag parsing.
* (libnoit) Eliminate duplicate XML document declaration in the REST
  configuration endpoint when the node name is not specified.

## Web UI/API

Version: 0.1.1562952001 (4dadad1)

* Dynamic Alerting: Rulesets using pattern-based definitions can now also
  provide tag query filters for easier, more dynamic Ruleset definition.
* UI Design Improvement: All tabular lists have been changed to card-based
  lists to provide more room for information.
* Bugfix: Uptime Report now works for all metrics, including those collected by
  check filters which are unknown to the Postgres DB.
* Bugfix: eliminate "No account_id passed to Snowth::query()" warnings by using
  `checks.account_id`.
* Bugfix: creating a `rule_set` via API for a very new check might incorrectly
  see the check as inactive.

## web_stream

Version: 0.1.1556920684 (e0a3880)

* No changes since [2019-05-06](/Changelog/20190506.md#webstream)
---
title:
---

# Release Notes: 2019-07-01

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of this release, GoAPI will no longer use the PostgreSQL database for
metric searches, so it is necessary to run this script before updating to this
release, if you have not already.**

## caql_broker

Version: 0.1.1561658841 (410bb85)

* Add setting `api/@global_concurrency` to control the total number of active
  HTTP requests against the API
* Add setting `//caqlbroker/@window_timeout` to control grace period for late
  arriving data
* Drop late arriving data right away, to protect from message floods
* Add xcall.json handler for state inspection
* Don't register checks multiple times, when we already have a working version
* Fix: check delete notification
* Emit status messages during startup until all statements are initialized
* Emit status messages about ongoing search updates
* Set socket connection timeouts, to avoid long hangs when nodes are down
* Avoid HTTP requests to nodes, that have just failed
* Don't keep tcp connections open for multiple HTTP requests

## data_storage

Version: 0.1.1561733293 (3685f92)

* Add activity data to `tags/<id>/find` JSON responses.
* Bug: Address inconsistent activity windows on single stream batch loading.
* Bug: Fix consistency issue with in-memory indices of check/tag set-crdt data.
* Bug: Fix potential crashes related to not acquiring the read lock before
  cloning an OIL (ordered interval list) object for activity tracking.
* Bug: Fix memory leaks that occur in the metrics database when using `/find`
  to search for metrics. One leak occurred while using find during a delete
  operation. Another was failing to free allocations that went unused during
  metric name expansion, under some circumstances.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1561515497 (2b8283c)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality. In
> previous releases, the new search functionality needed to be enabled with an
> environment variable setting: `GOAPI_IRONDB_TAG_SEARCH`. That variable
> setting is no longer needed or used.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* Bug: A signal handling issue could, in certain cases, cause the goapi process
  not to terminate properly.
* Bug: Environment variable definitions were not loading properly on systems
  using SysV/init.d scripts for service management.
* Bug: The metric service was not properly handling v2 format queries in metric
  bundles.
* Bug: SysV init scripts failed to record the PID of the started service,
  breaking subsequent operations.
* GoAPI will now verify that any IRONdb nodes being accessed by internally used
  clients meet the minimum version requirements for the version of GoAPI
  running. Nodes running older versions will not be used by GoAPI internally,
  and error messages will be logged recording the occurrence. The node, its
  current version, and the required version are included in the log entries.

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.6.16

* Add `/module/lua/xcall.json` REST endpoint (for state inspection)
* Add lua `mtev.semaphore()`
* Fix web UI where suppressed tabs would prevent mtev-loaded signal.
* Fix compiler warnings for gcc 7.
* Fix inverted predicate in configuration property iteration.
* Add upload bytes to http access log format.
* Add timeout parameter to `socket:connect()` in lua
* Fix deadlock caused by `eventer_t:close()` in lua

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1561660814 (29aa66a)

* Stratcon: Raise default backlog from 10000 to 100000 in the FQ driver.
* Broker: Fix for failing `ping_icmp` test checks.
* CAQL Broker: Allow dropping of late arriving data.
* Broker: Add noit console command `show filterset` for displaying information
  on the filters that control collection of individual metrics.
* Broker: Use HTTP 4xx response codes for httptrap errors. Previously too many
  errors fell through to a default 500 code.
* Broker: Fix chunked-encoding in httptrap module. This will help avoid
  timeouts and other bad behavior when sending large JSON payloads to an
  HTTPtrap.

## Web UI/API

Version: 0.1.1561756109 (de5338c)

* UI: Graph loading speed has been improved for checks with large numbers of
  metrics.
* UI Bug: Eliminated a script injection vulnerability (from metric names) on
  metric details page due to how the account switcher menu was being output.
* UI Bug: Selected value type for Metric Search datapoints on a graph was not
  being obeyed.
* Bug: Unable to add rules to Rulesets for histogram metrics.
* UI Bug: Multiple overlays on a graph could have their loading prematurely
  canceled, continusously showing the spinning-gears icon.
* UI Bug: The first Capacity Planning overlay added to a graph would not show
  its lines extending all the way across the plot.
* Bug: Change to SAML Auth object to eliminate a lock that could cause a rare
  dead-lock situation.
* Validation for ruleset patterns and tag filters.
* UI Bug: Slack notification test messages now work correctly. Slack alerts
  were not affected, but the test button did not work.

---
title:
---

# Release Notes: 2018-11-19

## caql_broker

Version: 0.1.1542379141 (de348ca)

* Remove warning log messages for missing checks.
* Add instrumentation for perceived message delay.
* Use /v2/metric_old endpoint for search resolution, allowing v3 upgrade of the
  web-service.
* Run caql-broker as non-root user.

## data_storage

Version: 0.1.1542336753 (c7ddb12)

* CAQL: Fix histogram validation
* New module, `graphite_egress_alter` for applying Graphite-specific transforms
  on metric results before they are sent back in a Graphite request.
* Fix `storage_file` open race.
* Remove NNTBS `info_db` metadata database.
  * The info_db was LMDB with a continuous update cycle.  All rows
    were replaced every rollup period causing horrific churn and bad
    performance pathologies on ZFS.
  * This entirely eliminates the database and replaces it with on-demand
    determination of epoch/apocalypse.
  * We introduce a new surrogate function to iterate over all surrogate
    keys which we now use for inventory processing during reconstitute and
    rollup recreation.
* Crash fix in Graphite response when expanding names that are leaves.
* CAQL: Allow "query" as alias for "q" parameter.
* Improved surrogate DB performance and reduced memory usage.
* Use the `jemalloc` allocator by default on Linux.
* Fix watchdog in full-delete path, when finding the list of metrics to delete.
* Provide offline surrogate DB maintenance tool.
* Fix issue where Graphite metrics tags were mixed with Circonus stream tags.
* Fix crash caused by rare race condition when inserting new metrics into the
  surrogate DB.

## GoAPI

Initial release: This is a new internal component that runs on API and
web_frontend nodes. It supports the new
[Stream Tags](https://www.circonus.com/2018/11/introducing-circonus-stream-tags/)
features for the Web UI and API, and will gradually take over additional
REST endpoints from the existing Perl-based middleware.

Version: 0.1.1542652206 (68c290a)

## Hooper

Version: 0.1.1542400689 (1dfdae0)

* Activate new GoAPI service on API and web_frontend roles.
* Add new `Search::V3` configurations to `circonus.conf`.

## libcircmetrics

Related roles: caql_broker, data_storage, stratcon, web_stream

Version: 0.0.1.1542307708

* Use new `h` histogram type for histogram stats.
* Improve performance by using different locking strategies.

## libmtev

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 1.5.23

* Make SSL "connection closed" accept failures a debug message.
* Remove port from SSL connection failures so they log dedup.
* Make ncct (telnet console) output thread safe (crash fix).
* Fix leak of thread name in SMR context.
* Add `eventer_jobq_memory_safety_name()` function.
* Add reporting on SMR activity.
* Avoid unnecessary epoch synchronization (SMR), when there is no work to do.
* Fix SMR regression in jobs thread wind-down.
* Fix REST-driven jemalloc heap profiler.
* Do not block thread exit for SMR, instead disown the return queue and allow
  gc thread to cleanup (this also fixes leaks at thread exit)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 0.1.1542385741 (9f4ac57)

* Fix replacing deleted checks. When a check is deleted, it is marked as
  deleted and recycled. This allows for it to persist long enough to be unused
  and replicated if needed.  This change solves two issues:
  * When a deleted check still in config was set via API, the
    deleted attribute was not cleared, so it appeared in config
    (and in running system) as updated-but-still-deleted.
  * When a deleted check wasn't yet flushed from config and the instance
    restarts, the check would be loaded as deleted, but not scheduled.
    This resulted in not recycling it.  Now it is scheduled and
    immediately descheduled so that normal recycling happens.
* Fix crash where statsd tries to use polls before initialization.
* Support heap profiling.

## Web UI/API

Version: 0.1.1542657093 (66f65d8)

* New feature: [Stream Tags](https://www.circonus.com/2018/11/introducing-circonus-stream-tags/)
  * In the UI, there is a new interface for metric searching, called "Metrics Explorer".
    It utilizes a new 
    [V3 search syntax](https://login.circonus.com/resources/docs/user/SearchingV3.html).
  * In the API, [metrics search](https://login.circonus.com/resources/api#searching)
    uses the same syntax (V3) as the UI. All other object type searches
    continue to use the existing V2 syntax.

* UI: Remove `filter_rules` feature flag.
* UI: Disable selecting metrics from "change brokers and metrics" if there are
  filters on the checkbundle.
* UI/API: reconstitute_noit filter_rules vs filter_id: move validation into
  scope that needs it.
* API: Handle user and contact_group REST endpoints via GoAPI.
* Address unescaping of form args for RawForm.
* API: Set account_id and check_name header fields in CAQL Backfill requests.

---
title:
---

# Release Notes: 2019-08-26

[EL7 pinned
repo](https://login.circonus.com/resources/docs/inside/InstallCentos.html#el7-repo):
`baseurl=http://updates.circonus.net/centos/7/release-20190826/x86_64/`

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of the 2019-07-01 release, GoAPI no longer uses the PostgreSQL database
for metric searches, so it is necessary to run this script before updating to
the current release, if you have not already. If you are updating from a
release prior to 2019-05-06, run this script immediately after updating.**

## caql_broker

Version: 0.1.1566485402 (461cc6c)

* Bug: De-duplicate histograms. Fixes a bug where several different H1 messages
  received for the same histogram metric would be aggregated. We only want to
  do that if the timestamps are different.
* Improvements to debugging facilities:
  * Add audit system that allows one to selectively emit debugging information
    for a set of checks
  * Improve xcall/statement information
* Bug: If two CAQL `find()` queries were matching the same metric, only one of
  them would get data.
* Bug: Add prefill logic for tag search/CAQL `find()` queries. Before that,
  certain statements involving CAQL `find()` were not initialized correctly
  after a restart.

## data_storage

Version: 0.1.1566503936 (d111cf4)

* Improved error messages when numeric and histogram records with bad
  timestamps are received. Now the type and metric name will be logged.
* Surrogate DB improvements and increased logging during full delete
  operations.
* Bug: Fix prometheus module label equality searches for values beginning with
  `/` or containing wildcard expansions `*` and `?`.
* Bug: Fix crash when fetching raw numeric data using metric names that cannot
  be canonicalized.
* Performance improvements to inter-node data journaling.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

Version (faultd): 0.1.1566506834 (bf5d52b)

* Bug: JS error caused ruleset searches in the admin console UI (port 9127) to
  display truncated results.

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.12.0

* No changes since [2019-08-12](/Changelog/20190812.md#fq)

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1566482299 (971a6e7)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality. In
> previous releases, the new search functionality needed to be enabled with an
> environment variable setting: `GOAPI_IRONDB_TAG_SEARCH`. That variable
> setting is no longer needed or used.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* Bug: The REST API service is not routing requests properly when parameters in
  the URL path contain the '/' character, even when properly URL encoded.
* Bug: (EL6 only) SysV init scripts could report that the process failed to
  start when it actually had started successfully. 
* Bug: An unnecessary error message is being logged when deployed in an
  environment that does not have the database updates for snowth swimlanes.

## Hooper

Version: 0.1.1566840820 (96d7dc0) (EL7, OmniOS)

Version: 0.1.1566836624 (a6acd3e) (EL6)

* More thorough configuration checking for `faultd_cluster`.
* Restart the FQ service if the package is updated.
* Configuration changes for `caql_broker`:
  * New format for specifying snowth nodes
  * New included configuration file for swimlane snwoth clusters. This is not
    used on Circonus Inside.
* Bug: snowth-circ-proxy and stratcon-crashreporter packages were being updated
  even if maintenance mode (`run-hooper -m`) was used.

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.6.26

* Fix payload-complete logic in the http1 system for Content-Length requests.

## notification

Version: 0.1.1551816825 (18e4517)

* No changes since [2019-03-11](/Changelog/20190311.md#notification)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1566400722 (a4125ad)

* Bug: (broker) Fix clustered histogram submission with explicit `_ts` field.
  * Histogram submission is intentionally jittered when running in a clustered
    configuration. However, when `_ts` is specified, that jitter should not be
    applied. This change makes it such that jitter is not applied when logging
    a histogram with an explicit `_ts` setting.
* Feature: (broker) Support the `_ts` field on HTTPtrap payloads in synch mode,
  as if it were set to asynch (measurements are recorded as they are received.)
* Bug: (broker) Fix HTTPtrap payloads with duplicate data dropping some data.
* Bug: (broker) Fix how modules are determining complete HTTP payloads. It's
  not how much you've received, it is how much we've read from the wire.  If we
  can't decompress something we could get stuck thinking there should be more
  data when the http client has already ready everything.

## Web UI/API

Version: 0.1.1566577260 (b6fb543)

* UI Design: Design update for site masthead and navigation menus.
* Bugfix: Fixed CAQL, Cluster & Search Graph datapoints which can return
  different sets of metrics when the graph is refreshed, so that the legend
  remains correct even when the set of metrics changes upon a graph refresh.
* API: The endpoints `/account` and `/metric_cluster` are now being handled by
  GoAPI.
* Dashboard Text widgets have been improved, so they properly display the value
  range for histogram metric values.

## web_stream

Version: 0.1.1566399690 (40b7685)

* Bug: Add stream tag support to fix certain dashboard widgets that were not
  displaying properly for metrics that had stream tags.

---
title:
---

# Release Notes: 2019-04-22

## data_storage

Version: 0.1.1555705775 (cf8a088)

* CAQL: Forward labels in top(k) queries
* CAQL: Fix cumulative histogram function.
* CAQL: Speed up `find()` and `histogram:create()`.
* CAQL: Fix rollup logic in `histogram:create()`. Previously, queries could
  return inconsistent results at higher rollup periods.
* Fixes for metric names longer than 1024 bytes.
* Set lower `snowth.get` timeout in Lua, to allow for query retries.
* Fix reconstitute bug in cases of incomplete file reads.
* Performance improvements to inter-node gossip communications.
* Support FlatBuffers requests in /histogram read endpoint.
* Support backlog display and stats filtering in UI (ported from libmtev).
* CAQL: Increase the default histogram fetch limit to 3M.
* CAQL: Accelerate sum/sub/prod/div operations.
* CAQL: histogram:percentile and histogram:count_* operations now act on
  multiple input slots rather than just the first one.

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1555686909 (f4930dd)

* Fix issue with pipe (`|`) characters in metric names.
* Fix issues causing some database errors to fail to return properly, causing
  a request timeout.
* Fix issues with certain special characters in metric search queries and
  glob searches that were causing search failures.
* Fix routing for metric lookup by ID endpoints when used in conjunction with
  certain environments' load balancers.
* Update metric search query parsing to allow spaces in the primary search
  term (for metric name), before the first search term operator (and, or, not),
  even if it is not enclosed in quotes. Ex: `this used to be invalid and(now:it
  is not)`.
* Allow the process started with `goapi serve` to listen for REST API requests
  on ports for both UI search support and API metric search.  This eliminates
  the need to start two processes on API servers.
* Introduce support for a new metric CID format based on check UUID instead
  of check ID.  Metric endpoints will still return the current CID format in
  their data responses, but can lookup and respond to CIDs in both new and old
  formats.  The new format is `/metric/<check_UUID>_<metric_name>`, the
  existing format is `/metric/<check_ID>_<metric_name>`. No changes are
  required to any existing API tooling. A switch to the new format is planned
  for the future, but no date has been set at this time.

## Hooper

Version: 0.1.1555624984 (a3987ef) (EL7, OmniOS)

Version: 0.1.1555606399 (ee0f220) (EL6)

* Remove api-search service from API role. This functionality is now handled by
  the main GoAPI service.
* (OmniOS only): Always restart `svc://circonus/api` (GoAPI) each run, as the
  package gets updated prior to the API recipe, invalidating the
  restart-on-update trigger. All GoAPI operations are stateless and
  transactional, so this is not a disruptive change.
* (EL7 only): New Inside deployments will use the "NNTBS" backing store format
  for snowth.

## libmtev

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 1.6.8

* Add statistics for lua VM time and lua GC time.
* Expose the watchdog timeout as timeval: mtev_watchdog_get_timeout_timeval
* Expose eventer thread watchdog timeouts: eventer_watchdog_timeout_timeval
* Adjust max eventer sleeptime to not exceed 1/20 watchdog timeout.
* Heartbeat the eventer immediately upon event wakeup.
* Fix UI issue displaying histogram stats (bin compaction).
* Revert eventer_t allocation to the default allocator. This allows better
  introspection of memory usage when using jemalloc.
* Add max backlog stat for jobq and display. Job queues have had a backlog
  limit since version 1.1.3 but the value had not been exposed in the stats
  interface.
* Add filter for stats in UI. This allows for substring or regex filtering of
  the stats list, making it easier to find stats of interest.
* Be more careful when setting jobq concurrency from the console (crash fix).
* Explicitly name log dedup, amqp, and fq threads. This exposes more meaningful
  stats.
* Add more NULL safety in amqp connection management (crash fix).
* Default the jobq web UI view to hide completely unused jobqs. A slider icon
  in the top right corner of the panel can be used to toggle display of all
  jobqs.

## Web UI/API

Version: 0.1.1555689963 (15de914)

* API: When creating a graph via the API, the 'interpolated' line_style wasn't
  being respected and was rendering as 'stepped'.
* UI: Improved graph x-axis label rendering so labels don't overlap at small
  graph sizes.
* UI: Improved multi-stream CAQL graph datapoints so each stream will be broken
  out into its own datapoint.
* UI: Added stream label support to CAQL graph datapoints, so each stream's
  datapoint will be labeled with any CAQL-specified label, when available.
* UI: Fixed graph overlay bug: when using a graph comparison overlay, changing
  the date range would cause the overlay to render improperly.
* UI: Fixed the check tree browsing panel (used in the "New Ruleset" and Graph
  "Add Datapoint" modals), so it retrieves lists of checks correctly.

---
title:
---

# Release Notes: 2019-08-12

[EL7 pinned repo](https://login.circonus.com/resources/docs/inside/InstallCentos.html#el7-repo): `baseurl=http://updates.circonus.net/centos/7/release-20190812/x86_64/`

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of the 2019-07-01 release, GoAPI no longer uses the PostgreSQL database
for metric searches, so it is necessary to run this script before updating to
the current release, if you have not already. If you are updating from a
release prior to 2019-05-06, run this script immediately after updating.**

## caql_broker

Version: 0.1.1565206165 (00ca7b9)

* Disable tag-search cache (since it does not work with check-tags). This will
  somewhat increase CPU utilization, and decrease memory usage.
* Enable check-tag replication modules. This will allow CAQL-broker to retrieve
  check-tag information from a snowth cluster. The snowth cluster information
  for check-tag replication will be pushed to the caql-broker via REST from
  a cron job on the hub role.
* Restrict web management UI access to localhost. This is the same behavior as
  on Enterprise Brokers. Operators who wish to have remote access should tunnel
  the connection over SSH.

## data_storage

Version: 0.1.1565286513 (3abf4a3)

* No user-facing changes.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

Version (faultd): 0.1.1563974858 (d20e534)

* No changes since [2019-07-29](/Changelog/20190729.md#faultdetection)

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.12.0

* Fix minor libfq bug on Linux to retry an interrupted `poll()`.

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1565218550 (9d97498)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality. In
> previous releases, the new search functionality needed to be enabled with an
> environment variable setting: `GOAPI_IRONDB_TAG_SEARCH`. That variable
> setting is no longer needed or used.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* Bug: An incorrect error code was being returned when the metric search
  service received a parse error response from IRONdb.
* Bug: The format of the `_cid` field returned by metric search API requests
  did not include metric name stream tags and therefore was not guaranteed to
  be unique for any given metric.
* Bug: The `X-Circonus-More-Items` header was not being returned correctly for
  some API metric search requests.
* Updates authentication service caching to improve performance and
  compatibility with Perl services.
* Updates cache utilization and adds database package improvements to the
  user service to improve overall GoAPI performance.
* Bug: Errors during parsing of invalid check definition XML were not being
  handled correctly in some cases, resulting in request failures.
* Bug: Database transaction close operations were causing a goroutine to hang
  indefinitely in some cases.

## Hooper

Version: 0.1.1565279419 (3ae47ca) (EL7, OmniOS)

Version: 0.1.1565279419 (c3e2040) (EL6)

* New hub cron job to sync check-tag information to caql_broker from IRONdb. 
* Raise fq client backlog to 100k messages in caql_broker configuration. This
  more reasonable limit will prevent unnecessary message drops.
* Update messaging for SSL/TLS certificate fetching 404 errors. It will more
  clearly indicate that another Hooper run may solve the problem.

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.6.25

* Fix bug in HTTP/1.1 chunked uploads. Chunks were not correctly read if they
  happened to lie of a buffer boundary. This manifested as stuck/hung
  connections when the chunk size was approximately 32KB.

## notification

Version: 0.1.1551816825 (18e4517)

* No changes since [2019-03-11](/Changelog/20190311.md#notification)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1565301247 (a4ecbaa)

* No user-facing changes

## Web UI/API

Version: 0.1.1565381187 (2839b03)

* Bugfix: Retire a removed team member's API tokens.
* UI: Design update for content and forms.

## web_stream

Version: 0.1.1556920684 (e0a3880)

* No changes since [2019-05-06](/Changelog/20190506.md#webstream)
---
title:
---

# Release Notes: 2019-05-06

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after applying the current update,
but it will not hurt anything to run it more than once.

## data_storage

Version: 0.1.1556907805 (28039c7)

* `/rollup/` and CAQL fetching functions now correctly defer reads on
  replication delay.
* Performance improvements in the `raw_ingestor` module used by Stratcon to
  send metrics into Snowth.
* Performance improvements in CAQL when debugging is disabled.
* Exposure of metric metadata into lua for use by CAQL and other lua extensions.
* Performance improvements when looking up locations on the topology ring.
* Ensure all journal replication threads are supplied with work. Previously, if
  more than one replication thread existed and there was not sufficient load to
  utilize all of them, some journal segments were not removed after their data
  was replicated. This led to increased disk usage over time, and was
  exacerbated by a change to the default journal replication concurrency in the
  2019-04-08 release.
* CAQL: Add type checking facilities to CAQL function arguments.
* CAQL: `histogram:count_*()` processing on higher periods, was off by a factor
  of `VIEW_PERIOD/60`. This is corrected now.
* CAQL: Expand label() functionality.
* CAQL: Add tag() function.
* Fix thread safety issues that could lead to occasional crashes.
* CAQL: Fix `find:histogram_cum()` functionality.
* CAQL: Performance Improvements.
* Additional IRONdb documentation on the [UI Internals tab](https://www.irondb.io/docs/operations.html#internals-tab),
  which contains a rich set of statistics for troubleshooting performance
  problems.

## fault_detection

This release brings a replacement for the fault-detection function of Ernie. A
new, libmtev-based application, "faultd", will now perform this function. The
previous Ernie service will remain but only performing its secondary role as
the "composite broker". It will no longer process rulesets or generate alerts.

In order to complete the transition, the following attributes must be added to
the `fault_detection` stanza in `site.json` prior to updating to this release:

```
"registration_token": "<uuid>"
```

where `<uuid>` is generated from the `uuidgen` command-line tool or other
source. This token will be pre-authorized to access the API in order to load
rulesets.

```
"faultd_cluster": {
    "server1": { "node_id": "<uuid>" },
    "server2": { "node_id": "<uuid>" }
}
```

where `<uuid>` is generated from the `uuidgen` command-line tool or other
source. This object describes the nodes that participate in the faultd
cluster. Each hostname from `_machlist` should be represented, each with their
own UUID.

Version (faultd): 0.1.1556628952 (926d69a)

* New package: `circonus-platform-fault-detection` (CentOS), `pkg://circonus/platform/fault-detection` (OmniOS)

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## GoAPI

Version: 0.1.1556813464 (c49eb69)

* Metric lookup by CID fixed to work with stream tags.
* Performance improvements to metric searches by check_uuid that use wildcards
  in the metric name search term.

## Hooper

Version: 0.1.1557153261

* Configure new `faultd` daemon to replace Ernie's fault detection
  functionality. See the "fault_detection" section above.
* Add a configurable session key string to `circonus.conf`. This improves the
  security of session cookies when using Circonus native authentication.
  Operators may set the `session_key` attribute within the `web_frontend`
  section in `site.json` to an ASCII string of 8 or more characters. If not
  set, a default string will be generated. This setting has no effect for users
  that authenticate via LDAP or OAuth2/SAML.
  * **For deployments using Circonus native username/password authentication,**
    **all logged-in users will need to log in again after this update is**
    **applied.**
* As part of Template feature removal (see the Web UI section below), disable
  the following template-related services on the `hub` role:
  * `template_rules_sync`
  * `pending_check_processor`

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.6.10

* `mtev_intern` pools (reference-counted dictionaries of strings) with
  `extent_size` 0 should just malloc/free. This saves the work of doing
  compaction (including locking) on empty pools.
* Introduce `mtev_log_has_material_output` function to test whether a given log
  stream will result in actual output. Used to reduce the overhead of logging
  when a log stream is disabled (such as debug logs).
* Change the default jobq memory safety from `cs` to `gc`.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1556127102 (7de1e31)

* Apply filtersets to histogram metrics.

## web_stream

Version: 0.1.1556920684 (e0a3880)

* Fix memory leak in message parsing.
* Make FQ subscription unconditional. Previously, some watch events did not
  connect to FQ.

## Web UI/API

Version: 0.1.1556917562 (0e85542)

* UI: Fixed metric active status display on the check details page, so that
  when metrics are disabled manually, their status will be updated in the list
  sooner, usually within five minutes. Added notices to this effect to the
  check editing tab and the editing confirmation modal.
* UI: Fixed the metric details page which uses the standard metric search to
  pull some metric metadata; use a 10 year activity period instead of the
  default 2 weeks.
* UI: Updated how graph errors are shown so they can be shown on all types of
  graphs including histogram summary graphs.
* UI: Added an "unsupported" error when trying to view a histogram summary of a
  graph containing an aggregated cluster datapoint.
* UI: When warnings are returned from a graph CAQL datapoint in the new DF4
  format, return the warnings to the user and render them in the graph errors.
* UI: Templates have been permanently removed. All checks bound to templates
  have been unbound and are now standard editable checks.
* UI: Clarified notices around inactive checks so their relationship to their
  bundle is clearer.
* UI: Fixed the graph CAQL datapoint editor so error notices are removed when
  the error goes away.
* UI: Improved graph data request handling so that multiple data requests aren't
  firing over top of each other.
* UI: Fixed graph CAQL histogram detection so histogram data will be detected
  even if the first series is all nulls.
* UI: Bugfix to avoid a crash in shared dashboards.
---
title:
---

# Release Notes: 2019-11-04

[EL7 pinned
repo](https://login.circonus.com/resources/docs/inside/InstallCentos.html#el7-repo):
`baseurl=http://updates.circonus.net/centos/7/release-20191104/x86_64/`

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of the 2019-07-01 release, GoAPI no longer uses the PostgreSQL database
for metric searches, so it is necessary to run this script before updating to
the current release, if you have not already. If you are updating from a
release prior to 2019-05-06, run this script immediately after updating.**

## caql_broker

Version: 0.1.1571662694 (f20bfce)

* No user-facing changes.

## data_storage

Version: 0.1.1572543705 (ce023db)

**Function Removal Notice**

> Metric Search v2 and Metric Clusters have been deprecated for some time.
> We plan to remove these deprecated functions on 2020-01-31 for the SaaS site,
> and in the subsequent Inside release on 2020-02-10. This will affect
> CAQL checks as well as CAQL Datapoints on graphs. The UI will now show users
> a warning when one of the deprecated functions is used. Circonus offers a
> more powerful tag-search feature, exposed as `find()` in CAQL.

* CAQL: Fix a bug where `histogram:*()` functions would remove tag information.
* Additional surrogate db loading stats and checks.
* CAQL: Fix bugs with limiting and sorting outputs.
* CAQL: Add default labels to `histogram:*` output.
* CAQL: Add `tag:remove()` function.
* CAQL: Set default/max limits for CAQL find() queries to 1000/3000
  (configurable)
* CAQL: Speed-up data fetching with the `metric()`, and the deprecated
  `search:metric()` and `metriccluster()` functions, by leveraging the `/fetch`
  endpoint.
* CAQL: Add deprecation warning to `search:metric()` and `metriccluster()`
  functions.
* Allow query parameter `activity=0` to `/find/tags` to suppress activity
  information.
* Support telnet-like console access via the administrative web UI.
* CAQL: Optimize a number of query patterns to leverage federated data processing:
  * `find() | stats:{sum,mean}`
  * `find() | count()`
  * `find() | top()`
  * `find:histogram() | histogram:merge()`
  * `find:histogram() | histogram:sum() | stats:sum()`
* Fix CAQL `count()` function, to not count `NaN` values.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

Version (faultd): 0.1.1572489618 (14a6eaa)

* Some crash-reporting attributes were missing due to a broken shell variable
  in `/opt/circonus/etc/fault.env`.

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.12.0

* No changes since [2019-08-12](/Changelog/20190812.md#fq)

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1572268435 (6059c21)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* Improvements have been made to the internal sqldb package to improve thread
  safety and performance of database operations.

## Hooper

Version: 0.1.1572534736 (1cdc62c) (EL7, OmniOS)

Version: 0.1.1572534736 (5d4093e) (EL6)

* Update enzo-c (web_stream) and faultd configs to reduce the number of FQ
  messages processed per invocation. The default (10K) could lead to watchdog
  timeouts in some situations.

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.9.2

* Fix race in implicit eventer callback naming (crash).
* Fix http/1 and http/2 issues moving requests into and out of ACO mode
  (symptom was hangs and crashes when mixing ACO and non-ACO request service on
  a single http session).
* Fix memory leaks in initial logging setup.
* Fix sign issues in jobq statistics.
* Add `total_jobs` to jobq statistics.
* Support LIFO ordering on jobqs.
* Fix watchdog traces on `e:default/0`, its hearbeat thread was unassigned.

## notification

Version: 0.1.1570571834 (00b2aa2)

* No changes since [2019-10-21](/Changelog/20191021.md#notification)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1572495211 (2f9ae98)

* Broker: support stream tags in statsd checks.

## Web UI/API

Version: 0.1.1572639958 (10c8119)

* Bug: Some stale alerts would not force clear.
* UI bug: Fixed vertical positioning of tooltips.

## web_stream

Version: 0.1.1566849557 (a3e7e11)

* No changes since [2019-09-09](/Changelog/20190909.md#webstream)
---
title:
---

# Release Notes: 2019-10-21

[EL7 pinned
repo](https://login.circonus.com/resources/docs/inside/InstallCentos.html#el7-repo):
`baseurl=http://updates.circonus.net/centos/7/release-20191021/x86_64/`

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of the 2019-07-01 release, GoAPI no longer uses the PostgreSQL database
for metric searches, so it is necessary to run this script before updating to
the current release, if you have not already. If you are updating from a
release prior to 2019-05-06, run this script immediately after updating.**

## caql_broker

Version: 0.1.1566485402 (461cc6c)

* No changes since [2019-08-26](/Changelog/20190826.md#caqlbroker)

## data_storage

Version: 0.1.1571252712 (3d8a865)

* Fix `account_id` handling for CAQL histogram summary views
* Add sensible default labels to CAQL `histogram:percentile()` output
* Speed-up CAQL `integrate()` function
* Leverage `/fetch` endpoint for CAQL `find()` operations
* Support a filter config option for the monitor module.
* Support histogram input for `/fetch` `groupby_stats`
* Implement histogram `/fetch` transforms: `{inverse_,}{quantile,percentile}`
  and `count_{above,below}`.
* Bug: fix crashes related to bad locking when adding/removing a metric locator
  from the surrogate cache.
* Bug: fix integer overflow in `/fetch` endpoint that could cause incorrect
  results on occasion.

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

Version (faultd): 0.1.1570478395 (6c6286c)

* No user-facing changes

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.12.0

* No changes since [2019-08-12](/Changelog/20190812.md#fq)

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1571322390 (e767037)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality. In
> previous releases, the new search functionality needed to be enabled with an
> environment variable setting: `GOAPI_IRONDB_TAG_SEARCH`. That variable
> setting is no longer needed or used.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* Bug: An error in the logic used when looking up a single metric by CID, using
  the `/metric/{cid}` endpoint, sometimes produced an incorrect result. This
  occurred when the metric shared the same name as other metrics and contained
  stream tags which were a subset of other metrics' stream tags.
* Bug: An error in JSON decoding for `alert_format` values by the contact group
  service resulted in a failure to update contact group when `alert_format`
  field values contained the JSON `null` value.

## Hooper

Version: 0.1.1570471055 (7205b93) (EL7, OmniOS)

Version: 0.1.1570035842 (6a67415) (EL6)

* No changes since [2019-10-07](/Changelog/20191007.md#hooper)

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.8.5

* Bug: fix double-free in AMQP broadcast delivery (libmtev-amqp module).

## notification

Version: 0.1.1570571834 (00b2aa2)

* Bug: ensure that a database row is updated before fetching the results (crash
  fix).

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1571258240 (9e5e96f)

* Broker: redo statsd module to use histograms intelligently.
  * This is a breaking change as metric names will change.  However, the prior
    implementation was severely broken and not cluster-capable.  This should
    use histograms where it makes sense.  For counters, we count in the zero
    bucket so that no one attempts to sum them (they should count them).
* Add support for cumulative histogram metrics, such as those exposed by
  libmtev jobq stats.
* Broker: be more lenient with DNS timeout handling

## Web UI/API

Version: 0.1.1571428985 (81fe7f9)

* Bug: Fixed shared Worksheets' layouts, which were very broken.
* API: The endpoints `/caql` and `/data` are now being handled by GoAPI.
* Bug: Updated UI for IE11 compatibility.
* Updated UI for API Tokens page.
* Bug: Correct initial timestamps when creating annotations from a graph view.
* Bug: Fix bug preventing the creation of Contact Groups.

## web_stream

Version: 0.1.1566849557 (a3e7e11)

* No changes since [2019-09-09](/Changelog/20190909.md#webstream)
---
title:
---

# Release Notes: 2018-12-10

## data_storage

Version: 0.1.1544199703 (aabb973)

* Fix crash in metric serialization.
* Reclassify an error message as a debug message - message occurs in a
  situation that is not a malfunction and can fill the logs.
* Fix bug where text and histogram data transfer could get hung during
  reconstitute.
* Fix memory ordering related crash in string intern implementation (libmtev).
* Fix a bug where reconstitute process could get deadlocked and not make
  progress.
* Fix a potential crash that could occur when reconstituting surrogate data.
* Fix a bug where deleting a metric on a system would not remove the surrogate
  entry if the metric was not local to the node.
* Add thread to run dictionary compaction in mtev_intern for the stratcon raw
  ingestor module.

## fault_detection

Version: 0.1.1543873734 (22e92a8)

* Ignore all ruleset patterns

## libmtev

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 1.5.28

* Fix mtev_intern memory volatility/ordering issues.

## Web UI/API

Version: 0.1.1544132942 (9b517cb)

* UI: Fix Y-axis auto-scaling on graphs with empty histograms.
* UI: Properly identify histogram metrics on check creation for JSON payloads.
* Restore mq "firehose" metric in web_stream selfcheck.
* Pre-release prep for CAQL broker clustering.
---
title:
---

# Release Notes: 2019-04-08

## data_storage

Version: 0.1.1554238485 (ba640ea)

* Limit search results to 10,000 items by default. This can be overridden by
  setting a request header, `x-snowth-advisory-limit`, to a positive integer
  value. Setting it to -1 or "none" removes the limit.
* Change default journal replication concurrency from 1 to 4.
* Memory leak and crash fixes.
* Alter search to include check_tags if present.
* Add flag to allow nodes to rebalance in parallel rather than forcing nodes to
  rebalance one at a time.
* Various performance improvements.
* Improved the CAQL label function to support name and tag extraction
* Faster surrogate writes (adding new metrics and updating activity
  information)
* Improve NNTBS timeshard open/close performance by reducing unnecessary
  locking
* Support added for cumulative histograms at read time
* Make rebalance more robust
* Fix crash under repetitive license violations

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1554323172 (af1541c)

* Fixed issue with metric search matching and base64 encoded stream tags
* Improved support for UI -> API calls
* Added configuration flag for service maintenance

## Hooper

Version: 0.1.1554476014 (7ca33de) (EL7, OmniOS)

No changes on EL6.

* Remove support for the `statsd_target` attribute in the `data_storage` role.
  Snowth no longer supports emitting statsd metrics. Operators currently using
  this feature are encouraged to switch to a JSON pull check against
  `/stats.json` on each snowth host.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 0.1.1553184123 (517592c)

* Accept timestamped histograms.

## Web UI/API

Version: 0.1.1554501868 (8a37018)

* Launch new Checks/Integrations UI.
* UI: fix bug in CAQL check editing.
* Enabled Dynamic Alerting metric_pattern rulesets with regular expression
  matching over one or all checks.
* Addressed bug in new Apache check setup that caused only half of the
  available metrics to be selectable.
* Removed all code for deprecated RuleSet History feature. This had been
  removed from UI a long time ago.
---
title:
---

# Release Notes: 2018-10-22

## data\_storage

Version: 0.1.1539701422 (9838f50)

* Add activity range parameters to `/tag_cats` and `/tag_vals` REST endpoints,
  add category parameter to `/tag_vals`.
* Speed up loading of surrogate database by parallelizing the work.
* Modest locking performance increase in surrogate database load.
* Stop saving crash trace stdout to `*.trc` files, since the tracer produces
  its own output file.

## libmtev

Related roles: broker, data\_storage, stratcon, web\_stream

Version: 1.5.12

* Be extra cautious when shutting down the last thread in a pool to make sure
  there is no backlog.
* Fix header to expose `eventer_jobq_set_floor` correctly.
* Expose more controls for jobq mutation via console.

## Reconnoiter

Related roles: broker, data\_storage, stratcon, web\_stream

Version: 0.1.1539352534 (23a9353)

* Fixes for showing checks in a cluster.

## Web UI/API

Version: 0.1.1540240496 (682d9c9)

* UI/API: Add Graphite TLS check type.
* UI: Layout adjustments on metric details, alert details pages.
* UI: Minor layout bugfixes for change-brokers-and-metrics panel.
* UI: CSS fix for radio button spacing in DNS check config panel.
---
title:
---

# Release Notes: 2018-09-25

## data\_storage

Version: 0.1.1537899481

* CAQL: add comparators to the `each` package, which operates on all input
  slots at once: `gt`, `lt`, `geq`, `leq`.
* Fix activity-tracking replication
* Allow 4096 chars for metric name ingestion
* Locking changes for better performance on high-contention locks
* Move raw ingestion startup off of the main eventer thread to prevent
  watchdogs
* CAQL: Remove `wrap_false` from `histogram:*` functions.  Histograms can't be
  missing, they can only be empty.
* CAQL: Map `histogram:*` functions. So that:
  * The case of zero slot arguments is handled correctly
  * We apply the functions to all input slots
* Don't loop forever when journal writes are in the future
* CAQL: Check time during bundle loops
* Disable mtev async core dumps, preventing double crashes (where a "real"
  crash is followed by a second crash due to a database lock still existing)
* Various crash fixes

## Hooper

Version: 0.1.1537455639 (EL7, OmniOS)
Version: 0.1.1536174707 (EL6)

* Remove obsolete `grover_queue*` services. These have not been used in a long
  time.
* (OmniOS) Use a larger ZFS recordsize for `lt-final` dataset in the
  `long_tail_storage` role. This yields better compression ratios.

## libmtev

Version: 1.5.7

* Add the libluajit default path/cpath to luamtev by default
* Fix compressed non-chunked encoding
* Better error on improper rest registration
* Introduce `mtev_watchdog_disable_asynch_core_dump`

## Reconnoiter

Version: 0.1.1537458244


* Fix memory leak: incomplete search tag parse-tree freeing
* Automatic histograms ([PR 482](https://github.com/circonus-labs/reconnoiter/pull/482))
* Support `account_id`, `check_{uuid,id}` suppressions
* Support multi-document streaming JSON to httptrap
* Put prometheus module into a dedicated eventer pool
* Support `NOIT_MODULES` environment variable ([PR 493](https://github.com/circonus-labs/reconnoiter/pull/493))

## Web UI/API

Version: 0.1.1537199732

* UI: Fix bug in Quick Graph adding that led to metrics being displayed as inactive
* UI: Block "Enter" key on metric filtering field and prevent some regular
  expression errors on change-metrics dialog
* API: Account for prometheus check module

---
title:
---

# Release Notes: 2019-09-09

[EL7 pinned
repo](https://login.circonus.com/resources/docs/inside/InstallCentos.html#el7-repo):
`baseurl=http://updates.circonus.net/centos/7/release-20190909/x86_64/`

## Operator Note

Circonus is transitioning check tags (those that are associated with an entire
check, rather than stream tags, which are associated with a single metric) from
being stored in the PostgreSQL database to being stored in IRONdb/snowth.
Currently new tags added to checks are stored in both locations, but to prepare
for the eventual cutover to IRONdb/snowth as the single source of check tags,
operators are advised to run the following script from the system that serves
the "hub" role in your deployment:

```
/www/bin/checks/migrate_tags_to_snowth.pl
```

This will sync all existing check tags from PostgreSQL to IRONdb/snowth.
Depending on the number of checks and tags, this may take a while to run, so
using a terminal multiplexer such as tmux or screen is recommended.  It should
only be necessary to run this script once after updating to the 2019-05-06
release or later, but it will not hurt anything to run it more than once.

**As of the 2019-07-01 release, GoAPI no longer uses the PostgreSQL database
for metric searches, so it is necessary to run this script before updating to
the current release, if you have not already. If you are updating from a
release prior to 2019-05-06, run this script immediately after updating.**

## caql_broker

Version: 0.1.1566485402 (461cc6c)

* No changes since [2019-08-26](/Changelog/20190826.md#caqlbroker)

## data_storage

Version: 0.1.1567090720 (36446cc)

* CAQL `find()`: Make use of activity period tracking to avoid fetching empty
  metrics

## fault_detection

See the [2019-05-06 release notes](/Changelog/20190506.md#faultdetection) for
important configuration updates required if updating from a release prior to
2019-05-06.

Version (faultd): 0.1.1566934452 (a298b4a)

* Feature: make the rules system match on full, canonical metric names.
  Previously, the only way to alert on tagged metrics was to use search
  expressions, which could end up matching multiple metrics. Now it is possible
  to specify a precise, canonical tagged metric name.

Version (ernie): 0.1.1544639627 (db11a23)

* No changes since [2018-12-31](/Changelog/20181231.md#faultdetection)

## FQ

Related roles: caql_broker, fault_detection, mq, stratcon, web_stream

Version: 0.12.0

* No changes since [2019-08-12](/Changelog/20190812.md#fq)

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1567725266 (a02436e)

> The functionality to perform a Postgres-based, check UUID oriented search in
> metric search has been removed. This has been fully replaced by the more
> efficient and accurate search based on IRONdb tag search functionality. In
> previous releases, the new search functionality needed to be enabled with an
> environment variable setting: `GOAPI_IRONDB_TAG_SEARCH`. That variable
> setting is no longer needed or used.
>
> See the Operator Note at the top of this page for details on migrating check
> tags from Postgres to IRONdb. This is now required to be run in order for
> metric search results to work properly.

* Feature: Metric search requests will now include a header in the response,
  called `X-Snowth-Search-Result-Count`. This value is the estimated total
  number of results reported by IRONdb that match the find query executed. This
  value may be different than the actual number of metric results returned by
  the request due to response limits and the pagination settings used in the
  request.
* Bug: invalid activity data returned by IRONdb could cause tag searches to
  fail.

## Hooper

Version: 0.1.1566853977 (bd6c6c1) (EL7, OmniOS)

* Ensure that snowth write copies value is at least 1. Previously for test
  deployments that used a single node, the write copies would be set to 0,
  which is invalid.

Version: 0.1.1566836624 (a6acd3e) (EL6)

* No changes since [2019-08-26](/Changelog/20190826.md#hooper)

## libmtev

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 1.7.2

* Set app: tag on all top-level stats namespaces.
* Support logging thread names that are set via `mtev_thread_*` APIs.
* Fix issue where the watchdog failed to restart broken child processes under
  certain OOM conditions on Linux.
* Change default behaviour of jobqs to be GC (garbage-collected) not CS
  (critical-section) for SMR (safe memory reclamation). This provides better
  performance with fewer locks.
* Cleanup some ABI exposure in the lua modules.
* Fix pathological performance issues with large HTTP responses that were
  written in small increments.

## notification

Version: 0.1.1551816825 (18e4517)

* No changes since [2019-03-11](/Changelog/20190311.md#notification)

## Reconnoiter

Related roles: broker, caql_broker, data_storage, fault_detection, stratcon, web_stream

Version: 0.1.1567371584 (9bf80a0)

* Performance: (broker) Optimize for reading small chunks in an HTTP stream.
  This reduces reading from a hostile endpoint sending small chunks
  (10-20bytes) for a 1Mb payload from 25s down to 0.5s.

## Web UI/API

Version: 0.1.1567705501 (5060360)

* API bugfix: IRONdb check tag metadata was not being updated correctly when
  checks were created or modified using the `/check_bundle` API endpoint. This
  only affected checks modified via API calls, not checks created or modified
  using the UI. The [check tag migration script](#operator-note) (see above)
  should be run again after updating to this release, to ensure all IRONdb
  check tag metadata is correct.
* UI improvement: Option to edit ruleset name, ruleset default search will now
  include the user-defined name.
* UI: Users created prior to a 2017-08-14 change would no longer appear in the
  teams page.

## web_stream

Version: 0.1.1566849557 (a3e7e11)

* No user-facing changes.
---
title:
---

# Release Notes: 2018-10-12

## data\_storage

Version: 0.1.1539280608

* When loading a topology that has already been loaded, return HTTP 200 instead of
  500.
* Move Zipkin setup messages out of the error log and into the debug log.
* Skip unparseable metric\_locators during replication.
* Turn off sync writes in tagged surrogate writer.
* Fix potential crashes when check\_name is NULL.
* Documentation: fix missing rebalance state.
* Add log deduplication to avoid spamming errorlog with identical messages.
* Fix potential deadlock that could be triggered when forking off a process to
  be monitored by the watchdog.
* Fix some potential crashes/memory leaks.
* When loading a new topology, return 200 status instead of 500 if the topology
  is already loaded.
* Support tag removal.
* Performance/stability improvements for activity list operations.
* Fix wildcard/regex queries inside tag categories.

## libmtev

Version: 1.5.11

* Implement log deduplication via `dedup_seconds` configuration option.
* Watchdog config option to disable saving of glider stdout, useful in cases
  where the glider produces its own output files.
* Document `mtev.xml*` functionality.
* Fix unsafe fork (fork while `resize_lock` held) in logging subsystem.
* Fix tagged release version extraction.
* Fix infinite loop when logging oversized log entries, introduced in 1.5.8.

## Reconnoiter

Version: 0.1.1539263519

* Protect against empty rulesets.
* Fix AWS check module to properly handle spaces in metric names.
* Clearer error messages for REST calls.
* Allow colons in stream-tag values.
* Find filtersets below toplevel.
* Fix for broker config corruption.

## Web UI/API

Version: 0.1.1539284260

* UI: Updated keyboard help overlay to remove old invalid keyboard shortcuts.
* UI: Expose Prometheus check type when broker capability allows.
* UI: Avoid displaying encoded histogram values in check preview.
* UI: When initializing overlays on shared graphs, don't try to pull the share
  config before it's loaded.

---
title:
---

# Release Notes: 2019-01-14

## data_storage

Version: 0.1.1546970493 (6cc0c27)

* Fix bug where tagged metrics were not being loaded into the surrogate cache
  at startup correctly.
* Tune the surrogate asynch update journal settings to improve performance.
* Cluster resize tool will use default API port for bootstrap node if not
  specified.

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1547256603 (a8719ed)

* Bug in search query-building logic affected a small number of cases, now
  fixed.
* Fixes for cookie-based SAML authentication.

## Web UI/API

Version: 0.1.1547226522 (5180b9e)

* API: `remove_rules` option to delete checkbundle has been removed and is
  always considered "on". This means deleting a check bundle or removing a
  broker from a check_bundle (which removes a check) will always remove any
  Alert RuleSets that were dependent on that check/bundle.
* UI: Update the Metrics Explorer and Metric Details pages with support for
  metrics having both numeric and text data (due to having their type switched
  at some point in the past.) For these metrics, the numeric type dropdown will
  allow switching between text data and numeric data.
---
title:
---

# Release Notes: 2018-12-31

## caql_broker

Version: 0.1.1545429321 (fa98828)

* Tag search support.

## data_storage

Version: 0.1.1545615771 (be925c1)

* Skip deleting from the raw database when doing full deletes. Raw shards will
  be automatically deleted during rollup, so this saves considerable time in
  the full delete case.
* Remove timeout on single-metric raw deletes that caused spurious failures on
  larger delete operations.
* Extend NNT delete debug logging to cover NNTBS.
* Changes to support caql-broker tag search.
* CAQL: Create NULL literal that can be injected as a constant, as with
  VIEW_PERIOD and VIEW_RANGE.
* Fix several surrogate-db processing issues.

## fault_detection

Version: 0.1.1544639627 (db11a23)

* If not processing rules, do not load absence timers or perform broker checks.

## Reconnoiter

Related roles: broker, caql_broker, data_storage, stratcon, web_stream

Version: 0.1.1545407666 (e21a326)

* Truncate long tag categories and/or values uniquely. Truncated tags will show
  the longest possible amount of the original tag category or value, suffixed
  with `_tldr_<sha1_hex>` where `<sha1_hex>` is the hash of the original
  category or value.
* Changes to support caql-broker tag search. 

## GoAPI

Related roles: api, web_frontend

Version: 0.1.1546009951 (21a3612)

* Fix search bug with base64-encoded regex queries.
* SAML authentication support.

## Web UI/API

Version: 0.1.1545359271 (65330ee)

* UI: Fix "Add Login" control for Okta on user profile page.
* UI: Fix encoding of annotation titles and descriptions on annotation details
  page.
* Allow searching rules by check UUID.
* Prevent repeat alerts from rules on inactive checks.
