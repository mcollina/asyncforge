import { create, memo } from './asyncforge.js'

const a = memo()
const b = memo()

const store = create()

store.run(() => {
  a.set(42)
  b.set(123)

  // simulate an event loop turn
  setImmediate(() => {
    console.log('-- first event loop turn --')
    console.log('a', a())
    console.log('b', b())
  })
})

create(() => {
  a.set(43)
  b.set(321)

  // simulate an event loop turn
  setImmediate(() => {
    console.log('-- second event loop turn --')
    console.log('a', a())
    console.log('b', b())

    store.run(() => {
      setImmediate(() => {
        console.log('-- third event loop turn --')
        console.log('a', a())
        console.log('b', b())
      })
    })
  })
})
