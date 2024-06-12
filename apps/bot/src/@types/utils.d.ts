export type DeepNonNullable<T> = {
  [K in keyof T]: DeepNonNullable<NonNullable<T[K]>>;
};

export type DeepExclude<T, U> = {
  [K in keyof T]: DeepExclude<Exclude<T[K], U>, U>;
};
