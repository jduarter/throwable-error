# throwable-error
🧨 Efficient, multi-inheritant, dynamically-generated, Error pseudo-classes with instanceof super-powers.

## Notice

This project is in beta stage, major API modifications and simplifications are very likely to occur on next major releases.

## Install

```
npm install --save throwable-error
```

## Usage

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

This project is compatible with Typescript but can be used both as an ES module or CJS module.

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
