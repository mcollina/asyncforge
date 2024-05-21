declare namespace asyncforge {
  export function start(): void;
  export function memo<T extends unknown>(
    name?: string
  ): {
    (): T;
    key: symbol;
    set: (value: T) => void;
  };
  export function setAll(memos: Record<symbol, unknown>): void;
}

export = asyncforge
