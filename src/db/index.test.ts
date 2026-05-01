import { describe, expect, it } from 'vitest'

import { getDatabaseRuntimeMode } from './index'

describe('getDatabaseRuntimeMode', () => {
  it('prefers d1 when a Cloudflare binding is present', () => {
    expect(getDatabaseRuntimeMode({ d1BindingName: 'DB', hasD1Binding: true, databaseUrl: '' })).toBe('d1')
  })

  it('uses libsql for remote Turso urls when no d1 binding exists', () => {
    expect(getDatabaseRuntimeMode({ d1BindingName: 'DB', hasD1Binding: false, databaseUrl: 'libsql://pantang-food.turso.io' })).toBe('libsql')
  })

  it('falls back to memory for local file or missing urls without d1', () => {
    expect(getDatabaseRuntimeMode({ d1BindingName: 'DB', hasD1Binding: false, databaseUrl: 'file:./local.db' })).toBe('memory')
    expect(getDatabaseRuntimeMode({ d1BindingName: 'DB', hasD1Binding: false, databaseUrl: '' })).toBe('memory')
  })
})
