import React from 'react'
import { useNavigate } from 'react-router-dom'
import { trpc } from '../lib/trpc'

export default function Signup(){
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate()
  const users = trpc.users.ensureUserFromSupabase.useMutation()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
      const u = await users.mutateAsync({ supabase_id: `local-${email}`, email })
      if (typeof window !== 'undefined') window.localStorage.setItem('kh_session', `user:${u.id}`)
      navigate('/dashboard')
    }catch(err:any){
      alert(err.message||'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create an account</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-silver mb-1">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 bg-gray-900 rounded" />
        </div>
        <div>
          <label className="block text-silver mb-1">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 bg-gray-900 rounded" />
        </div>
        <div>
          <button type="submit" className="px-4 py-2 bg-gold text-black rounded">Sign up</button>
        </div>
      </form>
    </div>
  )
}
