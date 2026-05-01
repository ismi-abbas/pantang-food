import type { Recipe } from './recipes.types'

type CookpadInspiration = {
  title: string
  href: string
  imageUrl: string
  imageAlt: string
  sourceName: 'Cookpad'
}

const sourceUrl = 'https://cookpad.com/my/search/ibu%20pantang'

const inspirations: CookpadInspiration[] = [
  {
    title: 'Daging Masak Lada Hitam, Halia dan Serai (Masakan Ibu Pantang)',
    href: 'https://cookpad.com/my/recipes/24106652',
    imageUrl: 'https://img-global.cpcdn.com/recipes/1050537c25ec5222/300x220cq80/daging-masak-lada-hitam-halia-dan-serai-masakan-ibu-pantang-resipi-foto-utama.webp',
    imageAlt: 'Daging Masak Lada Hitam, Halia dan Serai (Masakan Ibu Pantang)',
    sourceName: 'Cookpad',
  },
  {
    title: 'Resipi Berpantang : Tom Yam Ikan Bawal Putih',
    href: 'https://cookpad.com/my/recipes/22579860',
    imageUrl: 'https://img-global.cpcdn.com/recipes/5e4ceab598ad50ca/300x220cq80/resipi-berpantang-tom-yam-ikan-bawal-putih-resipi-foto-utama.webp',
    imageAlt: 'Resipi Berpantang : Tom Yam Ikan Bawal Putih',
    sourceName: 'Cookpad',
  },
  {
    title: 'Resipi Berpantang : Bubur Ayam Bersayur',
    href: 'https://cookpad.com/my/recipes/22589640',
    imageUrl: 'https://img-global.cpcdn.com/recipes/a126d5f68b6cf65b/300x220cq80/resipi-berpantang-bubur-ayam-bersayur-resipi-foto-utama.webp',
    imageAlt: 'Resipi Berpantang : Bubur Ayam Bersayur',
    sourceName: 'Cookpad',
  },
  {
    title: 'Resipi Berpantang : Ayam Kukus Berempah',
    href: 'https://cookpad.com/my/recipes/22591660',
    imageUrl: 'https://img-global.cpcdn.com/recipes/8784ba633a3ec340/300x220cq80/resipi-berpantang-ayam-kukus-berempah-resipi-foto-utama.webp',
    imageAlt: 'Resipi Berpantang : Ayam Kukus Berempah',
    sourceName: 'Cookpad',
  },
  {
    title: 'Resipi Berpantang : Sup Ikan Kerisi',
    href: 'https://cookpad.com/my/recipes/22587088',
    imageUrl: 'https://img-global.cpcdn.com/recipes/4491442d01a2c541/300x220cq80/resipi-berpantang-sup-ikan-kerisi-resipi-foto-utama.webp',
    imageAlt: 'Resipi Berpantang : Sup Ikan Kerisi',
    sourceName: 'Cookpad',
  },
  {
    title: 'Menu Berpantang : Tenggiri Stim Lemon',
    href: 'https://cookpad.com/my/recipes/16658071',
    imageUrl: 'https://img-global.cpcdn.com/recipes/446eee42b8c154ee/300x220cq80/menu-berpantang-tenggiri-stim-lemon-resipi-foto-utama.webp',
    imageAlt: 'Menu Berpantang : Tenggiri Stim Lemon',
    sourceName: 'Cookpad',
  },
  {
    title: 'Menu Berpantang : Tenggiri Masak Halia & Blackpepper',
    href: 'https://cookpad.com/my/recipes/16631985',
    imageUrl: 'https://img-global.cpcdn.com/recipes/ca77f8f43ec7d9ea/300x220cq80/menu-berpantang-tenggiri-masak-halia-blackpepper-resipi-foto-utama.webp',
    imageAlt: 'Menu Berpantang : Tenggiri Masak Halia & Blackpepper',
    sourceName: 'Cookpad',
  },
  {
    title: '🍗 Ayam Masak Halia Black Pepper - Resipi Berpantang',
    href: 'https://cookpad.com/my/search/ibu%20pantang',
    imageUrl: 'https://img-global.cpcdn.com/recipes/dd2c8f5fd97a6e0f/300x220cq80/ayam-masak-halia-black-pepper-resipi-berpantang-resipi-foto-utama.webp',
    imageAlt: 'Ayam Masak Halia Black Pepper - Resipi Berpantang',
    sourceName: 'Cookpad',
  },
]

