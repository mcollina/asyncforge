'use strict'

const { forge } = require('../../../')

module.exports = forge((config) => {
  return {
    value: config?.foo
  }
})
