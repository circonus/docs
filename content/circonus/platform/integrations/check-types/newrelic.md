## NewRelic {#NewRelic}
 * **Category:** system
 * **Dataflow:** pull
 * **Default Port:** 443 (not configurable)

The NewRelic check type allows you to import your NewRelic data into Circonus for easy correlation between services. If you need a NewRelic account, click [here](http://newrelic.com/circonus) (to visit http://newrelic.com/circonus) to get signed up for a free standard account.

The configuration for this check requires a NewRelic API key. If you need help finding your key or enabling API access, please refer to the  [NewRelic documentation](https://newrelic.com/docs/instrumentation/getting-started-with-the-new-relic-rest-api#setup).

![Image: 'check_newrelic_initial_api3.png'](/images/circonus/check_newrelic_initial_api3.png)

Enter the API key into the check configuration and then click "Get Applications".

![Image: 'check_newrelic_applications_api3.png'](/images/circonus/check_newrelic_applications_api3.png)

This will pull a list of all the applications you have registered with NewRelic, allowing you to select the one you want to monitor. After you choose the one you want, test, confirm, and finish creating the check. It's that easy!
