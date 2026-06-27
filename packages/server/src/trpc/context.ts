import { inferAsyncReturnType } from '@trpc/server'
import * as trpc from '@trpc/server'
import { Request, Response } from 'express'
import { getSupabaseAdminClient } from '../services/supabase'
import { db, pool } from '../db'

export async function createContext({ req, res }: { req: Request; res: Response }) {
  // NOTE: This context attempts to initialize a Supabase admin client if credentials are present.
  // If not present, the supabaseAdmin client will be null and auth-related procedures should
  // handle unauthenticated flows gracefully.
  const supabaseAdmin = getSupabaseAdminClient()

  // TODO: When SUPABASE_SERVICE_ROLE_KEY is set, use supabaseAdmin to verify incoming bearer tokens
  // and populate `user` in context. For now, we leave user as null and let procedures enforce auth as needed.

  return {
    req,
    res,
    db,
    pool,
    supabaseAdmin,
    user: null as null | { id: string; email?: string; role?: string }
  }
}

export type Context = inferAsyncReturnType<typeof createContext>

export const createTRPCContext = async ({ req, res }: { req: Request; res: Response }) => createContext({ req, res })
