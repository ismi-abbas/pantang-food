import { describe, expect, it } from 'vitest'

import { buildBottomNavItems, createPwaManifest } from './mobile-app'

describe('createPwaManifest', () => {
  it('returns a standalone pantang-food manifest tuned for mobile install', () => {
    expect(createPwaManifest()).toMatchObject({
      name: 'Pantang Food',
      short_name: 'PantangFood',
      display: 'standalone',
      orientation: 'portrait',
      theme_color: '#120f0c',
      background_color: '#120f0c',
    })
  })
})

describe('buildBottomNavItems', () => {
  it('marks the current mobile tab as active', () => {
    expect(buildBottomNavItems('/recipes/sup-ayam-halia')).toEqual([
      { label: 'Browse', href: '/', active: false },
      { label: 'Recipe', href: '/recipes/sup-ayam-halia', active: true },
      { label: 'Install', href: '#install', active: false },
    ])
  })
})
