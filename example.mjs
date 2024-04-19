import { start, forge, memo } from './asyncforge.js'

const a = forge((config) => {
  return {
    value: config.foo
  }
})

const b = memo()

start({ foo: 'bar' })
b.set(123)

// simulate an event loop turn
setImmediate(() => {
  console.log('-- first event loop turn --')
  console.log('a', a())
  console.log('b', b())

  b.set(456)
  setImmediate(() => {
    console.log('-- third event loop turn --')
    console.log('a', a())
    console.log('b', b())
  })
})

start({ foo: 'baz' })
b.set(321)

// simulate an event loop turn
setImmediate(() => {
  console.log('-- second event loop turn --')
  console.log('a', a())
  console.log('b', b())
})
