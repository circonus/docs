---
title:
draft: true
---

# Configuring Google Analytcs {#ConfiguringGoogleAnalytcs}

Circonus has a Google API account set up that we use to access user's data. This is accessed by default when a user generates a Google Analytics token on the main site. However, for Circonus Inside deployments, it is necessary for users to set up their own Google API account, configure it to collect Analytics data, and configure their agent and Circonus UI to access this feature.


## Setting Up An Account {#SettingUpAnAccount}

It is first necessary to sign up for a Google APIs account. To do this, follow the instructions at https://developers.google.com/console/help/ to get set up if you do not already have an account.

Once you have set up your account, click on the "Services" pane and activate the Analytics API. Once you have done this, click on the "API Access" pane. Click on "Create an OAuth 2.0 client ID". You will be taken to a page to create your client ID. Enter whatever you want for product name. Enter your home page for Home Page URL. On the next page, select "Web Application". You can leave the default value for "Your site or hostname" for now.

* **At this point, you will need to configure the client settings to allow the system to correctly be redirected to your site. First, open /www/etc/circonus.conf and note the value stored for Web** LoginDomain. Then, click "Edit Settings" on the "Client ID for web applications" panel.

Under "Authorized Redirect URLs", delete any values that are here and enter the following:

```
http://<Web::LoginDomain Value>/user/third_party_tokens
https://<Web::LoginDomain Value>/user/third_party_tokens
```

After this, click "Update". You have now configured your account.

There are three values you will need to note here on this page: 

```
1) The "Client ID" under "Client ID for Web Applications"
2) The "Client Secret" under "Client ID for Web Applications"
3) The "API Key" under "Simple API Access"
```

Once you have these noted/copied, you are ready to configure your Circonus system.


## Agent Configuration {#AgentConfiguration}
To configure your agent to use your Google API account, you will need to log in to your agent. Once logged in, click on "Google Analytics" under Inside Configuration. This will bring up a user interface where you can enter your Client ID, Client Secret, and API Key. Enter those in the boxes given and press "Submit Data" to configure your system.

Once you have done this, restart the agent. It is now configured to pull analytics data from your API account.


## User Interface Configuration {#UserInterfaceConfiguration}
There is a file on the webserver located at /www/etc/circonus.conf. It contains a series of values that are used to configure the system. You will need to edit the file to contain the following entries:

```
Circonus::GoogleAnalyticsClientID = YOUR CLIENT ID
Circonus::GoogleAnalyticsClientSecret = YOUR CLIENT SECRET
```

Restart the webserver. You should now be ready to go.


## Pulling Google Analytics Data {#PullingGoogleAnalyticsData}
Once everything is set up, you are ready to generate a Google Analytics token and use it to pull data. To do this, go to "User->3rd Party Tokens" at the top of the Circonus page. Click "New 3rd Party Token" and follow the instructions to generate a token. If something goes wrong, verify that you have followed all of the instructions above and gotten everything configured properly.

Once the token is generated, you can use it to create Google Analytics checks.
