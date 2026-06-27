/**
 * Drizzle Kit config for migrations (server package)
 */
module.exports = {
  schema: './packages/server/src/db/schema.ts',
  out: './packages/server/drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL
  }
}
