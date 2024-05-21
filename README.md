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
import { create, memo } from 'asyncforge.js'

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
```

## TypeScript

You can call the `asyncforge` functions in a type-safe way:

```ts
import { start, memo, setAll } from "asyncforge";
const memoNum = memo<number>();

// This is okay for TypeScript, since you're passing a number
memoNum.set(123);

// This will not build
memoNum.set('wrong');

// The `result` var will be of type `number`
const result = memoNum()

const test = memo<string>();

// This is correct, since `test.key` is a `symbol`
setAll({ [test.key]: 42 });

// This will fail
setAll({ 'wrong': 42 });
```

## License

MIT
