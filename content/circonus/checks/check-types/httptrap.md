---
title: HTTPTrap
---

## HTTPTrap {#HTTPTrap}
 * **Category:** custom
 * **Dataflow:** push
 * **Default Port:** 43191

The HTTPTrap check is a little different than the rest of the Circonus checks; instead of pulling information on a regular interval, it accepts JSON payloads sent via HTTP PUT requests. This data is not polled regularly from the Circonus Broker, but is pushed to the Broker from the monitored target. This is the easiest way to get arbitrary data into Circonus.

**Note:**
> Circonus brokers use an internal CA to sign their certificates.  Because of this clients sending data to them may require the CA certificate to be imported in order to fully verify the SSL connection.  The Circonus CA certificate can be found here: http://login.circonus.com/pki/ca.crt

During the configuration process you will be asked for 2 items: the target host for this check and a "secret". The host for push style checks should be the IP or the resolvable server name from where the packets originate. The "secret" will be used as part of your submission URL for added security. The secret is a string containing letters, numbers, or underscores.

![Image: 'check_httptrap_initial3.png'](/images/circonus/check_httptrap_initial3.png)

The "JSON Docs" button describes how the JSON you PUT will be parsed into metrics. See [below](/circonus/checks/check-types/httptrap#HTTPTrapJSONDocs) for more details.

Clicking "Test Check" will navigate to the final confirmation screen as normal. Since Circonus can't pull the data, you will be asked to enter your metric names on this screen. It's alright if you don't know the metrics at this point; just click "Finish" and the check will be created with no metrics.

![Image: 'check_httptrap_final3.png'](/images/circonus/check_httptrap_final3.png)

After you create your check, we will provide a URL to which you will PUT your data. At this point, navigate to the details page for your newly created HTTPTrap check. Note the "Data Submission URL" link in the middle row.

![Image: 'check_httptrap_details3.png'](/images/circonus/check_httptrap_details3.png)

After submitting data for the first time, you will want to specify which metrics you collect. Use the Menu at top right and click "Change Brokers & Metrics" to switch the metrics list into an edit mode.

![Image: 'check_httptrap_change_metrics3.png'](/images/circonus/check_httptrap_change_metrics3.png)

This will allow you to select and deselect metrics you want to collect. Click the "Save" button to finalize your choices.

![Image: 'check_httptrap_metrics3.png'](/images/circonus/check_httptrap_metrics3.png)


#### Advanced Configuration {#AdvancedConfiguration}
The "Period" refers to how often the check runs. If asynchronous collection is enabled, each value will be remembered as soon as it's received. Then once per period, the values from that period will be averaged and the average will be stored. Otherwise, only the most recent value will be stored, once per period.

"Timeout" refers to how long the check takes to run. For example, on an HTTP check, if we don't get a response within the timeout, we call the check a timeout and the value is null. This should almost never occur on an HTTPtrap check.


### HTTPTrap JSON Docs {#HTTPTrapJSONDocs}
This subsection describes how the JSON you PUT will be parsed into metrics.

This is an example of JSON format:
```
{ 
  "number": 1.23,
  "bignum_as_string": "281474976710656",
  "test": "a text string",
  "container": { "key1": 1234 },
  "array": [  1234, 
              "string",
              { "crazy": "like a fox" }
           ]
}
```
There is no particular data structure required by Circonus; format your data however you wish and Circonus will parse it accordingly. Circonus would parse the above example into the following metrics ("services" shows how many metrics resulted from parsing):
 * `array`0` -> 1234
 * `array`1` -> string
 * `array`2`crazy` -> like a fox
 * `bignum_as_string` -> 281474976710656
 * `container`key1` -> 1234
 * `number` -> 1.23000000
 * `services` -> 7
 * `test` -> a text string

In addition to strings and numeric values, values can also be described using ` { "_type": <type>, "_value": <value> } ` syntax. The available types are the same used in [Resmon](/circonus/checks/check-types/resmon) (`s, l, L, i, I,` and `n`). Values can be strings or numbers, but are force interpreted pursuant to the type specified. For example,
 * ` { "_type": s, "_value": 812345 } ` -> 812345 (as a string type)
 * ` { "_type": L, "_value": "2187345234234" } ` -> 2187345234234 (as an unsigned 64bit integer)

For example, to pass multiple values for histogram data using httptrap as an array, you could use the following example format:
```
{
  "histogram" : {
    "_type": "h",
    "_value": [1,2,3,4,5]
  }
}
```

Numeric values for histograms can be provided in two additional ways:
 * As a list. For example `[123,123,234,345,234,1]`.
 * As a prebucketed histogram. For example `["H[0.1]=3", "H[11]=7"]`, would mean that in the bin 0.1 (which is 0.10 to 0.11) there are 3 samples and in the bin 11 (which is 11 to 12) there are 7 samples.

If HTTPtrap submissions contain an extended value with `_ts`, the individual measurement will be timestamped with the provided valid instead of the default "now."  The value of `_ts` should be specified in millisecond since UNIX epoch 1970-01-01 00:00:00-0000.  `_ts` is a peer to the `_type` and `_value` keys specified above.

Here is a complete example of how to submit data to a HTTP JSON Trap:

```
curl -X PUT --cacert ca.crt 'https://trap.noit.circonus.net/module/httptrap/a9856a6a-3b46-e18b-d890-acafaa955348/mys3cr3t' --data '{
    "number": 1.23,
    "bignum_as_string": "281474976710656",
    "test": "a text string",
    "container": { "key1": 1234 },
    "array": [  1234,
                "string",
                { "crazy": "like a fox" }
             ]
  }'
```
