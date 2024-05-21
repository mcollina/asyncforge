'use strict'

const { test } = require('node:test')
const { create, memo } = require('../')
const tspl = require('@matteo.collina/tspl')
const assert = require('node:assert')

test('memo', async (t) => {
  const p = tspl(t, { plan: 8 })
  const a = memo()

  p.throws(a, /asyncforge store has not been created/)
  p.throws(() => a.set('foo'), /asyncforge store has not been created/)

  create().run(() => {
    p.deepStrictEqual(a(), undefined)
    a.set({ value: 'bar' })
    p.deepStrictEqual(a(), { value: 'bar' })

    setImmediate(() => {
      p.deepStrictEqual(a(), { value: 'bar' })
    })

    queueMicrotask(() => {
      p.deepStrictEqual(a(), { value: 'bar' })
    })
  })

  create(() => {
    p.deepStrictEqual(a(), undefined)
    a.set({ value: 'baz' })

    p.deepEqual(a(), { value: 'baz' })

    setImmediate(() => {
      p.deepStrictEqual(a(), { value: 'baz' })
    })

    queueMicrotask(() => {
      p.deepStrictEqual(a(), { value: 'baz' })
    })
  })

  await p.completed
})

test('overriding the store should throw', (t) => {
  const a = memo()
  create().run(() => {
    a.set({ value: 'bar' })
    assert.throws(() => {
      a.set({ value: 'baz' })
    }, /asyncforge store already initialized for memo\d+/)
  })
})

test('restarted', async (t) => {
  const p = tspl(t, { plan: 5 })
  const a = memo()

  create().run(() => {
    p.deepStrictEqual(a(), undefined)
    a.set({ value: 'bar' })
    p.deepStrictEqual(a(), { value: 'bar' })

    setImmediate(() => {
      p.deepStrictEqual(a(), { value: 'bar' })
    })
  })

  create().run(() => {
    p.deepStrictEqual(a(), undefined)

    setImmediate(() => {
      p.deepStrictEqual(a(), undefined)
    })
  })

  await p.completed
})

test('run multiple times', async (t) => {
  const p = tspl(t, { plan: 7 })
  const a = memo()

  p.throws(a, /asyncforge store has not been created/)

  const store = create()

  store.run(() => {
    p.deepStrictEqual(a(), undefined)
    a.set({ value: 'bar' })
    p.deepStrictEqual(a(), { value: 'bar' })

    setImmediate(() => {
      p.deepStrictEqual(a(), { value: 'bar' })
    })

    queueMicrotask(() => {
      p.deepStrictEqual(a(), { value: 'bar' })
    })
  })

  store.run(() => {
    p.deepStrictEqual(a(), { value: 'bar' })
    p.throws(() => a.set({ value: 'baz' }), /asyncforge store already initialized for memo\d+/)

    setImmediate(() => {
      p.deepStrictEqual(a(), { value: 'bar' })
    })

    queueMicrotask(() => {
      p.deepStrictEqual(a(), { value: 'bar' })
    })
  })

  await p.completed
})

test('enterWith', async (t) => {
  const p = tspl(t, { plan: 5 })
  const a = memo()

  p.throws(a, /asyncforge store has not been created/)
  p.throws(() => a.set('foo'), /asyncforge store has not been created/)

  create().enterWith()

  p.deepStrictEqual(a(), undefined)
  a.set({ value: 'bar' })
  p.deepStrictEqual(a(), { value: 'bar' })

  setImmediate(() => {
    p.deepStrictEqual(a(), { value: 'bar' })
  })

  queueMicrotask(() => {
    p.deepStrictEqual(a(), { value: 'bar' })
  })

  await p.completed
})
