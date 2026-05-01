export type RecipeCategory = 'Soup' | 'Comfort' | 'Seafood' | 'Herbal' | 'Protein' | 'Snack'
export type RecipeBenefit =
  | 'Warming'
  | 'Easy to digest'
  | 'Milk support'
  | 'Energy boosting'
  | 'Light'
export type RecipeWeek = 'Week 1' | 'Week 2' | 'Week 3+'
export type RecipeHeroColor = 'amber' | 'rose' | 'orange' | 'emerald' | 'sky' | 'violet'

export type Recipe = {
  id: string
  title: string
  summary: string
  category: RecipeCategory
  benefit: RecipeBenefit
  week: RecipeWeek
  prepTime: string
  servings: string
  heroColor: RecipeHeroColor
  ingredients: string[]
  steps: string[]
  pantryTips: string[]
  tags: string[]
  featured: boolean
  createdAt?: string
}

export type RecipeFilter = {
  query: string
  category: RecipeCategory | 'All'
  benefit: RecipeBenefit | 'All'
  week: RecipeWeek | 'All'
}

export type CreateRecipeInput = {
  title: string
  summary: string
  category: RecipeCategory
  benefit: RecipeBenefit
  week: RecipeWeek
  prepTime: string
  servings: string
  ingredients: string[]
  steps: string[]
  pantryTips: string[]
  tags: string[]
}
