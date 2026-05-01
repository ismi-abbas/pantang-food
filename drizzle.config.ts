import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./local.db'
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: authToken ? { url, authToken } : { url },
  verbose: true,
  strict: true,
})
