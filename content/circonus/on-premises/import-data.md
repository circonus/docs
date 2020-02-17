---
title: Import Data
weight: 60
---

# Import Data

Circonus does not accept old data from brokers, but Circonus does allow you to manually import any data you may need. Follow these procedures to import data.

The URL will be `https://PATH TO CIRCONUS INSIDE WEB SERVER/api/json/import`.  Note that this path is not for the API server because we communicating with the web servers instead.  For the Auth, set the same `X-Circonus-Auth-Token` and `X-Circonus-App-Name` as the other API.

There are several query string options:
 * `id` - This is the `check_id` to which this metric will belong.
 * `min_value` - When set, this will skip and ignore any values that are less than (<) this value. These values will not be imported.
 * `max_value` - When set, this will skip and ignore any values that are greater than (>) this value. These values will not be imported.
 * `active` - This is set to either "`1`" or "`0`". If the metric doesn't yet exist on the check, this will add it. If this is set to 1, then the metric will be marked active. If this is set to 0, it will be disabled.
 * `interpolate` - This is either set to "`1`" or it is unset. We expect regular datapoints to inject into the data store. If this is set to 1 and there are gaps in the data, then datapoints will be generated to fill in the gaps with values the same as the last datapoint.

The data will need to be formatted correctly. Using the following format:
```
1329348660,foobar,331
1329348720,foobar,429
1329348780,foobar,275
1329348840,foobar,333
1329348900,foobar,156
1329348960,foobar,234
1329349020,foobar,867
1329349080,foobar,157
```
The first value is the epoch when it was collected, "`foobar`" is the metric name, followed by the value.  This data is PUT at the URL.

Once this is complete, you should see a file appear in `import.pending`. If the file does not appear, contact Circonus Support (support@circonus.com) for assistance.
