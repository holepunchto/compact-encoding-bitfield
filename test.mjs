import test from 'brittle'
import c from 'compact-encoding'

import bitfield from './index.js'

test('number', async (t) => {
  const enc = bitfield(4)

  t.alike(c.encode(enc, 0b1), Buffer.from([0b1]))
  t.alike(c.encode(enc, 0b11), Buffer.from([0b11]))
  t.alike(c.encode(enc, 0b1111), Buffer.from([0b1111]))
  t.alike(c.encode(enc, 0b11111), Buffer.from([0b1111]))
})
