import type { Recipe, RecipeFilter } from './recipes.types'

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
            const haystack = [
              recipe.title,
              recipe.summary,
              ...recipe.ingredients,
              ...recipe.tags,
            ]
              .join(' ')
              .toLowerCase()

            const matchesQuery = query.length === 0 || haystack.includes(query)
            const matchesCategory =
              filters.category === 'All' || recipe.category === filters.category
            const matchesBenefit =
              filters.benefit === 'All' || recipe.benefit === filters.benefit
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
