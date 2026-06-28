import React, { useEffect, useState } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'

export default function Profile(){
  const supabase = getSupabaseClient()
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function load(){
      if (!supabase) return
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await supabase.auth.getUser()
        const user = res?.data?.user
        if (user) {
          setDisplayName(user.user_metadata?.full_name ?? user.user_metadata?.name ?? '')
          setAvatarUrl(user.user_metadata?.avatar_url ?? null)
        }
      } catch (err) {
        console.warn('profile load error', err)
      }
    }
    load()
  }, [supabase])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0]
    if (!file || !supabase) return
    setLoading(true)
    setMessage(null)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userRes: any = await supabase.auth.getUser()
      const userId = userRes?.data?.user?.id ?? 'anon'
      const path = `avatars/${userId}_${Date.now()}_${file.name}`
      // upload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uploadRes: any = await supabase.storage.from('avatars').upload(path, file)
      if (uploadRes.error) throw uploadRes.error
      const publicUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
      setAvatarUrl(publicUrl)
      // sync to server
      await fetch('/api/sync-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: userId, avatarUrl: publicUrl }) })
      setMessage('Uploaded')
    } catch (err: any) {
      setMessage(String(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(){
    if (!supabase) return
    setLoading(true)
    setMessage(null)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userRes: any = await supabase.auth.getUser()
      const userId = userRes?.data?.user?.id
      if (!userId) throw new Error('Not signed in')
      await fetch('/api/sync-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: userId, displayName, avatarUrl }) })
      setMessage('Saved')
    } catch (err: any) {
      setMessage(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-playfair text-gold mb-6">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-silver">Display name</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full mt-1 p-2 bg-gray-900 border border-gray-800 rounded" />
        </div>
        <div>
          <label className="block text-sm text-silver">Avatar</label>
          {avatarUrl && <div className="mb-2"><img src={avatarUrl} alt="avatar" className="w-24 h-24 object-cover rounded"/></div>}
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
        {message && <div className="text-silver">{message}</div>}
        <div>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-gold text-black rounded">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </main>
  )
}
