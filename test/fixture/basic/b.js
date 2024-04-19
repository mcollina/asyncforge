'use strict'

const { forge } = require('../../../')
const a = require('./a')

module.exports = forge((config) => {
  return {
    fromA: a()
  }
})
