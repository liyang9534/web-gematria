import { drizzle } from 'drizzle-orm/sqlite-proxy'
import * as schema from '../schema'

type D1QueryResult = {
  results?: Record<string, unknown>[]
}

type D1QueryResponse = {
  success: boolean
  errors?: { message?: string }[]
  result?: D1QueryResult | D1QueryResult[]
}

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} environment variable is not set`)
  }
  return value
}

export function createD1HttpDatabase() {
  const accountId = getRequiredEnv('CLOUDFLARE_ACCOUNT_ID')
  const databaseId = getRequiredEnv('CLOUDFLARE_D1_DATABASE_ID')
  const token = getRequiredEnv('CLOUDFLARE_API_TOKEN')
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`

  return drizzle(
    async (query, params) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ sql: query, params }),
      })

      if (!response.ok) {
        throw new Error(`D1 query failed with HTTP ${response.status}`)
      }

      const payload = (await response.json()) as D1QueryResponse
      if (!payload.success) {
        const message =
          payload.errors?.map((error) => error.message).filter(Boolean).join('; ') ||
          'Unknown D1 query error'
        throw new Error(message)
      }

      const result = Array.isArray(payload.result)
        ? payload.result[0]
        : payload.result

      return { rows: result?.results ?? [] }
    },
    { schema },
  )
}
