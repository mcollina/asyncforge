'use strict'

const { AsyncLocalStorage } = require('node:async_hooks')

const asyncLocalStorage = new AsyncLocalStorage()

function start (config) {
  const store = Object.create(null)
  store.config = config
  asyncLocalStorage.enterWith(store)
}

let forgeCounter = 0
function forge (fn) {
  const sym = Symbol('forge.' + (fn.name || forgeCounter++))
  return function () {
    let store = asyncLocalStorage.getStore()
    if (!store) {
      store = Object.create(null)
      asyncLocalStorage.enterWith(store)
    }
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
    return store?.[sym]
  }

  function set (value) {
    let store = asyncLocalStorage.getStore()
    store = Object.create(store || null)
    store[sym] = value
    asyncLocalStorage.enterWith(store)
  }

  get.set = set
  get.key = sym

  return get
}

function setAll (memos) {
  let store = asyncLocalStorage.getStore()
  store = Object.create(store)
  const keys = Object.getOwnPropertySymbols(memos)
  for (const key of keys) {
    store[key] = memos[key]
  }
  asyncLocalStorage.enterWith(store)
}

module.exports.start = start
module.exports.forge = forge
module.exports.memo = memo
module.exports.setAll = setAll
