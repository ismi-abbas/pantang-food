import type { Config as LibsqlConfig } from '@libsql/client'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'

import * as schema from './schema'

type AppDatabase = LibSQLDatabase<typeof schema>

type D1LikeDatabase = {
  prepare: (...args: unknown[]) => unknown
  dump?: (...args: unknown[]) => unknown
  batch?: (...args: unknown[]) => unknown
  exec?: (...args: unknown[]) => unknown
}

type RuntimeMode = 'memory' | 'libsql' | 'd1'

type RuntimeModeOptions = {
  databaseUrl?: string
  d1BindingName?: string
  hasD1Binding?: boolean
}

let dbPromise: Promise<AppDatabase> | null = null

export function getDatabaseRuntimeMode({
  databaseUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || '',
  hasD1Binding = false,
}: RuntimeModeOptions): RuntimeMode {
  if (hasD1Binding) {
    return 'd1'
  }

  if (
    databaseUrl.length === 0 ||
    databaseUrl.startsWith('file:') ||
    databaseUrl === ':memory:' ||
    databaseUrl.startsWith('postgres')
  ) {
    return 'memory'
  }

  return 'libsql'
}

function getConnectionConfig(): LibsqlConfig {
  const url =
    process.env.TURSO_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'file:./local.db'

  const authToken =
    process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN || undefined

  return { url, authToken }
}

async function getCloudflareD1Binding(bindingName = process.env.CLOUDFLARE_D1_BINDING || 'DB'): Promise<D1LikeDatabase | null> {
  try {
    const mod = await import('cloudflare:workers')
    const binding = mod.env[bindingName]

    if (binding && typeof binding === 'object' && 'prepare' in binding) {
      return binding as D1LikeDatabase
    }
  } catch {
    // not running in cloudflare workers runtime
  }

  return null
}

async function createDatabase() {
  const connection = getConnectionConfig()
  const d1BindingName = process.env.CLOUDFLARE_D1_BINDING || 'DB'
  const d1Binding = await getCloudflareD1Binding(d1BindingName)
  const runtimeMode = getDatabaseRuntimeMode({
    databaseUrl: connection.url,
    d1BindingName,
    hasD1Binding: Boolean(d1Binding),
  })

  if (runtimeMode === 'd1' && d1Binding) {
    const { drizzle } = await import('drizzle-orm/d1')
    return drizzle(d1Binding, { schema }) as AppDatabase
  }

  if (runtimeMode === 'libsql') {
    const [{ createClient }, { drizzle }] = await Promise.all([
      import('@libsql/client'),
      import('drizzle-orm/libsql'),
    ])

    const client = createClient(connection)
    return drizzle({ client, schema }) as AppDatabase
  }

  const [{ createClient }, { drizzle }] = await Promise.all([
    import('@libsql/client/node'),
    import('drizzle-orm/libsql/node'),
  ])

  const client = createClient(connection)
  return drizzle({ client, schema }) as AppDatabase
}

export async function getDb() {
  dbPromise ??= createDatabase()
  return dbPromise
}
