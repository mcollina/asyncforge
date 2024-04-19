'use strict'

const { AsyncLocalStorage } = require('node:async_hooks')

const asyncLocalStorage = new AsyncLocalStorage();

function start (config) {
  const store = {
    config
  }
  asyncLocalStorage.enterWith(store)
}

function forge (fn) {
  const sym = Symbol('forge.' + (fn.name || 'anonymous'))
  return function () {
    const store = asyncLocalStorage.getStore()
    if (store[sym]) {
      return store[sym]
    }
    const res = fn(store.config)
    store[sym] = res
    return res
  }
}

module.exports.start = start
module.exports.forge = forge
