'use strict'

const { AsyncLocalStorage } = require('node:async_hooks')

const asyncLocalStorage = new AsyncLocalStorage();

function start (config) {
  const store = Object.create(null)
  store.config = config
  asyncLocalStorage.enterWith(store)
}

let forgeCounter = 0
function forge (fn) {
  const sym = Symbol('forge.' + (fn.name || forgeCounter++))
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

let memoCounter = 0
function memo (name) {
  name = name || 'memo' + memoCounter++

  const sym = Symbol('memo.' + name)

  function get () {
    const store = asyncLocalStorage.getStore()
    return store[sym]
  }

  function set (value) {
    let store = asyncLocalStorage.getStore()
    store = Object.create(store)
    store[sym] = value
    asyncLocalStorage.enterWith(store)
  }

  get.set = set

  return get
}

module.exports.start = start
module.exports.forge = forge
module.exports.memo = memo
