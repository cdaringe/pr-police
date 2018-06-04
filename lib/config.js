
const requiredEnvs = ['SLACK_TOKEN', 'GH_TOKEN', 'GH_REPOS']

module.exports = class Config {
  constructor(config) {
    this.config = config
    
    if (requiredEnvs.some((k) => !this.config[k])) {
      throw (
        new Error('Missing one of this required ENV vars: ' + requiredEnvs.join(','))
      )
    }
  }
  
  get slackToken() { return this.config.SLACK_TOKEN }
  get ghToken() { return this.config.GH_TOKEN }
  get ghRepos() { return this.config.GH_REPOS }
  get slackBotName() { return this.config.SLACK_BOT_NAME || 'PR Police' }
  get channels() { return this.config.SLACK_CHANNELS ? this.config.SLACK_CHANNELS.split(',') : [] }
  get daysToRun() { return (this.config.DAYS_TO_RUN || 'Monday,Tuesday,Wednesday,Thursday,Friday').split(',') }
  get timesToRun() { return this.config.TIMES_TO_RUN ? this.config.TIMES_TO_RUN.split(',') : ['900'] }
  get DEBUG() { return this.config.DEBUG || false }
  get groups() { return this.config.SLACK_GROUPS ? this.config.SLACK_GROUPS.split(',') : [] }
  get repos() { return this.config.GH_REPOS ? this.config.GH_REPOS.split(',') : [] }
  get excludeLabels() { return this.config.GH_EXCLUDE_LABELS ? this.config.GH_EXCLUDE_LABELS.split(',') : [] }
  get labels() { return this.config.GH_LABELS }
  get notifyIfNone() { return this.config.NOTIFY_WHEN_NONE_FOUND || false }
  get checkInterval() { return 60000 } // Run every minute (6000)
  get botParams() { return params => { return Object.assign(params, {icon_url:  this.config.SLACK_BOT_ICON}) } }
}