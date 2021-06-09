export type ThrowableErrorConstructor<
  A extends readonly unknown[],
  C extends Error = Error,
> = new (...args: A) => C;

export type OmitFromThrowableErrorForExtends =
  | 'captureStackTrace'
  | 'stackTraceLimit';
