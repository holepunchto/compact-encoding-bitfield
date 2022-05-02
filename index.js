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
      const a = state.buffer[state.start]

      let b
      if (a <= 0xfc) b = 1
      else if (a === 0xfd) b = 2
      else if (a === 0xfe) b = 4
      else b = 8

      if (b > 1) state.start++ // Skip the length byte

      return state.buffer.subarray(state.start, (state.start += b))
    }
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
}
