# asyncforge

`asyncforge` allows you to remove singletons from your codebase with the
use of [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage).

It provides helpers to build Next.js-style helpers to access "singletons". 

## Install

```sh
npm i asyncforge
```

## Usage

```js
import { start, forge, memo } from 'asyncforge'

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

const c = memo("myKeyC");
const d = memo("myKeyD");

setAll({
  [c.key]: 42,
  [d.key]: 24,
});

console.log(c(), d()); // 42 24
```

## License

MIT
