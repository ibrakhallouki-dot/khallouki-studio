import React, { useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from './trpc'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { getSupabaseClient } from './supabaseClient'

const queryClient = new QueryClient()

export function TrpcProvider({ children }: { children: React.ReactNode }){
  const [token, setToken] = useState<string | null>(null)
  const [client, setClient] = useState<any | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    let subscription: any = null
    async function init(){
      if (!supabase) {
        setToken(null)
        return
      }
      try {
        // supabase.auth.getSession() returns { data: { session } }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessRes: any = await supabase.auth.getSession()
        const tokenVal = sessRes?.data?.session?.access_token ?? null
        setToken(tokenVal)

        // subscribe to changes
        subscription = supabase.auth.onAuthStateChange((_event:any, session:any) => {
          setToken(session?.access_token ?? null)
        })
      } catch (err) {
        console.warn('Error initializing supabase session', err)
      }
    }
    init()
    return () => {
      try {
        if (subscription && typeof subscription.unsubscribe === 'function') subscription.unsubscribe()
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    const c = createTRPCClient<any>({
      transformer: superjson,
      links: [httpBatchLink({ url: '/trpc', headers: () => (token ? { authorization: `Bearer ${token}` } : {}) })]
    })
    setClient(c)
  }, [token])

  if (!client) return <QueryClientProvider client={queryClient}><div className="p-6">Loading...</div></QueryClientProvider>

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
