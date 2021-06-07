import type {
  ThrowableErrorConstructorArguments,
  DefaultConstructorGeneratorReturn,
  ThrowableErrorConstructor,
  OmitFromThrowableErrorForExtends
} from './types';

export class ThrowableError<N> extends Error {
  [k: string]: any;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name: N;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  message: string;
}

export type ExtendFromType<N, A extends [] = any> = Omit<  
  typeof ThrowableError,  
  OmitFromThrowableErrorForExtends  
> &  
  ThrowableErrorConstructor<A, ThrowableError<N>>;  

type MapperFunctionType<CGR, A extends [] = any> = (...args: A) => CGR;

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
 * const WebSocketJSONError = getThrowableError<'WebSocketJSONError',ThrowableErrorConstructorArguments & [string, { data: any }]
 *   >('WebSocketJSONError',
 *  (userMessage: string, details?: { originalError?: Error; data?: any }) => ({
 *    userMessage,
 *    originalError: details?.originalError || undefined,
 *    data: details?.data || undefined,
 *  }),
 *  WebSocketError,
 * );
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

export const getThrowableError = <
  N extends string = string,
  A extends ThrowableErrorConstructorArguments = ThrowableErrorConstructorArguments,
  CGR extends DefaultConstructorGeneratorReturn = DefaultConstructorGeneratorReturn,
>(
  name: N,
  mapperFn: MapperFunctionType<CGR>,
  extendFrom: ExtendFromType<any> = ThrowableError,
): ThrowableErrorConstructor<A, ThrowableError<N>> => {
  const e = new extendFrom();
  const Err = Object.create(null);
  Err.name = name;
  Err.stack = e.stack;

  const ErrConstructor = function (
    this: ThrowableError<N>,
    ...args: A
  ): ThrowableError<N> {
    Error.call(this);
    Object.defineProperty(this, 'name', { value: name });

    const cc = mapperFn(...args);
    for (const ck in cc) {
      const keynam: string = ck === 'userMessage' ? 'message' : ck;
      // eslint-disable-next-line security/detect-object-injection
      const v = cc[ck];
      this[keynam] = // eslint-disable-line security/detect-object-injection
        typeof v === 'object' // eslint-disable-line security/detect-object-injection
          ? Array.isArray(v) // eslint-disable-line security/detect-object-injection
            ? Array.from(v) // eslint-disable-line security/detect-object-injection
            : { ...v } // eslint-disable-line security/detect-object-injection
          : v; // eslint-disable-line security/detect-object-injection
    }

    return this;
  };

  Object.setPrototypeOf(ErrConstructor, Object.getPrototypeOf(extendFrom));
  Object.defineProperty(ErrConstructor, 'name', { value: name });
  ErrConstructor.prototype = Object.create(extendFrom.prototype, {
    constructor: {
      value: extendFrom,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  return ErrConstructor as ThrowableErrorConstructor<A, ThrowableError<N>> &
    typeof ErrConstructor;
};
