const c = require('compact-encoding')

module.exports = function bitfield (length) {
  if (length > 64) throw new RangeError('Bitfield cannot be larger than 64 bits')

  let byteLength
  if (length < 8) byteLength = 1
  else if (length <= 16) byteLength = 2
  else if (length <= 32) byteLength = 4
  else byteLength = 8

  const encoding = c.fixed(byteLength)

  return {
    preencode (state) {
      state.end++ // Length byte

      if (length < 8) ;
      else if (length <= 16) c.uint16.preencode(state)
      else if (length <= 32) c.uint32.preencode(state)
      else c.uint64.preencode(state)
    },

    encode (state, b) {
      if (length < 8) ;
      else if (length <= 16) c.uint8.encode(state, 0xfd)
      else if (length <= 32) c.uint8.encode(state, 0xfe)
      else c.uint8.encode(state, 0xff)

      encoding.encode(state, coerce(b))
    },

    decode (state) {
      const byte = state.buffer[state.start]

      let byteLength
      if (byte <= 0xfc) byteLength = 1
      else if (byte === 0xfd) byteLength = 2
      else if (byte === 0xfe) byteLength = 4
      else byteLength = 8

      if (byteLength > 1) state.start++ // Skip the length byte

      const b = state.buffer.subarray(state.start, (state.start += byteLength))

      return length <= 8 ? b.subarray(0, 1) : b
    }
  }

  function coerce (value) {
    if (typeof value === 'number') {
      if (length <= 8) return c.encode(c.uint8, value)
      if (length <= 16) return c.encode(c.uint16, value)
      if (length <= 32) return c.encode(c.uint32, value)
      return c.encode(c.uint64, value)
    }

    return value
  }
}
