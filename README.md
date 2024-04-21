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

## TypeScript

You can call the `asyncforge` functions in a type-safe way:

```ts
// You can define the `AsyncForgeConfig` interface so that `start` and `forge` can use it (TS module augmentation)
declare module "asyncforge" {
  interface AsyncForgeConfig {
    foo: string;
    baz: number;
  }
}

// This is correct
start({ foo: "bar", baz: 42 })

// TypeScript will complain, since it's not following the definition of AsyncForgeConfig
start({ wrong: true })

// Valid
forge(({ baz: data, foo: value }) => ({ data, value }));

// Invalid
forge(({ invalid }) => ({ invalid }));

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
