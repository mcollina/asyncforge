'use strict'

const { test } = require('node:test')
const { start, memo } = require('../')
const tspl = require('@matteo.collina/tspl')

test('memo without start', async (t) => {
  const p = tspl(t, { plan: 6 })
  const a = memo()

  p.throws(() => a(), { message: 'asyncforge store is not initialized for memo0' })
  a.set({ value: 'bar' })
  p.deepStrictEqual(a(), { value: 'bar' })

  setImmediate(() => {
    p.deepStrictEqual(a(), { value: 'bar' })
  })

  queueMicrotask(() => {
    p.deepStrictEqual(a(), { value: 'bar' })
  })

  start()

  p.deepStrictEqual(a(), undefined)
  a.set({ value: 'baz' })

  p.deepEqual(a(), { value: 'baz' })

  setImmediate(() => {
    p.deepStrictEqual(a(), { value: 'baz' })
  })

  queueMicrotask(() => {
    p.deepStrictEqual(a(), { value: 'baz' })
  })

  await p.completed
})

test('nested', async (t) => {
  const p = tspl(t, { plan: 5 })
  const a = memo()

  p.throws(() => a(), { message: 'asyncforge store is not initialized for memo1' })
  a.set({ value: 'bar' })
  p.deepStrictEqual(a(), { value: 'bar' })

  setImmediate(() => {
    p.deepStrictEqual(a(), { value: 'bar' })

    a.set({ value: 'baz' })

    setImmediate(() => {
      p.deepStrictEqual(a(), { value: 'baz' })
    })
  })

  setImmediate(() => {
    p.deepStrictEqual(a(), { value: 'bar' })
  })

  await p.completed
})
