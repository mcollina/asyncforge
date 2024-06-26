declare namespace asyncforge {
  interface Store {
    run<T>(fn: () => T) : T;
    enterWith() : void;
  }

  export function create () : Store;

  export function memo<T extends unknown>(
    name?: string
  ): {
    (): T;
    key: symbol;
    set: (value: T) => void;
  };
}

export = asyncforge
