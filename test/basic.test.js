'use strict'

const { test } = require('node:test')
const assert = require('node:assert/strict')
const { start, forge } = require('../')
const { setImmediate: immediate } = require('node:timers/promises')
const tspl = require('@matteo.collina/tspl')

test('start and forge', async (t) => {
  const { a, b } = require('./fixture/basic')

  assert.deepEqual(a(), { value: 'bar' })
  assert.equal(a(), a())
  assert.deepEqual(b(), {
    fromA: {
      value: 'bar'
    }
  })

  await immediate()

  assert.deepEqual(a(), { value: 'bar' })
})

test('start and forge with different config', async (t) => {
  const p = tspl(t, { plan: 6 })
  const a = forge((config) => {
    return {
      value: config.foo
    }
  })

  start({
    foo: 'bar'
  })

  p.deepEqual(a(), { value: 'bar' })

  setImmediate(() => {
    p.deepStrictEqual(a(), { value: 'bar' })
  })

  queueMicrotask(() => {
    p.deepStrictEqual(a(), { value: 'bar' })
  })

  start({
    foo: 'baz'
  })

  p.deepEqual(a(), { value: 'baz' })

  setImmediate(() => {
    p.deepStrictEqual(a(), { value: 'baz' })
  })

  queueMicrotask(() => {
    p.deepStrictEqual(a(), { value: 'baz' })
  })

  await p.completed
})
