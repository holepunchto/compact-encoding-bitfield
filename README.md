# compact-encoding-bitfield

[compact-encoding](https://github.com/compact-encoding/compact-encoding) codec for bitfields. Uses a variable length encoding that is ABI compatible with `cenc.uint`.

```sh
npm install compact-encoding-bitfield
```

## Usage

```js
const cenc = require('compact-encoding')
const bitfield = require('compact-encoding-bitfield')

const buffer = cenc.encode(bitfield(4), 0b1011)

cenc.decode(bitfield(4), buffer)
// <Bitfield 0b1011>
```

## API

#### `const Bitfield = bitfield(length)`

Create a codec for a bitfield of `length` bits.

#### `const b = new Bitfield()`

Create a new bitfield. Its API matches that of [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) with keys being bit indices and values being booleans (set/unset) of the corresponding bits.

#### `const b = Bitfield.create()`

Alias of `new Bitfield()`.

#### `b.size`

The size of the bitfield. Will always equal `length`.

#### `b.has(bit)`

Check if `bit` is set.

#### `b.get(bit)`

Alias of `b.has(bit)`.

#### `b.set(bit[, value])`

Set `bit` to `1`. If `value` is falsy, `bit` will be set to `0`.

#### `b.delete(bit)`

Set `bit` to `0`.

#### `b.clear()`

Unset all bits.

#### `b.keys()`

Return an iterator over the indices of the bitfield.

#### `b.values()`

Return an iterator over the values of the bitfield.

#### `b.entries()`

Return an iterator over the `[index, value]` entries of the bitfield.

#### `b.forEach(function (value, index, b) {})`

Invoke a callback for each entry of the bitfield.

#### `for (const [index, value] of b)`

Iterate over the entries of the bitfield

## ABI

The bitfield is stored as a possibly length-prefixed sequence of bytes. For each byte, the least significant digit denotes the first bit and the most significant digit denotes the last bit. For example, bit `0` will be the least significant digit of the first byte and bit `15` will be the most significant digit of the second byte.

Depending on `length`, the bitfield is stored using a variable number of possibly length-prefixed bytes:

1. `length < 8`: 1 byte with no prefix.
2. `length <= 16`: 2 bytes with a `0xfd` prefix.
3. `length <= 32`: 4 bytes with a `0xfe` prefix.
4. `length <= 64`: 8 bytes with a `0xff` prefix.

`length` must not exceed 64 bits.

## License

ISC
