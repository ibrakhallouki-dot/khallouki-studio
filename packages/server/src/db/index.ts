import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL || ''

let pool: Pool | null = null
let db: any = null

if (connectionString) {
  pool = new Pool({ connectionString })
  db = drizzle(pool)
} else {
  console.warn('DATABASE_URL not set — database client will not be initialized. See packages/server/.env.example')
}

export { pool, db }