const mediaMap: Record<string, Omit<Recipe, 'id' | 'title' | 'summary' | 'category' | 'benefit' | 'week' | 'prepTime' | 'servings' | 'heroColor' | 'ingredients' | 'steps' | 'pantryTips' | 'tags' | 'featured' | 'createdAt'>> = {
  'sup-ayam-halia': {
    imageUrl: 'https://img-global.cpcdn.com/recipes/dd2c8f5fd97a6e0f/300x220cq80/ayam-masak-halia-black-pepper-resipi-berpantang-resipi-foto-utama.webp',
    imageAlt: 'Ayam Masak Halia Black Pepper - Resipi Berpantang',
    sourceName: 'Cookpad',
    sourceUrl,
  },
  'bubur-nasi-pantang': {
    imageUrl: 'https://img-global.cpcdn.com/recipes/a126d5f68b6cf65b/300x220cq80/resipi-berpantang-bubur-ayam-bersayur-resipi-foto-utama.webp',
    imageAlt: 'Resipi Berpantang : Bubur Ayam Bersayur',
    sourceName: 'Cookpad',
    sourceUrl,
  },
  'ayam-kukus-serai': {
    imageUrl: 'https://img-global.cpcdn.com/recipes/8784ba633a3ec340/300x220cq80/resipi-berpantang-ayam-kukus-berempah-resipi-foto-utama.webp',
    imageAlt: 'Resipi Berpantang : Ayam Kukus Berempah',
    sourceName: 'Cookpad',
    sourceUrl,
  },
  'ikan-merah-kukus-halia': {
    imageUrl: 'https://img-global.cpcdn.com/recipes/993943b7cb972b20/300x220cq80/resipi-berpantang-ikan-bawal-emas-kukus-halia-resipi-foto-utama.webp',
    imageAlt: 'Resipi Berpantang : Ikan Bawal Emas Kukus Halia',
    sourceName: 'Cookpad',
    sourceUrl,
  },
  'sup-daging-lobak-putih': {
    imageUrl: 'https://img-global.cpcdn.com/recipes/1050537c25ec5222/300x220cq80/daging-masak-lada-hitam-halia-dan-serai-masakan-ibu-pantang-resipi-foto-utama.webp',
    imageAlt: 'Daging Masak Lada Hitam, Halia dan Serai (Masakan Ibu Pantang)',
    sourceName: 'Cookpad',
    sourceUrl,
  },
  'ikan-singgang-kunyit': {
    imageUrl: 'https://img-global.cpcdn.com/recipes/4491442d01a2c541/300x220cq80/resipi-berpantang-sup-ikan-kerisi-resipi-foto-utama.webp',
    imageAlt: 'Resipi Berpantang : Sup Ikan Kerisi',
    sourceName: 'Cookpad',
    sourceUrl,
  },
  'salmon-bakar-kunyit': {
    imageUrl: 'https://img-global.cpcdn.com/recipes/446eee42b8c154ee/300x220cq80/menu-berpantang-tenggiri-stim-lemon-resipi-foto-utama.webp',
    imageAlt: 'Menu Berpantang : Tenggiri Stim Lemon',
    sourceName: 'Cookpad',
    sourceUrl,
  },
  'ayam-panggang-kurma-bawang': {
    imageUrl: 'https://img-global.cpcdn.com/recipes/8784ba633a3ec340/300x220cq80/resipi-berpantang-ayam-kukus-berempah-resipi-foto-utama.webp',
    imageAlt: 'Resipi Berpantang : Ayam Kukus Berempah',
    sourceName: 'Cookpad',
    sourceUrl,
  },
}

export function attachCookpadMedia(recipes: Recipe[]) {
  return recipes.map((recipe) => ({
    ...recipe,
    ...(mediaMap[recipe.id] ?? {}),
  }))
}

export function getCookpadInspirations(limit = 6) {
  return inspirations.slice(0, limit).map((item) => ({
    ...item,
    sourceUrl,
  }))
}
