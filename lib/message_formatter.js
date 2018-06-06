const moment = require('moment')
const IGNORED_TAGS = ['blocked', 'hold for deployment']
const REPO_API = 'https://api.github.com/repos/'

module.exports = class MessageFormatter {
  constructor (message) {
    this.message = message
    this.attachment = {attachments: []}
  }

  format () {
    return {
      'attachments':
                [{
                  'fallback': this.message.title,
                  'color': this._assignColor(),
                  'author_name': this.message.user.login,
                  'author_link': this.message.user.html_url,
                  'author_icon': this.message.user.avatar_url,
                  'title': this.message.title,
                  'title_link': this.message.pull_request.html_url,
                  'text': this.message.body,
                  'fields': this._fields()
                }]
    }
  }

  _fields () {
    const fields = [{
      title: 'Age',
      value: this._daysOldText(),
      short: true
    }, {
      title: 'Author',
      value: this.message.user.login,
      short: true
    }, {
      title: 'Repo',
      value: this.message.repository_url.replace(REPO_API, ''),
      short: false
    }, {
      title: 'Labels',
      value: this.message.labels.map(l => l.name).join(', '),
      short: false
    }]

    return fields.filter(f => f.value.length > 0)
  }

  _daysOldText () {
    const daysOld = this._daysOld()
    if (daysOld === 0) {
      return 'Opened today'
    } else if (daysOld === 1) {
      return '1 day'
    } else {
      return `${daysOld} days`
    }
  }

  _daysOld () {
    const now = moment()
    return now.diff(moment(this.message.created_at), 'days')
  }

  _assignColor () {
    const hasBlockingLabel = this.message.labels.some(l => IGNORED_TAGS.includes(l.name))
    if (hasBlockingLabel) {
      return '#ccc'
    } else if (this._daysOld() >= 10) {
      return 'danger'
    } else if (this._daysOld() >= 5) {
      return 'warning'
    } else {
      return 'good'
    }
  }
}
