import test from 'brittle'
import c from 'compact-encoding'

import bitfield from './index.js'

test('uint compat', async (t) => {
  t.is(
    c.decode(c.uint,
      // bitfield: fd fc 00
      // uint: fc
      c.encode(bitfield(8), 0b1111_1100)
    ),
    0b1111_1100
  )

  t.is(
    c.decode(c.uint,
      // bitfield, uint: fd fe 00
      c.encode(bitfield(8), 0b1111_1110)
    ),
    0b1111_1110
  )

  t.is(
    c.decode(c.uint,
      // bitfield, uint: fd 33 ff
      c.encode(bitfield(16), 0b1111_1111_0011_0011)
    ),
    0b1111_1111_0011_0011
  )
})
