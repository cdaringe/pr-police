const Config = require('./config')
const Slackbot = require('slackbots')
const {
  isDirectMessage,
  isBotMessage,
  isMessage,
  isBotCommand
} = require('./helpers')
const Runner = require('./runner')

module.exports = function server () {
  const config = new Config(process.env)

  const bot = new Slackbot({
    token: config.slackToken,
    name: config.slackBotName
  })

  const runner = new Runner(config, bot)

  bot.on('start', () => {
    setInterval(() => {
      // Check to see if current day and time are the correct time to run
      runner.call()
    }, config.checkInterval)
  })

  bot.on('message', (data) => {
    if ((isMessage(data) && isBotCommand(data)) ||
      (isDirectMessage(data) && !isBotMessage(data))) {
      getPullRequests()
        .then(runner.buildMessage)
        .then((message) => {
          bot.postMessage(data.channel, '', config.botParams(message))
        })
    }
  })

  bot.on('error', (err) => {
    console.error(err)
  })
}
