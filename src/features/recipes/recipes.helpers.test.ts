import { describe, expect, it } from 'vitest'

import type { Recipe } from './recipes.types'
import {
  buildRecoveryTimeline,
  buildShoppingList,
  filterRecipes,
  getTopPantryItems,
  normalizeRecipeInput,
  slugifyRecipeId,
  splitLines,
} from './recipes.helpers'

const recipes: Recipe[] = [
  {
    id: 'sup-ayam-halia',
    title: 'Sup Ayam Halia',
    summary: 'Sup hangat berempah lembut.',
    category: 'Soup',
    benefit: 'Warming',
    week: 'Week 1',
    prepTime: '35 minit',
    servings: '2 orang',
    heroColor: 'amber',
    ingredients: ['300g ayam', '2 inci halia', '700ml air'],
    steps: ['Rebus semua bahan.'],
    pantryTips: ['Hidang panas.'],
    tags: ['berkuah'],
    featured: true,
  },
  {
    id: 'bubur-nasi-pantang',
    title: 'Bubur Nasi Pantang',
    summary: 'Bubur lembut mudah dihadam.',
    category: 'Comfort',
    benefit: 'Easy to digest',
    week: 'Week 1',
    prepTime: '30 minit',
    servings: '2 mangkuk',
    heroColor: 'rose',
    ingredients: ['1/2 cawan beras', '300g ayam', '2 inci halia'],
    steps: ['Reneh hingga lembut.'],
    pantryTips: ['Tambah stok ayam.'],
    tags: ['lembut'],
    featured: false,
  },
  {
    id: 'teh-kurma-halia',
    title: 'Teh Kurma Halia',
    summary: 'Minuman hangat untuk sokongan susu.',
    category: 'Herbal',
    benefit: 'Milk support',
    week: 'Week 2',
    prepTime: '15 minit',
    servings: '2 cawan',
    heroColor: 'orange',
    ingredients: ['4 biji kurma', '2 inci halia'],
    steps: ['Rebus dan tapis.'],
    pantryTips: ['Minum suam.'],
    tags: ['minuman'],
    featured: true,
  },
]

describe('slugifyRecipeId', () => {
  it('creates a stable kebab-case id from a title', () => {
    expect(slugifyRecipeId('Rendang Ayam Untuk Ibu!')).toBe('rendang-ayam-untuk-ibu')
  })
})

describe('filterRecipes', () => {
  it('filters by query, category, benefit, and week', () => {
    expect(filterRecipes(recipes, {
      query: 'halia',
      category: 'All',
      benefit: 'All',
      week: 'Week 2',
    })).toEqual([recipes[2]])
  })

  it('returns all recipes when filters are empty', () => {
    expect(filterRecipes(recipes, {
      query: '',
      category: 'All',
      benefit: 'All',
      week: 'All',
    })).toHaveLength(3)
  })
})

describe('buildShoppingList', () => {
  it('returns unique ingredients from selected recipe ids in order', () => {
    expect(buildShoppingList(recipes, ['sup-ayam-halia', 'bubur-nasi-pantang'])).toEqual([
      '300g ayam',
      '2 inci halia',
      '700ml air',
      '1/2 cawan beras',
    ])
  })
})

describe('splitLines', () => {
  it('trims blank lines from textarea content', () => {
    expect(splitLines('  ayam  \n\n halia \n  ')).toEqual(['ayam', 'halia'])
  })
})

describe('normalizeRecipeInput', () => {
  it('trims fields and removes empty list items', () => {
    expect(
      normalizeRecipeInput({
        title: '  Sup Ikan Merah  ',
        summary: '  Ringkas dan segar  ',
        category: 'Seafood',
        benefit: 'Light',
        week: 'Week 2',
        prepTime: ' 20 minit ',
        servings: ' 2 orang ',
        ingredients: [' ikan merah ', ' ', ' halia '],
        steps: [' rebus kuah ', '', ' masuk ikan '],
        pantryTips: [' ', ' guna api perlahan '],
        tags: [' lauk ', ' ', ' ringan '],
      }),
    ).toEqual({
      title: 'Sup Ikan Merah',
      summary: 'Ringkas dan segar',
      category: 'Seafood',
      benefit: 'Light',
      week: 'Week 2',
      prepTime: '20 minit',
      servings: '2 orang',
      ingredients: ['ikan merah', 'halia'],
      steps: ['rebus kuah', 'masuk ikan'],
      pantryTips: ['guna api perlahan'],
      tags: ['lauk', 'ringan'],
    })
  })
})

describe('buildRecoveryTimeline', () => {
  it('groups recipes by week with counts and featured titles', () => {
    expect(buildRecoveryTimeline(recipes)).toEqual([
      { week: 'Week 1', total: 2, featuredTitles: ['Sup Ayam Halia'] },
      { week: 'Week 2', total: 1, featuredTitles: ['Teh Kurma Halia'] },
      { week: 'Week 3+', total: 0, featuredTitles: [] },
    ])
  })
})

describe('getTopPantryItems', () => {
  it('counts the most repeated pantry ingredients across recipes', () => {
    expect(getTopPantryItems(recipes, 3)).toEqual([
      { ingredient: '2 inci halia', count: 3 },
      { ingredient: '300g ayam', count: 2 },
      { ingredient: '1/2 cawan beras', count: 1 },
    ])
  })
})
