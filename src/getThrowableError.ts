import type {
  ThrowableErrorConstructor,
  OmitFromThrowableErrorForExtends,
} from './types';

export class ThrowableError extends Error {
  [k: string]: any;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name: string;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  message: string;
}

export type ExtendFromType<
  A extends readonly unknown[] = any[],
  IT extends ThrowableError = ThrowableError,
> =
  | (
      | Omit<typeof ThrowableError, OmitFromThrowableErrorForExtends>
      | ThrowableErrorConstructor<A, ThrowableError>
    ) &
      (new (...args: A) => IT);

type MapperFunctionType<A extends readonly unknown[] = any[]> = (
  ...args: A
) => Record<string, any>;

/**
 * Get an efficient, multi-inheritant, dynamically-generated,
 * Error pseudo-class with instanceof super-powers.
 *
 * @typeParam N - Name for the new Error.
 * @typeParam A - Constructor arguments.
 * @typeParam CGR - Return type of the mapperFn argument.
 *
 * @param name {string} Class name.
 * @param mapperFn {MapperFunctionType} Mapper function for the constructor arguments.
 * @param extendFrom {class} Class to extend from. Defaults to `ThrowableError`.
 *
 * @returns The new Error pseudo-class.
 *
 * @example
 *
 * Simple example:
 *
 * ```javascript
 * const WebSocketError = getThrowableError('WebSocketError',
 *   (userMessage: string, details?: { originalError?: Error }) => ({
 *     userMessage,
 *     originalError: details?.originalError || undefined,
 *   }),
 * );
 * ```
 *
 * Inheritant example:
 *
 * ```javascript
 * type ErrConstrArgs = [string, { data: any }];
 *
 * const WebSocketJSONError = getThrowableError<ErrConstrArgs>('WebSocketJSONError', {
 *   mapperFn: (userMessage: string, details?: { originalError?: Error; data?: any }) => ({
 *      userMessage,
 *      originalError: details?.originalError || undefined,
 *      data: details?.data || undefined,
 *    }),
 *  extendFrom: WebSocketError
 * });
 * ```
 *
 *
 * Throwing these errors is straightforward
 *
 * ```javascript
 * throw new WebSocketError('Unable to connect');
 *
 * throw new WebSocketError('Unable to connect', {
 *   originalError: new Error('test')
 * });
 *
 * throw new WebSocketJSONError('Unable to parse content');
 *
 * throw new WebSocketJSONError('Unable to parse content', { originalError: new Error('test') });
 *
 * throw new WebSocketJSONError('Unable to parse content', {
 *   data: '1234errorjsoncontent',
 *   originalError: new Error('test')
 * });
 * ```
 *
 * Instanceof properties:
 *
 * ```javascript
 * import {ThrowableError} from 'throwable-error';
 *
 * const testErr = new WebSocketJSONError('test');
 *
 * console.log(testErr instanceof WebSocketJSONError); # true
 * console.log(testErr instanceof WebSocketError); # true
 * console.log(testErr instanceof ThrowableError); # true
 * ```
 *
 */

const RESTRICTED_OBJ_KEY_NAMES: string[] = [
  'prototype',
  '__proto__',
  'toString',
  'constructor',
];

interface ThrowableErrorOptions<A extends readonly unknown[]> {
  extendFrom?: ExtendFromType<any>;
  mapperFn?: MapperFunctionType<A>;
}

type DefaultConstructorArgs = [string];

const DEFAULT_MAPPER_FN: MapperFunctionType<DefaultConstructorArgs> = (
  message: string,
) => ({
  message,
});

export const getThrowableError = <
  A extends readonly any[] = DefaultConstructorArgs,
>(
  name: string,
  options: ThrowableErrorOptions<A> = {},
) => {
  const { extendFrom, mapperFn = DEFAULT_MAPPER_FN } = options;

  const ParentClass = extendFrom ? extendFrom : ThrowableError;

  const e = new ParentClass();
  const Err = Object.create(null);
  Err.name = name;
  Err.stack = e.stack;

  const ErrConstructor = function (this: ThrowableError, ...args: A) {
    Error.call(this);
    Object.defineProperty(this, 'name', { value: name });

    const instanceObjKeys = mapperFn(...args);
    for (const keyName in instanceObjKeys) {
      if (RESTRICTED_OBJ_KEY_NAMES.indexOf(keyName) > -1) {
        // prevents possible reserved key names in
        // the instance currently being constructed.
        continue;
      }

      const v = instanceObjKeys[keyName];
      this[keyName] =
        typeof v === 'object' ? (Array.isArray(v) ? [...v] : { ...v }) : v;
    }

    return this;
  };

  Object.setPrototypeOf(ErrConstructor, Object.getPrototypeOf(ParentClass));
  Object.defineProperty(ErrConstructor, 'name', { value: name });

  ErrConstructor.prototype = Object.create(ParentClass.prototype, {
    constructor: {
      value: ParentClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });

  return ErrConstructor as typeof ErrConstructor &
    (new (...args: A) => ThrowableError);
};
