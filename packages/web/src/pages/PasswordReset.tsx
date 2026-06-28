import React from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'

export default function PasswordReset(){
  const [email, setEmail] = React.useState('')
  const [message, setMessage] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        setMessage('Supabase not configured')
        setLoading(false)
        return
      }
      // Try multiple APIs depending on SDK version
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const auth: any = supabase.auth
      let res: any = null
      if (auth.resetPasswordForEmail) {
        res = await auth.resetPasswordForEmail(email)
      } else if (auth.api && auth.api.resetPasswordForEmail) {
        res = await auth.api.resetPasswordForEmail(email)
      } else if (auth.sendPasswordResetEmail) {
        res = await auth.sendPasswordResetEmail(email)
      } else {
        setMessage('Password reset not available for this Supabase SDK version')
        setLoading(false)
        return
      }

      if (res?.error) setMessage(res.error.message ?? String(res.error))
      else setMessage('If an account exists, a password reset email was sent.')
    } catch (err: any) {
      setMessage(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-playfair text-gold mb-6">Reset password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-silver">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-2 bg-gray-900 border border-gray-800 rounded" required />
        </div>
        {message && <div className="text-silver">{message}</div>}
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-gold text-black rounded">{loading ? 'Sending...' : 'Send reset email'}</button>
        </div>
      </form>
    </main>
  )
}
