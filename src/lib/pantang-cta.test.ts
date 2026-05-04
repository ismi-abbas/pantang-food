import { describe, expect, it } from 'vitest'

import { getPantangPrimaryCtaStyle } from './pantang-cta'

describe('getPantangPrimaryCtaStyle', () => {
  it('uses cream text on ink background for strong button contrast', () => {
    expect(getPantangPrimaryCtaStyle()).toEqual({
      backgroundColor: 'var(--pantang-ink)',
      color: 'var(--pantang-cream)',
    })
  })
})
