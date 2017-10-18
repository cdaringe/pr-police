const test = require('tape')
const helpers = require('../lib/helpers')

test('it exports an object', (t) => {
  t.plan(1)

  t.equals(typeof helpers, 'object')
})

// TODO: Mock ./holidays object for more reliable testing

test('it should not break on month boundaries', (t) => {
  t.plan(2)

  t.notOk(helpers.isHoliday('2017-09-01'))
  t.notOk(helpers.isHoliday('2017-09-30'))
})

test('it correctly detects explicit holidays', (t) => {
  t.plan(2)

  t.ok(helpers.isHoliday('2017-01-01'))
  t.ok(helpers.isHoliday('2017-12-25'))
})

test('it correctly detects observed holidays', (t) => {
  t.plan(2)

  t.ok(helpers.isHoliday('2017-01-02')) // 2017-01-01 is a Sunday, so Monday is the observed holiday
  t.ok(helpers.isHoliday('2017-12-26')) // 2017-12-25 is a Monday, 2017-12-24 is a Sunday, so Tuesday is the trailing observed holiday
})
