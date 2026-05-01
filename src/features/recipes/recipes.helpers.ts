import type { CreateRecipeInput, Recipe, RecipeFilter, RecipeWeek } from './recipes.types'

const recipeWeeks: RecipeWeek[] = ['Week 1', 'Week 2', 'Week 3+']

export function slugifyRecipeId(title: string) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export function filterRecipes(recipes: Recipe[], filters: RecipeFilter) {
  const query = filters.query.trim().toLowerCase()

  return recipes.filter((recipe) => {
    const haystack = [recipe.title, recipe.summary, ...recipe.ingredients, ...recipe.tags]
      .join(' ')
      .toLowerCase()

    const matchesQuery = query.length === 0 || haystack.includes(query)
    const matchesCategory = filters.category === 'All' || recipe.category === filters.category
    const matchesBenefit = filters.benefit === 'All' || recipe.benefit === filters.benefit
    const matchesWeek = filters.week === 'All' || recipe.week === filters.week

    return matchesQuery && matchesCategory && matchesBenefit && matchesWeek
  })
}

export function buildShoppingList(recipes: Recipe[], selectedRecipeIds: string[]) {
  const seen = new Set<string>()
  const items: string[] = []

  for (const recipeId of selectedRecipeIds) {
    const recipe = recipes.find((item) => item.id === recipeId)
    if (!recipe) continue

    for (const ingredient of recipe.ingredients) {
      if (seen.has(ingredient)) continue
      seen.add(ingredient)
      items.push(ingredient)
    }
  }

  return items
}

export function splitLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function normalizeRecipeInput(data: CreateRecipeInput): CreateRecipeInput {
  return {
    ...data,
    title: data.title.trim(),
    summary: data.summary.trim(),
    prepTime: data.prepTime.trim(),
    servings: data.servings.trim(),
    ingredients: data.ingredients.map((item) => item.trim()).filter(Boolean),
    steps: data.steps.map((item) => item.trim()).filter(Boolean),
    pantryTips: data.pantryTips.map((item) => item.trim()).filter(Boolean),
    tags: data.tags.map((item) => item.trim()).filter(Boolean),
  }
}

export function buildRecoveryTimeline(recipes: Recipe[]) {
  return recipeWeeks.map((week) => ({
    week,
    total: recipes.filter((recipe) => recipe.week === week).length,
    featuredTitles: recipes
      .filter((recipe) => recipe.week === week && recipe.featured)
      .slice(0, 2)
      .map((recipe) => recipe.title),
  }))
}

export function getTopPantryItems(recipes: Recipe[], limit = 5) {
  const counts = new Map<string, number>()

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      counts.set(ingredient, (counts.get(ingredient) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1]
      }

      return left[0].localeCompare(right[0])
    })
    .slice(0, limit)
    .map(([ingredient, count]) => ({ ingredient, count }))
}
