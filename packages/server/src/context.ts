import { pool as pgPool, db as drizzleDb } from '../db'
import { Request, Response } from 'express'
import * as trpc from '@trpc/server'
import { getSupabaseAdminClient } from '../services/supabase'

export async function createContext({ req, res }: { req: Request; res: Response }) {
  // Try to initialize DB and supabase admin if available
  // pool and db may be null if DATABASE_URL isn't set
  const supabaseAdmin = getSupabaseAdminClient()

  // Simple auth: read Authorization header 'Bearer user:<id>' set by client localStorage token
  const authHeader = req.headers.authorization
  let user: any = null
  if (authHeader) {
    const parts = authHeader.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1]
      if (token.startsWith('user:')) {
        const id = Number(token.split(':')[1])
        if (!Number.isNaN(id)) {
          // If DB is configured, you could fetch user here. We'll set a lightweight user object.
          user = { id, display_name: `User ${id}`, role: 'user' }
        }
      }
      // Future: handle real Supabase JWT tokens here
    }
  }

  return {
    req,
    res,
    db: drizzleDb,
    pool: pgPool,
    supabaseAdmin,
    user: user as null | { id: number; email?: string; role?: string; display_name?: string }
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>

export const createTRPCContext = createContext
