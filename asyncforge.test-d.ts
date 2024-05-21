import { expectError, expectType } from "tsd";
import { create, memo } from ".";
import type { Store } from ".";

expectType<() => Store>(create);

const store = create();

expectType<number>(store.run(() => 42));
expectType<void>(store.enterWith());

// memo
const memoNum = memo<number>();
expectType<symbol>(memoNum.key);
expectType<void>(memoNum.set(123));
expectType<number>(memoNum());
expectError<void>(memoNum.set("wrong"));
