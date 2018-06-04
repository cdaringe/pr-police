const pullhub = require('pullhub')
const moment = require('moment')
const messages = require('./messages')
const { isHoliday } = require('./helpers')
const MessageBuilder = require('./message_builder')

module.exports = class Runner {
  constructor(config, bot) {
    this.config = config
    this.bot = bot
  }

  call() {
    const now = moment()
    if (this.config.daysToRun.map(dtr => dtr.toLowerCase()).indexOf(now.format('dddd').toLowerCase()) !== -1) {
      for (var i = this.config.timesToRun.length; i--;) {
        // Do not run on holidays or company holiday observance days (see: holidays.js)
        if (!isHoliday(now.format('YYYY-MM-DD'))) {
          if (parseInt(this.config.timesToRun[i]) === parseInt(now.format('kmm'))) {
            console.log(now.format('dddd YYYY-MM-DD h:mm a'))
            
            this.getPullRequests().
              then(this.buildMessage.bind(this)).
              then(this.notifyAllChannels.bind(this))
          } else {
            if (i === 0) {
              this.config.DEBUG && console.log(now.format('kmm'), 'does not match any TIMES_TO_RUN (' + this.config.timesToRun + ')')
            }
          }
        }
      }
    } else {
      DEBUG && console.log(now.format('dddd'), 'is not listed in DAYS_TO_RUN (' + this.config.daysToRun + ')')
    }
  }

  buildMessage(data) {
    if (!data) {
      return Promise.resolve(messages.GITHUB_ERROR)
    }

    if (data.length < 1) {
      if (this.config.notifyIfNone) {
        return Promise.resolve(messages.NO_PULL_REQUESTS)
      } else {
        return Promise.resolve()
      }
    }

    const messageBuilder = new MessageBuilder(data, this.config.excludeLabels, this.config.DEBUG)
    const messages = messageBuilder.build()

    if (messages.length) {
      return Promise.resolve(messages)
    }
  }

  notifyAllChannels (lines) {
    const { config, bot } = this
    if (lines || config.notifyIfNone) {
      console.log('Alerting channels:', config.channels, config.groups)
      if (typeof lines !== 'string') {
        config.channels.map((channel) => {
          bot.postMessageToChannel(channel, messages.PR_LIST_HEADER, config.botParams({}))
        })
        config.groups.map((group) => {
          bot.postMessageToGroup(group, messages.PR_LIST_HEADER, config.botParams({}))
        })
      }

      setTimeout(() => {
        if (typeof lines !== 'string') {
          lines.map((line) => {
            config.channels.map((channel) => {
              bot.postMessageToChannel(channel, '', config.botParams(line))
            })
            config.groups.map((group) => {
              bot.postMessageToGroup(group, '', config.botParams(line))
            })
          })
        } else {
          DEBUG && console.log(lines)
          config.channels.map((channel) => {
            bot.postMessageToChannel(channel, '', botParams(line))
          })
          config.groups.map((group) => {
            bot.postMessageToGroup(group, '', botParams(line))
          })
        }
      }, 1000)
    } else {
      DEBUG && console.log('No pending pull requests found for repositories:', this.config.repos)
    }
  }

  getPullRequests () {
    console.log('Checking for pull requests...')

    return pullhub(this.config.repos, this.config.labels).catch((err) => { console.error(err) })
  }
}