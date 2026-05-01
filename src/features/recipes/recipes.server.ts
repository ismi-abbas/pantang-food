import { count, desc, eq, sql } from 'drizzle-orm'

import { getDb } from '#/db'
import { recipes as recipesTable } from '#/db/schema'

import { seededRecipes } from './recipes.seed'
import { slugifyRecipeId } from './recipes.helpers'
import type { CreateRecipeInput, Recipe } from './recipes.types'

const runtimeUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || ''
const useMemoryStore =
  runtimeUrl.length === 0 ||
  runtimeUrl.startsWith('file:') ||
  runtimeUrl === ':memory:' ||
  runtimeUrl.startsWith('postgres')

let memoryRecipes = [...seededRecipes]

function serializeList(value: string[]) {
  return JSON.stringify(value)
}

function deserializeList(value: string) {
  const parsed = JSON.parse(value)
  return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
}

function toRow(recipe: Recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    summary: recipe.summary,
    category: recipe.category,
    benefit: recipe.benefit,
    week: recipe.week,
    prepTime: recipe.prepTime,
    servings: recipe.servings,
    heroColor: recipe.heroColor,
    ingredients: serializeList(recipe.ingredients),
    steps: serializeList(recipe.steps),
    pantryTips: serializeList(recipe.pantryTips),
    tags: serializeList(recipe.tags),
    featured: recipe.featured,
    createdAt: recipe.createdAt ?? new Date().toISOString(),
  }
}

function fromRow(row: typeof recipesTable.$inferSelect): Recipe {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    category: row.category as Recipe['category'],
    benefit: row.benefit as Recipe['benefit'],
    week: row.week as Recipe['week'],
    prepTime: row.prepTime,
    servings: row.servings,
    heroColor: row.heroColor as Recipe['heroColor'],
    ingredients: deserializeList(row.ingredients),
    steps: deserializeList(row.steps),
    pantryTips: deserializeList(row.pantryTips),
    tags: deserializeList(row.tags),
    featured: Boolean(row.featured),
    createdAt: row.createdAt,
  }
}

async function ensureSchema() {
  const db = await getDb()

  await db.run(sql`
    create table if not exists recipes (
      id text primary key,
      title text not null,
      summary text not null,
      category text not null,
      benefit text not null,
      week text not null,
      prep_time text not null,
      servings text not null,
      hero_color text not null,
      ingredients text not null,
      steps text not null,
      pantry_tips text not null,
      tags text not null,
      featured integer not null default 0,
      created_at text not null default current_timestamp
    )
  `)
}

async function seedIfEmpty() {
  const db = await getDb()
  await ensureSchema()

  const [{ value }] = await db.select({ value: count() }).from(recipesTable)
  if (value > 0) {
    return
  }

  await db.insert(recipesTable).values(seededRecipes.map(toRow))
}

export async function listRecipesFromDb() {
  if (useMemoryStore) {
    return [...memoryRecipes].sort((left, right) => {
      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1
      }

      return left.title.localeCompare(right.title)
    })
  }

  const db = await getDb()
  await seedIfEmpty()

  const rows = await db.select().from(recipesTable).orderBy(desc(recipesTable.featured), recipesTable.title)
  return rows.map(fromRow)
}

export async function createRecipeInDb(input: CreateRecipeInput) {
  const baseId = slugifyRecipeId(input.title) || `recipe-${Date.now()}`

  if (useMemoryStore) {
    const duplicateCount = memoryRecipes.filter((recipe) => recipe.id.startsWith(baseId)).length
    const id = duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`

    const recipe: Recipe = {
      id,
      title: input.title.trim(),
      summary: input.summary.trim(),
      category: input.category,
      benefit: input.benefit,
      week: input.week,
      prepTime: input.prepTime.trim(),
      servings: input.servings.trim(),
      heroColor: 'violet',
      ingredients: input.ingredients,
      steps: input.steps,
      pantryTips: input.pantryTips,
      tags: input.tags,
      featured: false,
      createdAt: new Date().toISOString(),
    }

    memoryRecipes = [recipe, ...memoryRecipes]
    return recipe
  }

  const db = await getDb()
  await seedIfEmpty()

  const existing = await db.select({ id: recipesTable.id }).from(recipesTable).where(eq(recipesTable.id, baseId))
  const id = existing.length === 0 ? baseId : `${baseId}-${Date.now()}`

  const recipe: Recipe = {
    id,
    title: input.title.trim(),
    summary: input.summary.trim(),
    category: input.category,
    benefit: input.benefit,
    week: input.week,
    prepTime: input.prepTime.trim(),
    servings: input.servings.trim(),
    heroColor: 'violet',
    ingredients: input.ingredients,
    steps: input.steps,
    pantryTips: input.pantryTips,
    tags: input.tags,
    featured: false,
    createdAt: new Date().toISOString(),
  }

  await db.insert(recipesTable).values(toRow(recipe))
  return recipe
}
