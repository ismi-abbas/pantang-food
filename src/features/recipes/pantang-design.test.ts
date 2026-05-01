import { describe, expect, it } from 'vitest'

import type { Recipe } from './recipes.types'
import {
  buildPantangCalendar,
  buildPantangFeaturedRecipes,
  buildRecipeWisdom,
  getPantangHeroCopy,
  getPantangPantryStaples,
} from './pantang-design'

const recipes: Recipe[] = [
  {
    id: 'sup-ayam-halia',
    title: 'Sup Ayam Halia',
    summary: 'Sup hangat untuk minggu pertama.',
    category: 'Soup',
    benefit: 'Warming',
    week: 'Week 1',
    prepTime: '35 minit',
    servings: '2 orang',
    heroColor: 'amber',
    ingredients: ['ayam', 'halia'],
    steps: ['Reneh sehingga lembut.'],
    pantryTips: ['Hidang panas.'],
    tags: ['halia'],
    featured: false,
  },
  {
    id: 'teh-kurma-halia',
    title: 'Teh Kurma Halia',
    summary: 'Minuman suam untuk sokongan susu.',
    category: 'Herbal',
    benefit: 'Milk support',
    week: 'Week 2',
    prepTime: '15 minit',
    servings: '2 cawan',
    heroColor: 'orange',
    ingredients: ['kurma', 'halia'],
    steps: ['Rebus dan tapis.'],
    pantryTips: ['Minum suam.'],
    tags: ['kurma'],
    featured: true,
  },
  {
    id: 'sup-daging-lobak-putih',
    title: 'Sup Daging Lobak Putih',
    summary: 'Sup yang mengenyangkan untuk pemulihan.',
    category: 'Soup',
    benefit: 'Energy boosting',
    week: 'Week 3+',
    prepTime: '50 minit',
    servings: '3 orang',
    heroColor: 'rose',
    ingredients: ['daging', 'lobak putih'],
    steps: ['Reneh lama.'],
    pantryTips: ['Masak lebih untuk esok.'],
    tags: ['sup'],
    featured: true,
  },
]

describe('buildPantangCalendar', () => {
  it('returns the four confinement phases from the design brief', () => {
    expect(buildPantangCalendar()).toEqual([
      { num: '01', name: 'Pemulihan', bm: 'Recovery', days: 'Day 1–7' },
      { num: '02', name: 'Penguatan', bm: 'Strengthening', days: 'Day 8–20' },
      { num: '03', name: 'Pemulasan', bm: 'Warming', days: 'Day 21–30' },
      { num: '04', name: 'Penyusuan', bm: 'For milk supply', days: 'Day 31–44' },
    ])
  })
})

describe('buildPantangFeaturedRecipes', () => {
  it('prioritizes featured recipes and fills the remaining slots in source order', () => {
    expect(buildPantangFeaturedRecipes(recipes, 3).map((recipe) => recipe.id)).toEqual([
      'teh-kurma-halia',
      'sup-daging-lobak-putih',
      'sup-ayam-halia',
    ])
  })
})

describe('getPantangHeroCopy', () => {
  it('returns bilingual hero copy from the design prototype', () => {
    expect(getPantangHeroCopy('en')).toMatchObject({
      eyebrow: 'Est. 44 days · For Malaysian mothers',
      ctaPrimary: 'Browse the recipes',
    })

    expect(getPantangHeroCopy('bm')).toMatchObject({
      ctaSecondary: 'Lihat pelan 44 hari',
    })
    expect(getPantangHeroCopy('bm').lede).toContain('Dapur pantang dwibahasa')
  })
})

describe('getPantangPantryStaples', () => {
  it('returns the six staple ingredients highlighted by the design', () => {
    expect(getPantangPantryStaples()).toEqual([
      { name: 'Halia Bentong', subtitle: 'Bentong ginger', role: 'Warming' },
      { name: 'Daun Kunyit', subtitle: 'Turmeric leaves', role: 'Aromatic' },
      { name: 'Minyak Bijan', subtitle: 'Sesame oil', role: 'Yin tonic' },
      { name: 'Kacang Merah', subtitle: 'Red dates', role: 'Blood-building' },
      { name: 'Akar Manis', subtitle: 'Liquorice root', role: 'Soothing' },
      { name: 'Daun Pegaga', subtitle: 'Pennywort', role: 'Cooling' },
    ])
  })
})

describe('buildRecipeWisdom', () => {
  it('creates the reflective wisdom block used on recipe detail pages', () => {
    expect(buildRecipeWisdom(recipes[1])).toEqual({
      title: 'Why this dish now?',
      body: 'Week 2 recipes focus on strengthening daily rhythm while supporting milk supply. Teh Kurma Halia is a gentle way to keep warmth in the body without making the meal feel heavy.',
    })
  })
})
