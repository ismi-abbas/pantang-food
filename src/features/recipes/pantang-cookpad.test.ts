import { describe, expect, it } from 'vitest'

import { attachCookpadMedia, getCookpadInspirations } from './pantang-cookpad'
import type { Recipe } from './recipes.types'

const recipes: Recipe[] = [
  {
    id: 'sup-ayam-halia',
    title: 'Sup Ayam Halia',
    summary: 'Sup halia untuk ibu pantang.',
    category: 'Soup',
    benefit: 'Warming',
    week: 'Week 1',
    prepTime: '35 minit',
    servings: '2 orang',
    heroColor: 'amber',
    ingredients: ['ayam', 'halia'],
    steps: ['Reneh.'],
    pantryTips: ['Hidang panas.'],
    tags: ['halia'],
    featured: true,
  },
  {
    id: 'bubur-nasi-pantang',
    title: 'Bubur Nasi Pantang',
    summary: 'Bubur lembut.',
    category: 'Comfort',
    benefit: 'Easy to digest',
    week: 'Week 1',
    prepTime: '30 minit',
    servings: '2 mangkuk',
    heroColor: 'rose',
    ingredients: ['beras'],
    steps: ['Reneh.'],
    pantryTips: ['Kacau selalu.'],
    tags: ['bubur'],
    featured: false,
  },
]

describe('attachCookpadMedia', () => {
  it('adds scraped Cookpad photography and attribution to mapped recipes', () => {
    expect(attachCookpadMedia(recipes)).toMatchObject([
      {
        id: 'sup-ayam-halia',
        imageUrl: expect.stringContaining('ayam-masak-halia-black-pepper'),
        imageAlt: expect.stringContaining('Ayam Masak Halia Black Pepper'),
        sourceName: 'Cookpad',
        sourceUrl: 'https://cookpad.com/my/search/ibu%20pantang',
      },
      {
        id: 'bubur-nasi-pantang',
        imageUrl: expect.stringContaining('bubur-ayam-bersayur'),
        imageAlt: expect.stringContaining('Bubur Ayam Bersayur'),
      },
    ])
  })
})

describe('getCookpadInspirations', () => {
  it('returns a curated set of scraped ibu pantang inspiration cards', () => {
    expect(getCookpadInspirations(3)).toEqual([
      expect.objectContaining({
        title: 'Daging Masak Lada Hitam, Halia dan Serai (Masakan Ibu Pantang)',
        sourceName: 'Cookpad',
        href: 'https://cookpad.com/my/recipes/24106652',
      }),
      expect.objectContaining({
        title: 'Resipi Berpantang : Tom Yam Ikan Bawal Putih',
        href: 'https://cookpad.com/my/recipes/22579860',
      }),
      expect.objectContaining({
        title: 'Resipi Berpantang : Bubur Ayam Bersayur',
        href: 'https://cookpad.com/my/recipes/22589640',
      }),
    ])
  })
})
