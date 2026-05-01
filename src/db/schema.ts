import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const recipes = sqliteTable('recipes', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  category: text('category').notNull(),
  benefit: text('benefit').notNull(),
  week: text('week').notNull(),
  prepTime: text('prep_time').notNull(),
  servings: text('servings').notNull(),
  heroColor: text('hero_color').notNull(),
  ingredients: text('ingredients').notNull(),
  steps: text('steps').notNull(),
  pantryTips: text('pantry_tips').notNull(),
  tags: text('tags').notNull(),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})
