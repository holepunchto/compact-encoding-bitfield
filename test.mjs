import util from 'util'
import test from 'brittle'
import c from 'compact-encoding'

import bitfield from './index.js'

for (let n = 1; n <= 53; n++) {
  test(`bitfield(${n})`, async (t) => {
    const i = 2 ** (n - 1) + (n === 1 ? 0 : 1) // Set first and last bit
    const b = toBuffer(i, n)

    t.alike(c.decode(bitfield(n), c.encode(bitfield(n), i)), b, i.toString(2))

    t.alike(c.decode(bitfield(n), c.encode(bitfield(n), b)), b, util.inspect(b))

    t.snapshot(c.encode(bitfield(n), b), 'ABI')

    t.test('uint compatibility', async (t) => {
      t.is(c.decode(c.uint, c.encode(bitfield(n), i)), i, 'encode')

      t.alike(c.decode(bitfield(n), c.encode(c.uint, i)), b, 'decode')
    })
  })
}

function toBuffer(b, length) {
  if (length <= 8) return c.encode(c.uint8, b)
  if (length <= 16) return c.encode(c.uint16, b)
  if (length <= 32) return c.encode(c.uint32, b)
  return c.encode(c.uint64, b)
}
