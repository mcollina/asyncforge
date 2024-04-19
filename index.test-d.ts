import { expectAssignable, expectError, expectType } from "tsd";
import { start, forge, memo, setAll } from ".";

// start
const config = 42;
expectType<void>(start<number>(config));
expectError<void>(start<string>(config));
expectType<void>(start<{ valid: boolean }>({ valid: true }));

const validStart = (_: unknown) => console.log("this is valid");
expectAssignable<typeof start>(validStart);

const invalidStart = (_: string) => "this is invalid";
expectError<typeof start>(invalidStart);

// forge
const forgeObject = forge(() => ({ foo: "bar" }));
expectType<{ foo: string }>(forgeObject());
expectError<{ foo: boolean }>(forgeObject());

const forgeString = forge(() => "");
expectType<string>(forgeString());
expectError<boolean>(forgeString());

type TestData = { baz: string; foo: string };
const getFoo = forge<TestData>((config) => {
  return {
    data: config.baz,
    value: config.foo,
  };
});
expectType<unknown>(getFoo());

const getFooString = forge<TestData, string>((config) => {
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
