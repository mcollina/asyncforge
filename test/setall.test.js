'use strict'

const { test } = require('node:test')
const { start, memo, setAll } = require('../')
const assert = require('node:assert/strict')

test('setAll no start', async (t) => {
  const a = memo()
  const b = memo()
  const c = memo()

  setAll({
    [a.key]: 1,
    [b.key]: 2,
    [c.key]: 3
  })

  assert.equal(a(), 1)
  assert.equal(b(), 2)
  assert.equal(c(), 3)
})

test('setAll memos', async (t) => {
  const a = memo()
  const b = memo()
  const c = memo()

  start()

  setAll({
    [a.key]: 1,
    [b.key]: 2,
    [c.key]: 3
  })

  assert.equal(a(), 1)
  assert.equal(b(), 2)
  assert.equal(c(), 3)
})
