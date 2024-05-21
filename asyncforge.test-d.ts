import { expectError, expectType } from "tsd";
import { start, memo, setAll } from ".";

expectType<() => void>(start);

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
