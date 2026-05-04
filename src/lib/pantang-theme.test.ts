import { describe, expect, it } from 'vitest'

import { contrastRatio, pantangTheme } from './pantang-theme'

describe('pantangTheme contrast', () => {
  it('uses the impeccable-inspired parchment palette', () => {
    expect(pantangTheme).toEqual({
      bg: '#f5f4ed',
      warm: '#e8e6dc',
      deep: '#dcd8ca',
      ink: '#141413',
      soft: '#5e5d59',
      muted: '#4d4c48',
      line: '#f0eee6',
      lineSoft: '#e8e6dc',
      cream: '#faf9f5',
      terra: '#c96442',
      terraDeep: '#7a4a2b',
    })
  })

  it('keeps secondary body text readable on the main light surfaces', () => {
    expect(contrastRatio(pantangTheme.muted, pantangTheme.bg)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(pantangTheme.muted, pantangTheme.warm)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(pantangTheme.muted, pantangTheme.deep)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps terracotta accent labels readable on dark ink backgrounds', () => {
    expect(contrastRatio(pantangTheme.terra, pantangTheme.ink)).toBeGreaterThanOrEqual(4.5)
  })
})
