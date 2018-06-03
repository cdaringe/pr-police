const MessageFormatter = require('./message_formatter');

module.exports = class MessageBuilder {
  constructor(apiData, excludeLabels = [], debug = false) {
    this.apiData = apiData;
    this.excludeLabels = excludeLabels;
    this.debug = debug;
    this.messages = [];
  }

  build() {
    for (var i = this.apiData.length; i--;) {
      if (this.excludeLabels.length) {
        let foundExcludeLabel = false
        for (var j = this.apiData[i].labels.length; j--;) {
          for (var k = this.excludeLabels.length; k--;) {
            if (this.apiData[i].labels[j].name === this.excludeLabels[k]) {
              this.debug && console.log('exclude label match:', this.excludeLabels[k], 'for:', this.apiData[i].repository_url.replace('https://api.github.com/repos/', ''), '--', this.apiData[i].title)
              foundExcludeLabel = true
              break
            }
          }
          if (foundExcludeLabel) {
            break
          }
        }
        if (!foundExcludeLabel) {
          this._addLine(this.apiData[i])
        }
      } else {
        this._addLine(this.apiData[i])
      }
    }
    return this.messages;
  }

  _addLine(pr) {
    const formatter = new MessageFormatter(pr);
    this.messages.push(formatter.format());
  }
}
