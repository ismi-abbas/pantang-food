import { createServerFn } from '@tanstack/react-start'

import { createRecipeInDb, listRecipesFromDb } from './recipes.server'
import type { CreateRecipeInput } from './recipes.types'

function validateRecipeInput(data: CreateRecipeInput): CreateRecipeInput {
  if (!data.title.trim()) throw new Error('Title is required')
  if (!data.summary.trim()) throw new Error('Summary is required')
  if (data.ingredients.length === 0) throw new Error('At least one ingredient is required')
  if (data.steps.length === 0) throw new Error('At least one step is required')

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

export const getRecipes = createServerFn({ method: 'GET' }).handler(async () => {
  return listRecipesFromDb()
})

export const createRecipe = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateRecipeInput) => validateRecipeInput(data))
  .handler(async ({ data }) => {
    return createRecipeInDb(data)
  })
