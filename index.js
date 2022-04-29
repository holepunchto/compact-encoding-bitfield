const c = require('compact-encoding')

module.exports = function bitfield (length) {
  let byteLength
  if (length < 8) byteLength = 1
  else if (length <= 16) byteLength = 2
  else if (length <= 32) byteLength = 4
  else byteLength = 8

  const encoding = c.fixed(byteLength)

  class Bitfield extends Uint8Array {
    constructor () {
      super(byteLength)
    }

    get size () {
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
      state.end++ // Length byte

      if (length < 8) ;
      else if (length <= 16) c.uint16.preencode(state)
      else if (length <= 32) c.uint32.preencode(state)
      else c.uint64.preencode(state)
    }

    static encode (state, b) {
      if (length < 8) ;
      else if (length <= 16) c.uint8.encode(state, 0xfd)
      else if (length <= 32) c.uint8.encode(state, 0xfe)
      else c.uint8.encode(state, 0xff)

      encoding.encode(state, coerce(b))
    }

    static decode (state) {
      const a = state.buffer[state.start]

      let b
      if (a <= 0xfc) b = 1
      else if (a === 0xfd) b = 2
      else if (a === 0xfe) b = 4
      else b = 8

      if (b > 1) state.start++ // Skip the length byte

      return wrap(state.buffer.subarray(state.start, (state.start += b)))
    }
  }

  function wrap (buffer) {
    Object.setPrototypeOf(buffer, Bitfield.prototype)
    return buffer
  }

  function coerce (value) {
    if (typeof value === 'number') {
      switch (byteLength) {
        case 1: return c.encode(c.uint8, value)
        case 2: return c.encode(c.uint16, value)
        case 4: return c.encode(c.uint32, value)
        case 8: return c.encode(c.uint64, value)
      }
    }

    return value
  }

  return Bitfield
}
