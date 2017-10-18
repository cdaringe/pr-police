const commands = require('./commands')
const holidays = require('./holidays')

const isDirectMessage = function isDirectMessage (msg) {
  // slack direct messages channel id start with D
  return msg.type === 'message' && msg.channel.charAt(0) === 'D'
}

const isBotMessage = function isBotMessage (msg) {
  return msg.subtype && msg.subtype === 'bot_message'
}

const isMessage = function isMessage (msg) {
  return msg.type === 'message'
}

// for now all commands execute the same operation
const isBotCommand = function isBotCommand (msg) {
  return commands.some((command) => msg.text === command)
}

/**
 * @function isHoliday - Takes a JavaScript Date object or string, and checks to see if it is one of the 11 standard holidays.
 * @param {Date|string} dateToCheck - The date to check. Either a JavaScript Date object or a string in the format YYYY-MM-DD.
 * @returns {boolean} - true if passed-in date is a holiday, false if not.
 * @reference - https://www.softcomplex.com/forum/viewthread_2814/
*/
const isHoliday = function isHoliday (dateToCheck) {
  // Accept either JavaScript Date, or Date-acceptable string
  if (typeof dateToCheck === 'string' || dateToCheck instanceof String) {
    var dateFields = dateToCheck.split(/[-]+/)
    var localDateToCheck = new Date(parseInt(dateFields[0], 10), parseInt(dateFields[1], 10) - 1, parseInt(dateFields[2], 10))
  } else if (Object.prototype.toString.call(dateToCheck) !== '[object Date]') {
    return false
  }

  // Holidays: Simple (month/date)

  var dayNumber = localDateToCheck.getDate()
  var monthNumber = localDateToCheck.getMonth() + 1
  var formattedDate1 = monthNumber + '/' + dayNumber

  if (holidays.simple.includes(formattedDate1)) {
    console.log(localDateToCheck.toDateString(), 'is an excluded holiday')
    return true
  }

  // Observed Holidays:
    // today == Friday && tomorrow == holiday || today == Monday && yesterday == holiday

  var weekdayNumber = localDateToCheck.getDay()
  var temporaryDate = new Date(localDateToCheck)
  temporaryDate.setDate(localDateToCheck.getDate() + 1)
  var tomorrow = (temporaryDate.getMonth() + 1) + '/' + temporaryDate.getDate()
  temporaryDate.setDate(localDateToCheck.getDate() - 1)
  var yesterday = (temporaryDate.getMonth() + 1) + '/' + temporaryDate.getDate()

  if (weekdayNumber === 5 && holidays.simple.includes(tomorrow)) {
    console.log(localDateToCheck.toDateString(), 'is an observed holiday')
    return true
  } else if (weekdayNumber === 1 && holidays.simple.includes(yesterday)) {
    console.log(localDateToCheck.toDateString(), 'is an observed holiday')
    return true
  } else if (weekdayNumber === 2 && formattedDate1 === '12/26') { // Christmas edge case
    console.log(localDateToCheck.toDateString(), 'is an observed holiday')
    return true
  }

  // Holidays: Weekday from beginning of the month

  var weekNumber = Math.floor((dayNumber - 1) / 7) + 1
  var formattedDate2 = monthNumber + '/' + weekNumber + '/' + weekdayNumber

  if (holidays.forward.includes(formattedDate2)) {
    console.log(localDateToCheck.toDateString(), 'is an excluded holiday')
    return true
  }

  // Holidays: Weekday from end of the month

  temporaryDate = new Date(localDateToCheck)
  temporaryDate.setDate(1)
  temporaryDate.setMonth(temporaryDate.getMonth() + 1)
  temporaryDate.setDate(temporaryDate.getDate() - 1)
  weekNumber = Math.floor((temporaryDate.getDate() - dayNumber - 1) / 7) + 1

  var formattedDate3 = monthNumber + '/' + weekNumber + '/' + weekdayNumber

  if (holidays.backward.includes(formattedDate3)) {
    console.log(localDateToCheck.toDateString(), 'is an excluded holiday')
    return true
  }

  // Date does not match any specified holidays
  return false
}

module.exports = { isDirectMessage, isBotMessage, isMessage, isBotCommand, isHoliday }
