# compact-encoding-bitfield

[compact-encoding](https://github.com/compact-encoding/compact-encoding) codec for bitfields.

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

## License

ISC
