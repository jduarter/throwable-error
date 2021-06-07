# throwable-error
🧨 Efficient, multi-inheritant, dynamically-generated, Error pseudo-classes with instanceof super-powers.


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
