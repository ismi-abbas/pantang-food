import { describe, expect, it } from 'vitest'

import { chunkRowsForInsert, getRecipeByIdFromDb, getRecipeStoreMode } from './recipes.server'

describe('getRecipeStoreMode', () => {
  it('uses database mode when a d1 binding is available', () => {
    expect(getRecipeStoreMode('', true)).toBe('database')
  })

  it('uses memory mode for local file-backed libsql urls in Cloudflare-style local dev', () => {
    expect(getRecipeStoreMode('file:./local.db')).toBe('memory')
  })

  it('uses database mode for remote Turso urls', () => {
    expect(getRecipeStoreMode('libsql://pantang-food.turso.io')).toBe('database')
  })

  it('falls back to memory mode when no usable remote libsql url exists', () => {
    expect(getRecipeStoreMode('')).toBe('memory')
    expect(getRecipeStoreMode('postgres://example')).toBe('memory')
  })
})

describe('getRecipeByIdFromDb', () => {
  it('returns a matching recipe from the local seeded store', async () => {
    const recipe = await getRecipeByIdFromDb('sup-ayam-halia')

    expect(recipe?.id).toBe('sup-ayam-halia')
    expect(recipe?.title).toBe('Sup Ayam Halia')
  })

  it('returns undefined for an unknown recipe id', async () => {
    await expect(getRecipeByIdFromDb('not-a-real-recipe')).resolves.toBeUndefined()
  })
})

describe('chunkRowsForInsert', () => {
  it('splits large inserts into smaller d1-friendly chunks', () => {
    expect(chunkRowsForInsert(Array.from({ length: 18 }, (_, index) => index), 8)).toEqual([
      [0, 1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14, 15],
      [16, 17],
    ])
  })
})
