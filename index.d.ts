type ForgeCallback<T, U> = {
  (config: T): U;
  name?: string;
};

export function start<T extends unknown>(config: T): void;
export function forge<T extends unknown, U extends unknown = unknown>(
  fn: ForgeCallback<T, U>
): () => ReturnType<ForgeCallback<T, U>>;
export function memo<T extends unknown>(
  name?: string
): {
  (): T;
  key: symbol;
  set: (value: T) => void;
};
export function setAll(memos: Record<symbol, unknown>): void;
