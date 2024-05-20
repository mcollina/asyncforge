declare namespace asyncforge {
  interface AsyncForgeConfig {}

  type ForgeCallback<T> = {
    (config: AsyncForgeConfig): T;
    name?: string;
  };

  export function start(config: AsyncForgeConfig): void;
  export function forge<T extends unknown>(
    fn: ForgeCallback<T>
  ): () => ReturnType<ForgeCallback<T>>;
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
