---
title:
draft: true
---

## Google Analytics {#GoogleAnalytics}
 * **Category:** system
 * **Dataflow:** pull
 * **Default Port:** 443 (not configurable)

Importing Google Analytics data into Circonus is an easy way to combine your system, application, or network data with business analytics. Google provides seven different feeds to choose from: Campaigns, Content, eCommerce, Events, Goals, Searches, and Visitors. In Circonus each of these has their own check type.

**Note:**
> Google places a quota limitation on any requests against your profile.


### Google Analytics Check Types {#GoogleAnalyticsCheckTypes}
Google provides seven different feeds to choose from: Campaigns, Content, eCommerce, Events, Goals, Searches, and Visitors. In Circonus, each of these has their own check type.

Details of Each Google Analytics Feed
 * Campaigns
  * `adClicks` - The total number of times users have clicked on an ad to reach your property.
  * `adCost` - Derived cost for the advertising campaign. The currency for this value is based on the currency that you set in your AdWords account.
  * `adCPC` - Cost to advertiser per click.
  * `adCTR` - Click-through-rate for your ad. This is equal to the number of clicks divided by the number of impressions for your ad (i.e. how many times users clicked on one of your ads where that ad appeared).
  * `impressions` - Total number of campaign impressions.
 * Content
  * `uniquePageviews` - The number of different (unique) pages within a session.
 * eCommerce
  * `itemRevenue` - The total revenue from purchased product items on your property.
  * `itemQuantity` - The total number of items purchased. For example, if users purchase 2 frisbees and 5 tennis balls, 7 items have been purchased.
  * `transactions` - The total number of transactions.
  * `transactionRevenue` - The total sale revenue provided in the transaction, excluding shipping and tax.
  * `transactionShipping` - The total cost of shipping.
  * `transactionTax` - The total amount of tax.
  * `uniquePurchases` - The number of product sets purchased. For example, if users purchase 2 frisbees and 5 tennis balls from your site, 2 unique products have been purchased.
 * Events
  * Totals
  * Uniques
  * Value
 * Goals
  * `goalCompletionsAll` - The total number of completions for all goals defined for your profile.
  * `goalStartsAll` - The total number of starts for all goals defined for your profile.
  * `goalValueAll` - The total numeric value for all goals defined for your profile.
 * Searches
  * `searchDepth` - The average number of subsequent pageviews made on your property after a use of your internal search feature.
  * `searchDuration` - The visit duration to your property where a use of your internal search feature occurred.
  * `searchExits` - The number of exits on your site that occurred following a search result from your internal search feature.
  * `searchRefinements` - The total number of times a refinement (transition) occurs between internal search keywords within a session. For example, if the sequence of keywords is: “shoes”, “shoes”, “pants”, “pants”, the value for this metric will be 1 because the transition between “shoes” and “pants” is different.
  * `searchUniques` - The total number of unique keywords from internal searches within a session. For example, if “shoes” was searched for 3 times in a session, it will be counted only once.
  * `searchVisits` - The total number of sessions that included an internal search.
 * Visitors
  * `bounces` - The total number of single page (or single engagement hit) sessions for your property.
  * `entrances` - The number of entrances to your property measured as the first pageview in a session
  * `exits` - The number of exits from your property.
  * `newVisits` - The number of visitors whose visit to your property was marked as a first-time visit.
  * `pageviews` - The total number of pageviews for your property.
  * `timeOnPage` - How long a visitor spent on a particular page in seconds, calculated by subtracting the initial view time for a particular page from the initial view time for a subsequent page. Thus, this metric does not apply to exit pages for your property.
  * `timeOnSite` - The total duration of visitor sessions, represented in total seconds.
  * `visitors` - Total number of visitors to your property for the requested time period.
  * `visits` - Counts the total number of sessions.


### Creating a Google Analytics Check and OAuth Token {#CreatingaGoogleAnalyticsCheckandOAuthToken}
Google requires an OAuth token to authenticate with their servers. The first step in setting up any GA check is to create this token. To do so, navigate to the "User:3rd Party Tokens" page. See "[3rd Party Tokens](/Administration/Profile.md#a3rdPartyTokens) in this manual.

![Image: '3rd_party_tokens.png'](/images/circonus/3rd_party_tokens.png)

Click "New 3rd Party Token +" to create a new token, name it, and then click "OK".

![Image: '3rd_party_token_destination_site.png'](/images/circonus/3rd_party_token_destination_site.png)

Once you click "OK", you will be redirected to Google to select an account (not shown). Then you will be asked to allow access for Circonus to access your Google Analytics data.

![Image: '3rd_party_token_permission.png'](/images/circonus/3rd_party_token_permission.png)

After allowing access, you will be redirected back to your user profile with a message saying that you have successfully created a token.

Create a new check and select the Google Analytics check type for the check you wish to create. When the dialog opens, select the OAuth token you want to use.

![Image: 'check_ga_config_initial.png'](/images/circonus/check_ga_config_initial.png)

Click "Get Profiles" to retrieve a list of website profiles from Google. Select the website from which you wish to pull data and test the check.

![Image: 'check_ga_config_profile.png'](/images/circonus/check_ga_config_profile.png)

Name your check, select the metrics to collect, and finish.
