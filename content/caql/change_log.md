---
title: ChangeLog
weight: 50
---

# CAQL Change Log

We will document changes to the CAQL language here.

Backward compatibility is a major concern for us.
Changes to existing behavior are rare, and are typically predicated on bug fixes or performance improvements.
Breaking changes will be explicitly marked in this document.

## 2020-04-24

- Add `filter:*` package.

## 2020-02-03

- Add `integrate:while()` function.
- Add broadcast support to `forecasting:slope()` and `forecasting:regression()`. With this change, the functions will now forecast all input slots, not only the first one.
- Add `forecasting:auto()` function.
- Add `histogram:ratio_above()` and `histogram:ratio_below()` functions.
- Fix a bug where `fill()` would not fill in data.
- Improve performance of `window:merge()`.
- Fix a bug where `find()` queries would fail during service restarts.

## 2019-12-02

- Add `histogram:subtract()` function
- Add `base` parameter to `integrate()`
- Add `#serial` directive
- Fixes to `NULL` literal

## 2019-11-08

- Allow multiple input streams to `delay()`

- Performance improvements to `integrate()` and `delay()` functions.

- Deprecate `histogram:window` / `histogram:rolling` in favour of `window:histogram`, `window:rolling`

- Revise the time aggregation functions `window:*` and `rolling:*`
  - Speedup processing by leveraging pre-aggregated data
  - Add support for multiple input streams
  - Align window boundaries consistently
  - Add `window:first()` function, that selects the first sample in each window
  - Add `window:merge()` function, to aggregate histograms over time
  - Add "skip" parameter to control the advancement of time windows
  - Add "period" parameter to control the granularity of input data
  - Add "align=start/end" parameter to control alignment of the output data
  - Add "offset" parameter to control window offset against UTC

- **\[Breaking Change\]**
  Change the default output of `window:*` in batch mode, to be synchronous with the data.
  Before this change the output of `window:*` function was delayed a full window size behind the input data.
  The old behaviour can be restored by passing align="end" as parameter.

## 2019-10-29

- Optimize a number of query patterns to leverage federated data processing:
  - `find() | stats:{sum,mean}`
  - `find() | count()`
  - `find() | top()`
  - `find:histogram() | histogram:merge()`
  - `find:histogram() | histogram:sum() | stats:sum()`
- Fix bugs with limiting and sorting outputs.
- Add default labels to `histogram:*` output
- Restrict sorting of results to the `find()` function, so that, e.g. top-k output is not sorted by label
- Add `tag:remove()` function
- Set default/max limits for CAQL find() queries to 1000/3000
- Speed-up data fetching with the `metric()`, `search:metric()` and `metriccluster()` functions
- Deprecate `search:metric()` and `metriccluster()` functions in favour of `find()`
- Fix `count()` function, to not count NaN values
