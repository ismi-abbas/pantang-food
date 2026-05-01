import type { Recipe } from './recipes.types'

export type PantangLanguage = 'en' | 'bm'

export type PantangPhase = {
  num: '01' | '02' | '03' | '04'
  name: string
  bm: string
  days: string
}

export type PantangHeroCopy = {
  eyebrow: string
  headline: string
  accent: string
  lede: string
  ctaPrimary: string
  ctaSecondary: string
  quote: string
  quoteByline: string
}

export type PantangStaple = {
  name: string
  subtitle: string
  role: string
}

export type PantangStory = {
  quote: string
  name: string
  where: string
}

const pantangCalendar: PantangPhase[] = [
  { num: '01', name: 'Pemulihan', bm: 'Recovery', days: 'Day 1–7' },
  { num: '02', name: 'Penguatan', bm: 'Strengthening', days: 'Day 8–20' },
  { num: '03', name: 'Pemulasan', bm: 'Warming', days: 'Day 21–30' },
  { num: '04', name: 'Penyusuan', bm: 'For milk supply', days: 'Day 31–44' },
]

const heroCopy: Record<PantangLanguage, PantangHeroCopy> = {
  en: {
    eyebrow: 'Est. 44 days · For Malaysian mothers',
    headline: 'Forty-four days of',
    accent: 'quiet, warming',
    lede:
      'A bilingual confinement kitchen for new mothers across Malaysia — Malay, Chinese, and Indian traditions, written down at last and arranged by week.',
    ctaPrimary: 'Browse the recipes',
    ctaSecondary: 'See the 44-day plan',
    quote: 'Mak said the kitchen is the second womb. The first holds the baby; the second holds the mother.',
    quoteByline: 'Note from Mak Cik Salmah, Kuala Pilah',
  },
  bm: {
    eyebrow: 'Tempoh 44 hari · Untuk ibu di Malaysia',
    headline: 'Empat puluh empat hari',
    accent: 'makanan hangat, tenang',
    lede:
      'Dapur pantang dwibahasa untuk ibu baru di seluruh Malaysia — tradisi Melayu, Cina dan India, akhirnya direkodkan dan disusun mengikut minggu.',
    ctaPrimary: 'Lihat resipi',
    ctaSecondary: 'Lihat pelan 44 hari',
    quote: 'Mak kata dapur ialah rahim kedua. Rahim pertama memegang bayi; yang kedua memegang ibu.',
    quoteByline: 'Catatan Mak Cik Salmah, Kuala Pilah',
  },
}

const pantryStaples: PantangStaple[] = [
  { name: 'Halia Bentong', subtitle: 'Bentong ginger', role: 'Warming' },
  { name: 'Daun Kunyit', subtitle: 'Turmeric leaves', role: 'Aromatic' },
  { name: 'Minyak Bijan', subtitle: 'Sesame oil', role: 'Yin tonic' },
  { name: 'Kacang Merah', subtitle: 'Red dates', role: 'Blood-building' },
  { name: 'Akar Manis', subtitle: 'Liquorice root', role: 'Soothing' },
  { name: 'Daun Pegaga', subtitle: 'Pennywort', role: 'Cooling' },
]

const motherStories: PantangStory[] = [
  {
    quote:
      'My mother flew in from Penang with a thermos of red date soup. Forty-four days later, this site held the recipes she did not have time to write down.',
    name: 'Aisyah R.',
    where: 'Subang Jaya',
  },
  {
    quote:
      'I was raised on bubur pulut hitam in the third week. Cooking it for my own daughter felt like passing a small, warm thing across a generation.',
    name: 'Mei Ling C.',
    where: 'Petaling Jaya',
  },
  {
    quote:
      'Bilingual instructions saved me — I can read along while my mother-in-law explains what just enough means.',
    name: 'Priya S.',
    where: 'Ipoh',
  },
]

export function buildPantangCalendar() {
  return pantangCalendar
}

export function buildPantangFeaturedRecipes(recipes: Recipe[], limit = 5) {
  const prioritized = recipes.filter((recipe) => recipe.featured)
  const remainder = recipes.filter((recipe) => !recipe.featured)

  return [...prioritized, ...remainder].slice(0, limit)
}

export function getPantangHeroCopy(language: PantangLanguage) {
  return heroCopy[language]
}

export function getPantangPantryStaples() {
  return pantryStaples
}

export function getPantangStories() {
  return motherStories
}

export function buildRecipeWisdom(recipe: Recipe) {
  const weekGuidance = {
    'Week 1': 'Week 1 recipes focus on warmth and easy nourishment while the body settles after birth.',
    'Week 2': 'Week 2 recipes focus on strengthening daily rhythm while supporting milk supply.',
    'Week 3+': 'Week 3+ recipes help mothers rebuild energy while adding more variety back into the kitchen.',
  } as const

  const benefitGuidance = {
    Warming: `${recipe.title} keeps heat in the body and helps meals feel comforting without being complicated.`,
    'Easy to digest': `${recipe.title} keeps the meal gentle, soothing, and easier to return to throughout the day.`,
    'Milk support': `${recipe.title} is a gentle way to keep warmth in the body without making the meal feel heavy.`,
    'Energy boosting': `${recipe.title} brings a little more substance to the table while still fitting a recovery routine.`,
    Light: `${recipe.title} keeps the plate calm and light, especially on days when appetite is still returning.`,
  } as const

  return {
    title: 'Why this dish now?',
    body: `${weekGuidance[recipe.week]} ${benefitGuidance[recipe.benefit]}`,
  }
}
