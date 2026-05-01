import { createServerFn } from '@tanstack/react-start'

import { normalizeRecipeInput } from './recipes.helpers'
import { createRecipeInDb, getRecipeByIdFromDb, listRecipesFromDb } from './recipes.server'
import type { CreateRecipeInput } from './recipes.types'

function validateRecipeInput(data: CreateRecipeInput): CreateRecipeInput {
  const normalized = normalizeRecipeInput(data)

  if (!normalized.title) throw new Error('Title is required')
  if (!normalized.summary) throw new Error('Summary is required')
  if (normalized.ingredients.length === 0) throw new Error('At least one ingredient is required')
  if (normalized.steps.length === 0) throw new Error('At least one step is required')

  return normalized
}

export const getRecipes = createServerFn({ method: 'GET' }).handler(async () => {
  return listRecipesFromDb()
})

export const getRecipeById = createServerFn({ method: 'GET' })
  .inputValidator((recipeId: string) => recipeId)
  .handler(async ({ data }: { data: string }) => {
    return getRecipeByIdFromDb(data)
  })

export const createRecipe = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateRecipeInput) => validateRecipeInput(data))
  .handler(async ({ data }) => {
    return createRecipeInDb(data)
  })
