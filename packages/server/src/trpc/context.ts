import { inferAsyncReturnType } from '@trpc/server'
import { Request, Response } from 'express'
import { getSupabaseAdminClient } from '../services/supabase'
import { db, pool } from '../db'

export async function createContext({ req, res }: { req: Request; res: Response }) {
  const supabaseAdmin = getSupabaseAdminClient()

  const authHeader = req.headers.authorization
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  let user: null | { id: string; email?: string; role?: string } = null

  if (supabaseAdmin && token) {
    try {
      // supabase-js v2: auth.getUser(token)
      // Fallback: some versions expose auth.api.getUserByCookie or similar; we defensively check for getUser.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyAuth: any = (supabaseAdmin as any).auth
      if (anyAuth && typeof anyAuth.getUser === 'function') {
        // getUser expects an access_token string
        // returns { data: { user }, error }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resGetUser: any = await anyAuth.getUser(token)
        if (resGetUser?.data?.user) {
          const u = resGetUser.data.user
          user = { id: u.id, email: u.email ?? undefined, role: (u.user_metadata && u.user_metadata.role) || undefined }
        }
      } else if ((anyAuth && typeof anyAuth.getUserByCookie === 'function')) {
        // older server helpers: not expected in this setup, but kept for safety
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resGetUser: any = await anyAuth.getUserByCookie({ token })
        if (resGetUser?.user) {
          const u = resGetUser.user
          user = { id: u.id, email: u.email ?? undefined, role: (u.user_metadata && u.user_metadata.role) || undefined }
        }
      } else {
        console.warn('Supabase admin client present but auth.getUser not available; skipping user population')
      }
    } catch (err) {
      console.error('Error verifying supabase token', err)
    }
  }

  return {
    req,
    res,
    db,
    pool,
    supabaseAdmin,
    user
  }
}

export type Context = inferAsyncReturnType<typeof createContext>

export const createTRPCContext = async ({ req, res }: { req: Request; res: Response }) => createContext({ req, res })
