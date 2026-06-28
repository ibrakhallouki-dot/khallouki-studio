import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthProvider'

export default function Login(){
  const auth = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSignIn(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await auth.signIn(email, password)
    setLoading(false)
    if (res.error) setError(res.error)
    else navigate('/')
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-playfair text-gold mb-6">Login</h2>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-sm text-silver">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-2 bg-gray-900 border border-gray-800 rounded" required />
        </div>
        <div>
          <label className="block text-sm text-silver">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 p-2 bg-gray-900 border border-gray-800 rounded" required />
        </div>
        {error && <div className="text-red-400">{error}</div>}
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-gold text-black rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
        </div>
      </form>
    </main>
  )
}
