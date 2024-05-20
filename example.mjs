import { memo } from './asyncforge.js'

const a = memo()
const b = memo()

a.set(42)
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

a.set(43)
b.set(321)

// simulate an event loop turn
setImmediate(() => {
  console.log('-- second event loop turn --')
  console.log('a', a())
  console.log('b', b())
})
