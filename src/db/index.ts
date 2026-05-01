import type { Config as LibsqlConfig } from '@libsql/client'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'

import * as schema from './schema'

type AppDatabase = LibSQLDatabase<typeof schema>

let dbPromise: Promise<AppDatabase> | null = null

function getConnectionConfig(): LibsqlConfig {
  const url =
    process.env.TURSO_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'file:./local.db'

  const authToken =
    process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN || undefined

  return { url, authToken }
}

async function createDatabase() {
  const connection = getConnectionConfig()

  if (connection.url.startsWith('file:') || connection.url === ':memory:') {
    const [{ createClient }, { drizzle }] = await Promise.all([
      import('@libsql/client/node'),
      import('drizzle-orm/libsql/node'),
    ])

    const client = createClient(connection)
    return drizzle({ client, schema }) as AppDatabase
  }

  const [{ createClient }, { drizzle }] = await Promise.all([
    import('@libsql/client'),
    import('drizzle-orm/libsql'),
  ])

  const client = createClient(connection)
  return drizzle({ client, schema }) as AppDatabase
}

export async function getDb() {
  dbPromise ??= createDatabase()
  return dbPromise
}
