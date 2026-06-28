import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSupabaseClient } from './supabaseClient'

type AuthUser = { id: string; email?: string | null; displayName?: string | null; avatarUrl?: string | null }

const AuthContext = createContext<{
  user: AuthUser | null
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
} | null>(null)

export function useAuth(){
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }){
  const supabase = getSupabaseClient()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (!supabase) return
    let sub: any = null
    async function init(){
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessRes: any = await supabase.auth.getSession()
        const session = sessRes?.data?.session
        if (session?.user) {
          const u = session.user
          setUser({ id: u.id, email: u.email ?? null, displayName: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null, avatarUrl: u.user_metadata?.avatar_url ?? null })
          // Sync to server
          try { await fetch('/api/sync-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, email: u.email, displayName: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null, avatarUrl: u.user_metadata?.avatar_url ?? null }) }) } catch (e) { /* ignore */ }
        }
        sub = supabase.auth.onAuthStateChange((_event:any, session:any) => {
          const u = session?.user
          if (u) {
            setUser({ id: u.id, email: u.email ?? null, displayName: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null, avatarUrl: u.user_metadata?.avatar_url ?? null })
            // sync
            fetch('/api/sync-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, email: u.email, displayName: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null, avatarUrl: u.user_metadata?.avatar_url ?? null }) }).catch(() => {})
          } else {
            setUser(null)
          }
        })
      } catch (err) {
        console.warn('Auth init error', err)
      }
    }
    init()
    return () => { if (sub && typeof sub.unsubscribe === 'function') sub.unsubscribe() }
  }, [supabase])

  async function signIn(email: string, password: string){
    if (!supabase) return { error: 'SUPABASE not configured' }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await supabase.auth.signInWithPassword({ email, password })
      if (res.error) return { error: res.error.message ?? String(res.error) }
      const session = res.data?.session
      const u = res.data?.user
      if (u) {
        setUser({ id: u.id, email: u.email ?? null, displayName: u.user_metadata?.full_name ?? null, avatarUrl: u.user_metadata?.avatar_url ?? null })
        // sync
        fetch('/api/sync-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, email: u.email, displayName: u.user_metadata?.full_name ?? null, avatarUrl: u.user_metadata?.avatar_url ?? null }) }).catch(() => {})
      }
      return {}
    } catch (err: any) {
      return { error: String(err) }
    }
  }

  async function signUp(email: string, password: string){
    if (!supabase) return { error: 'SUPABASE not configured' }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await supabase.auth.signUp({ email, password })
      if (res.error) return { error: res.error.message ?? String(res.error) }
      return {}
    } catch (err: any) {
      return { error: String(err) }
    }
  }

  async function signOut(){
    if (!supabase) return
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Sign out error', err)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
  )
}
