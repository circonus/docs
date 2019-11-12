# Slack Alerting {#SlackAlerting}

Circonus Inside customers can enable Slack Alerting by creating a Slack Contact Group and assigning it to one or more Rulesets. The alerts can be configured with action buttons allowing users to acknowledge alerts or set maintenance windows from directly within Slack.

To enable this feature, you will need to visit Slack.com, create a Slack App, and configure it as shown in the steps below.

## Create Slack App {#CreateSlackApp}

To start, visit [https://api.slack.com/apps](https://api.slack.com/apps) and click the "Create New App" button. In the form that is presented, give your app a name and select which of your Slack teams will own and manage the app.

![Image: 'slack-inside-alerts_01.png'](/assets/slack-inside-alerts_01.png?raw=true)

Then click the "Create App" button.

You will be directed to a screen to enter Basic Information about your app.

![Image: 'slack-inside-alerts_02.png'](/assets/slack-inside-alerts_02.png?raw=true)

You can navigate to the various components of your app using the menu to the left.

## OAuth Permissions {#OAuthPermissions}

On the navigation menu under Features, click OAuth & Permissions and then click Add a new Redirect URL:

![Image: 'slack-inside-alerts_05.png'](/assets/slack-inside-alerts_05.png?raw=true)

You will need to add the following two redirect URLs, one for adding the Slack App to your Circonus installation, and one for your users to sign in via Slack, both of which are required for configuring a Slack Contact Group in Circonus.  Substitute your domain name (refer to the URL you use to access the Circonus UI, for example circonus.acme.com):

![Image: 'slack-inside-alerts_06.png'](/assets/slack-inside-alerts_06.png?raw=true)

Then click Save URLs.

## Permission Scopes {#PermissionScopes}

On the same page, scroll down to Permission Scopes and click the dropdown menu to display the list of scopes.

![Image: 'slack-inside-alerts_07.png'](/assets/slack-inside-alerts_07.png?raw=true)

Add the following scopes. Note that you can type the scope name to quickly find the scope in the dropdown:

* `channels:read` - to populate the Slack Contact Group channels selector
* `team:read` - to display your team name on the Slack Contact Group
* `chat:write:bot` - to send alerts to your Slack channel
* `commands` - to enable Circonus slash commands

When finished, your screen should look like this:

![Image: 'slack-inside-alerts_08.png'](/assets/slack-inside-alerts_08.png?raw=true)

Then click Save Changes.

## Interactive Messages {#InteractiveMessages}

Note: You may skip this step if you do not wish to use action buttons on Slack alert notifications. Action buttons allow users to acknowledge alerts or set maintenance windows from directly within Slack.

If you configure this feature, Slack.com must be able to reach the Circonus web service on your premises via a URL you specify.

On the navigation menu under Features, click Interactive Messages, and then click Enable Interactive Messages:

![Image: 'slack-inside-alerts_03.png'](/assets/slack-inside-alerts_03.png?raw=true)

Enter the Request URL for the `/slack/button_handler` endpoint.

Note: the Request URL must be an `https://` endpoint for action buttons to work.

The Options Load URL can be left blank.

![Image: 'slack-inside-alerts_04.png'](/assets/slack-inside-alerts_04.png?raw=true)

Then click Enable Interactive Messages.

## App Credentials {#AppCredentials}

On the navigation menu under Settings, click Basic Information and scroll down to App Credentials.

![Image: 'slack-inside-alerts_09.png'](/assets/slack-inside-alerts_09.png?raw=true)

The values there will need to be added to your site configuration. Please get assistance from Circonus for this.

You may scroll further and configure the Display Information for your app or delete the app if you wish to start over.

## Configure Slack Contact Group {#ConfigureSlackContactGroup}

You are now ready to create a Slack Contact Group in Circonus which you can add to a Ruleset for receiving alerts in your Slack channel.

See the [Slack Contact Group](https://login.circonus.com/resources/docs/user/Alerting/ContactGroups.html#Slack) documentation to proceed.

