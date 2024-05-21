'use strict'

const { AsyncLocalStorage } = require('node:async_hooks')

const asyncLocalStorage = new AsyncLocalStorage()

class Store {
  #internal

  constructor (internal) {
    this.#internal = internal
  }

  run (fn) {
    return asyncLocalStorage.run(this.#internal, fn)
  }
}

function create (fn) {
  const store = new Store(Object.create(null))
  if (fn) {
    store.run(fn)
  }
  return store
}

let memoCounter = 0
function memo (name) {
  name = name || 'memo' + memoCounter++

  const sym = Symbol('memo.' + name)

  function get () {
    const store = asyncLocalStorage.getStore()
    if (!store) {
      throw new Error('asyncforge store has not been created')
    }
    return store[sym]
  }

  function set (value) {
    const store = asyncLocalStorage.getStore()
    if (!store) {
      throw new Error('asyncforge store has not been created')
    }
    if (Object.hasOwnProperty.call(store, sym)) {
      throw new Error(`asyncforge store already initialized for ${name}`)
    }
    store[sym] = value
  }

  get.set = set
  get.key = sym

  return get
}

module.exports.create = create
module.exports.memo = memo
