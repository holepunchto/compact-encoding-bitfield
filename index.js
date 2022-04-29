const b4a = require('b4a')
const c = require('compact-encoding')

module.exports = function bitfield (length, byteLength = Math.ceil(length / 8)) {
  const encoding = c.fixed(byteLength)

  class Bitfield extends Uint8Array {
    constructor () {
      super(byteLength)
    }

    size () {
      return length
    }

    has (bit) {
      if (bit >= length) throw new RangeError('Index out of range')

      const i = bit >> 3
      const offset = bit & 7

      return (this[i] & (1 << offset)) !== 0
    }

    get (bit) {
      return this.has(bit)
    }

    set (bit, value = true) {
      if (bit >= length) throw new RangeError('Index out of range')

      const i = bit >> 3
      const offset = bit & 7
      const mask = 1 << offset

      if (value) this[i] |= mask
      else this[i] &= ~mask

      return this
    }

    delete (bit) {
      if (bit >= length) throw new RangeError('Index out of range')

      const i = bit >> 3
      const offset = bit & 7
      const mask = 1 << offset

      if ((this[i] & mask) === 0) return false
      this[i] ^= mask
      return true
    }

    clear () {
      for (let i = 0; i < byteLength; i++) this[i] = 0
    }

    * keys () {
      for (const [index] of this) yield index
    }

    * values () {
      for (const [, value] of this) yield value
    }

    * entries () {
      yield this
    }

    forEach (fn) {
      for (const [index, value] of this) fn(value, index, this)
    }

    * [Symbol.iterator] () {
      for (let i = 0; i < length; i++) yield [i, this.has(i)]
    }

    static create () {
      return new this()
    }

    static preencode (state) {
      state.end += byteLength
    }

    static encode (state, b) {
      encoding.encode(state, coerce(b))
    }

    static decode (state) {
      return wrap(encoding.decode(state))
    }
  }

  function wrap (buffer) {
    Object.setPrototypeOf(buffer, Bitfield.prototype)
    return buffer
  }

  function coerce (value) {
    if (typeof value === 'number') {
      if (length > 32) {
        throw new Error(`Cannot coerce number to bitfield of length ${length}`)
      }

      value = value & (1 << length) - 1 // Cut off excess bits

      switch (byteLength) {
        case 1: return b4a.from([value])
        case 2: return b4a.from([value >> 8, value & 0xff])
        case 3: return b4a.from([value >> 16, (value >> 8) & 0xff, value & 0xff])
        case 4: return b4a.from([value >> 24, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff])
      }
    }

    return value
  }

  return Bitfield
}
