const Slackbot = require('slackbots')
const pullhub = require('pullhub')
const moment = require('moment')
const messages = require('./messages')
const {
  isDirectMessage,
  isBotMessage,
  isMessage,
  isBotCommand,
  isHoliday
} = require('./helpers')
const MessageBuilder = require('./message_builder')

module.exports = function server () {
  const env = process.env
  const requiredEnvs = ['SLACK_TOKEN', 'GH_TOKEN', 'GH_REPOS']

  if (requiredEnvs.some((k) => !env[k])) {
    throw (
      new Error('Missing one of this required ENV vars: ' + requiredEnvs.join(','))
    )
  }
  const channels = env.SLACK_CHANNELS ? env.SLACK_CHANNELS.split(',') : []
  const daysToRun = env.DAYS_TO_RUN || 'Monday,Tuesday,Wednesday,Thursday,Friday'
  const timesToRun = env.TIMES_TO_RUN ? env.TIMES_TO_RUN.split(',') : [900]
  const DEBUG = env.DEBUG || false
  const groups = env.SLACK_GROUPS ? env.SLACK_GROUPS.split(',') : []
  const repos = env.GH_REPOS ? env.GH_REPOS.split(',') : []
  const excludeLabels = env.GH_EXCLUDE_LABELS ? env.GH_EXCLUDE_LABELS.split(',') : []
  const labels = env.GH_LABELS
  const notifyIfNone = env.NOTIFY_WHEN_NONE_FOUND || false
  const checkInterval = 60000 // Run every minute (60000)
  const botParams = params => { return Object.assign(params, {icon_url:  env.SLACK_BOT_ICON}) }

  const bot = new Slackbot({
    token: env.SLACK_TOKEN,
    name: env.SLACK_BOT_NAME || 'PR Police'
  })

  bot.on('start', () => {
    setInterval(() => {
      const now = moment()
      // Check to see if current day and time are the correct time to run
      if (daysToRun.toLowerCase().indexOf(now.format('dddd').toLowerCase()) !== -1) {
        for (var i = timesToRun.length; i--;) {
          // Do not run on holidays or company holiday observance days (see: holidays.js)
          if (!isHoliday(now.format('YYYY-MM-DD'))) {
            if (parseInt(timesToRun[i]) === parseInt(now.format('kmm'))) {
              console.log(now.format('dddd YYYY-MM-DD h:mm a'))

              getPullRequests()
                .then(buildMessage)
                .then(notifyAllChannels)
              return
            } else {
              if (i === 0) {
                DEBUG && console.log(now.format('kmm'), 'does not match any TIMES_TO_RUN (' + timesToRun + ')')
              }
            }
          }
        }
      } else {
        DEBUG && console.log(now.format('dddd'), 'is not listed in DAYS_TO_RUN (' + daysToRun + ')')
      }
    }, checkInterval)
  })

  bot.on('message', (data) => {
    if ((isMessage(data) && isBotCommand(data)) ||
      (isDirectMessage(data) && !isBotMessage(data))) {
      getPullRequests()
        .then(buildMessage)
        .then((message) => {
          bot.postMessage(data.channel, '', botParams(message))
        })
    }
  })

  bot.on('error', (err) => {
    console.error(err)
  })

  function getPullRequests () {
    console.log('Checking for pull requests...')

    return pullhub(repos, labels).catch((err) => { console.error(err) })
  }

  function buildMessage (data) {
    if (!data) {
      return Promise.resolve(messages.GITHUB_ERROR)
    }

    if (data.length < 1) {
      if (notifyIfNone) {
        return Promise.resolve(messages.NO_PULL_REQUESTS)
      } else {
        return Promise.resolve()
      }
    }

    const messageBuilder = new MessageBuilder(data, excludeLabels, DEBUG)
    const messages = messageBuilder.build()

    if (messages.length) {
      return Promise.resolve(messages)
    }
  }

  function notifyAllChannels (lines) {
    if (lines || notifyIfNone) {
      console.log('Alerting channels:', channels, groups)
      if (typeof lines !== 'string') {
        channels.map((channel) => {
          bot.postMessageToChannel(channel, messages.PR_LIST_HEADER, botParams({}))
        })
        groups.map((group) => {
          bot.postMessageToGroup(group, messages.PR_LIST_HEADER, botParams({}))
        })
      }

      setTimeout(() => {
        if (typeof lines !== 'string') {
          lines.map((line) => {
            channels.map((channel) => {
              bot.postMessageToChannel(channel, '', botParams(line))
            })
            groups.map((group) => {
              bot.postMessageToGroup(group, '', botParams(line))
            })
          })
        } else {
          DEBUG && console.log(lines)
          channels.map((channel) => {
            bot.postMessageToChannel(channel, '', botParams(line))
          })
          groups.map((group) => {
            bot.postMessageToGroup(group, '', botParams(line))
          })
        }
      }, 1000)
    } else {
      DEBUG && console.log('No pending pull requests found for repositories:', repos)
    }
  }
}
