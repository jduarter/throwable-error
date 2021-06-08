# throwable-error

[![NPM](https://img.shields.io/npm/v/throwable-error)](https://github.com/jduarter/throwable-error)

🧨 Efficient, multi-inheritant, dynamically-generated, Error pseudo-classes with instanceof super-powers.

This project is written in Typescript but can be used both as an ES module or CJS module.

The API is still very complex and needs to be simplified, but it's effectively working for my purposes.

## Notice

This project is in beta stage, major API modifications and simplifications are very likely to occur on next major releases.

## Install

```
npm install --save throwable-error
```

## Usage

### Main concept.

- Errors are generally defined in the main scope of the application.
- You can use the `getThrowableError` method to generate a pseudo-class by providing an `errorName` and a `mapperFunction`.
- The `mapperFunction` basically receives the new Error constructor arguments and returns them with the proper internal object structure the Error will have: The "inner" constructor of this library will incorporate returned values as properties in the new generated Error pseudo-class.

### getThrowableError

▸ `Function` **getThrowableError**<N, A, CGR\>(`name`, `mapperFn`, `extendFrom?`)

Get an efficient, multi-inheritant, dynamically-generated, Error pseudo-class with instanceof super-powers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `N` | Class name. |
| `mapperFn` | `MapperFunctionType`<CGR, any\> | Mapper function for the constructor arguments. |
| `extendFrom` | `ExtendFromType`<any, any\> | Class to extend from. |

#### Returns

The new Error pseudo-class with type `ThrowableErrorConstructor<A, ThrowableError<N>>`

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `N` | `N`: `string` = `string` | Name for the new Error. |
| `A` | `A`: `ThrowableErrorConstructorArguments` = `ThrowableErrorConstructorArguments` | Constructor arguments. |
| `CGR` | `CGR`: `DefaultConstructorGeneratorReturn` = `DefaultConstructorGeneratorReturn` | Return type of the mapperFn argument. |

#### Examples

Note: The `ThrowableErrorConstructorArguments` type already includes the `originalError` property on its declaration.

Simple example:

```javascript
const WebSocketError = getThrowableError('WebSocketError',
  (userMessage: string, details?: { originalError?: Error }) => ({
    userMessage,
    originalError: details?.originalError || undefined,
  }),
);
```

Inheritant example (new error extending from `WebSocketError` in previous example:

```javascript
const WebSocketJSONError = getThrowableError<
  'WebSocketJSONError',
  ThrowableErrorConstructorArguments & [string, { data: any }]
  >(
    'WebSocketJSONError',
    (userMessage: string, details?: { originalError?: Error; data?: any }) => ({
      userMessage,
      originalError: details?.originalError || undefined,
      data: details?.data || undefined,
    }),
   WebSocketError,
  );
```

Throwing these errors is straightforward

```javascript
throw new WebSocketError('Unable to connect');

throw new WebSocketError('Unable to connect', {
  originalError: new Error('test')
});

throw new WebSocketJSONError('Unable to parse content');

throw new WebSocketJSONError('Unable to parse content', { originalError: new Error('test') });

throw new WebSocketJSONError('Unable to parse content', {
  data: '1234errorjsoncontent',
  originalError: new Error('test')
});
```

Instanceof properties:

```javascript
import {ThrowableError} from 'throwable-error';

const testErr = new WebSocketJSONError('test');

console.log(testErr instanceof WebSocketJSONError); # true
console.log(testErr instanceof WebSocketError); # true
console.log(testErr instanceof ThrowableError); # true
```
