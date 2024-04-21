import { expectError, expectType } from "tsd";
import { start, forge, memo, setAll } from ".";

declare module "." {
  interface AsyncForgeConfig {
    foo: string;
    baz: number;
  }
}

// start
expectType<void>(start({ foo: "bar", baz: 42 }));
expectType<void>(start({ baz: 24, foo: "xyz" }));
expectError<void>(start({}));
expectError<void>(start({ foo: false, baz: 42 }));

// forge
const forgeObject = forge(() => ({ something: "else" }));
expectType<{ something: string }>(forgeObject());
expectError<{ something: boolean }>(forgeObject());

const forgeString = forge(() => "");
expectType<string>(forgeString());
expectError<boolean>(forgeString());

const remapForge = forge(({ baz: data, foo: value }) => ({ data, value }));
expectType<{ data: number; value: string }>(remapForge());
expectType<() => void>(forge((config) => console.log(config.baz)));
expectError<() => void>(forge((config) => config.invalid));

const getFooString = forge((config) => {
  return config.baz + config.foo;
});
expectType<string>(getFooString());

// memo
const memoNum = memo<number>();
expectType<symbol>(memoNum.key);
expectType<void>(memoNum.set(123));
expectType<number>(memoNum());
expectError<void>(memoNum.set("wrong"));

// setAll
const test = memo<string>();
expectType<void>(setAll({ [test.key]: 42 }));
expectError<void>(setAll({ wrong: 42 }));
