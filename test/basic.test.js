'use strict'

const { test } = require('node:test')
const assert = require('node:assert/strict')
const { start, forge } = require('../')
const { setImmediate: immediate } = require('node:timers/promises')
const tspl = require('@matteo.collina/tspl')

test('forge', async (t) => {
  const { a, b } = require('./fixture/basic')

  assert.deepEqual(a(), { value: undefined })
  assert.equal(a(), a())
  assert.deepEqual(b(), {
    fromA: {
      value: undefined
    }
  })
})

test('start and forge', async (t) => {
  const { a, b } = require('./fixture/basic')

  start({
    foo: 'bar'
  })

  assert.deepEqual(a(), { value: 'bar' })
  assert.equal(a(), a())
  assert.deepEqual(b(), {
    fromA: {
      value: 'bar'
    }
  })

  await immediate()

  assert.deepEqual(a(), { value: 'bar' })

  start({
    foo: 'baz'
  })

  assert.deepEqual(a(), { value: 'baz' })
  assert.equal(a(), a())
  assert.deepEqual(b(), {
    fromA: {
      value: 'baz'
    }
  })

  await immediate()

  assert.deepEqual(a(), { value: 'baz' })
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
