#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const migrationsDir = path.join(__dirname, '..', 'drizzle', 'migrations')
const sqlFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'))

if (!sqlFiles.length) {
  console.error('No SQL migration files found in', migrationsDir)
  process.exit(1)
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL not set. Set it and re-run.')
  process.exit(1)
}

sqlFiles.sort()
for (const f of sqlFiles) {
  const p = path.join(migrationsDir, f)
  console.log('Applying', p)
  execSync(`psql "${connectionString}" -f ${p}`, { stdio: 'inherit' })
}
