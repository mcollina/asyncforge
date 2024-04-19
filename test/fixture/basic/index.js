'use strict'

const a = require('./a')
const b = require('./b')

const { start } = require('../../../')

start({
  foo: 'bar'
})

module.exports = {
  a,
  b
}
