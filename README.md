# Pr. Police [![Build Status](https://travis-ci.org/Talkdesk/pr-police.svg?branch=master)](https://travis-ci.org/Talkdesk/pr-police)

## About

Pr. Police is a slackbot that sends to configured slack channels a listing of open pull requests that are waiting for a review. It supports watching multiple repositories, and both positively and negatively filtering pull requests by label.

### _FS Custom Configuration_
___

If desired, a team's Heroku instance can be configured to use a specifically-named branch. Example: If Tree's Gold Squadron wants specific formatting, it utilizes the `fs-bot-github-pr-tree-gold` branch, named exactly after its Heroku instance, and keys automatic deploys to that branch.

Run via: `heroku local`

Sample Heroku config variables/.env file (to run locally):

```bash
DAYS_TO_RUN=Monday,Tuesday,Wednesday,Thursday,Friday
DEBUG=true
GH_EXCLUDE_LABELS=DO NOT MERGE,do-not-merge,in-progress,needs-work
GH_REPOS=fs-eng/ng-shared-components,fs-eng/fanchart,fs-eng/frontier-tree,fs-eng/GeoIP-Country-Lists,fs-eng/tree-descendancy,fs-eng/tree-lifesketch,fs-eng/tree-notes,fs-eng/tree-pedigree,fs-eng/tree-port-pedigree,fs-webdev/dialog-el,fs-webdev/fs-add-person,fs-webdev/fs-cache,fs-webdev/fs-couple-renderer,fs-webdev/fs-demo,fs-webdev/fs-globals,fs-webdev/fs-indicators,fs-webdev/fs-labelled-link,fs-webdev/fs-life-events,fs-webdev/fs-modules,fs-webdev/fs-person-card,fs-webdev/fs-person-data-service,fs-webdev/fs-person-summary-extended,fs-webdev/fs-tree-person-renderer,fs-webdev/fs-user-service,fs-webdev/fs-watch,fs-webdev/styles-wc,fs-webdev/tree,fs-webdev/tree-data-handler,fs-webdev/wc-i18n
GH_TOKEN={FROM FS-CONFIG}
SLACK_BOT_ICON=https://avatars.slack-edge.com/2017-08-19/228967565346_addfa8c9fc1c6454684a_48.png
SLACK_BOT_NAME=gitbot
SLACK_GROUPS=treeweb-gold-github
SLACK_TOKEN={FROM SLACK BOT CONFIG}
TIMES_TO_RUN=0700,1300
TZ=America/Denver
```
___

## Running the bot

### The quick and easy way

The easiest way to get an instance of Pr. Police up and running is to deploy it to Heroku by clicking on the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

You'll still need to fill in all the environment variables. For more info on this, head down to the Configuration section.


### Via NPM

    npm install pr-police

### Manually

Git clone this repository then:

    npm install

#### Run

    npm start

This will start the server locally until `Ctrl-C` is pressed.

**Note:** You will need to pass all the required env vars.

## Configuration

Pr. Police has the following environment variables available:

##### `DEBUG`
Debug flag used to enable more verbose logging. Default: `false`

##### `DAYS_TO_RUN`
Which days of the week to run on. Default: `Monday,Tuesday,Wednesday,Thursday,Friday`

##### `GH_TOKEN`
The github account token to access the repos

##### `SLACK_TOKEN`
The slack token for the bot to access your slack team

##### `GH_REPOS`
The list of repositories to watch. The format is `user/repo` and comma separated.

Example: `rogeriopvl/gulp-ejs,rogeriopvl/pullhub,talkdesk/pr-police`

##### `GH_EXCLUDE_LABELS`
The list of labels that will cause a pull-request to be excluded. So imagine, your team uses the label `in-progress` for pull-requests not yet requiring review, you'll have to fill in: `in-progress`. Supercedes `GH_LABELS`. Multiple labels are comma separated.

Example: `do-not-merge,in-progress,needs-work`

##### `GH_LABELS`
The list of labels to filter pull-requests. So imagine, your team uses the label `needs review` for pull-requests waiting for review, you'll have to fill in: `needs review`. Multiple labels are comma separated.

NOTE: Omitting both `GH_EXCLUDE_LABELS` and `GH_LABELS` will result in _all_ open pull-requests being reported for the specified `GH_REPOS`.

##### `NOTIFY_WHEN_NONE_FOUND`
Whether to post, even when no PRs were found or were all filtered out.

##### `SLACK_CHANNELS`
The list of channels on your team where Pr. Police will post the announcements. Multiple channels are comma separated.

##### `SLACK_GROUPS`
The list of private groups on your team where Pr. Police will post the announcements. Multiple channels are comma separated.

##### `SLACK_BOT_NAME`
The name of your Pr. Police bot on slack.

##### `SLACK_BOT_ICON`
URL of the icon for the slack bot when sending messages.

##### `TIMES_TO_RUN`
What times of day to run (24-hour format, leading zeroes are not necessary). Multiple times are comma-separated. Default: `0900`.

##### `TZ`
The timezone the server should use. Heroku default is UTC. Uses tz database timezone format. Example: `America/Los_Angeles`.

## Heroku configuration

If heroku attempts to start a web process instead of a worker, you may need to run: `heroku ps:scale web=0 worker=1 -a {HEROKU_APP_NAME}`

## Credits

Pr. Police was developed by [Rogério Vicente](https://github.com/rogeriopvl) during one of Talkdesk's internal hackathons.
