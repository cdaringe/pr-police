/**
 * @Object holidays is a set of lists containing the details of holidays.
 * @property {array}  holidays.simple - List of simple date-based holidays--no leading zeroes. Empty if none.
 * @property {array}  holidays.forward - List of holidays that are `n` from beginning of the month (month/num/day). Empty if none.
 * @property {array}  holidays.backward - List of holidays that are `n` from end of the month (month/num/day). Empty if none.
 */
module.exports = {
  simple: [
    '1/1',    // New Year's Day
    '7/4',    // Independence Day
    '7/24',   // Pioneer Day
    '12/24',  // Christmas Eve
    '12/25'   // Christmas Day
  ],
  forward: [
    '1/3/1',  // Birthday of Martin Luther King, third Monday in January
    '2/3/1',  // President's Day, third Monday in February
    '9/1/1',  // Labor Day, first Monday in September
    '11/4/4', // Thanksgiving Day, fourth Thursday in November
    '11/4/5'  // Black Friday, fourth Friday in November
  ],
  backward: [
    '5/1/1'   // Memorial Day, last Monday in May
  ]
}
