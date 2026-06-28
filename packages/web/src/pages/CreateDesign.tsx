import React, { useState } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'
import { trpc } from '../lib/trpc'
import { useNavigate } from 'react-router-dom'

export default function CreateDesign(){
  const supabase = getSupabaseClient()
  const create = trpc.designs.create.useMutation()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [isPremium, setIsPremium] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    let imageUrl: string | null = null
    try {
      if (file && supabase) {
        const userRes: any = await supabase.auth.getUser()
        const userId = userRes?.data?.user?.id ?? 'anon'
        const path = `${userId}/${Date.now()}_${file.name}`
        const uploadRes: any = await supabase.storage.from('designs').upload(path, file)
        if (uploadRes.error) throw uploadRes.error
        const publicUrl = supabase.storage.from('designs').getPublicUrl(path).data.publicUrl
        imageUrl = publicUrl
      }

      const res = await create.mutateAsync({ title, slug, description, imageUrl, priceCents: Math.round(price * 100), isPremium })
      if (res.ok) {
        navigate(`/designs/${res.design.slug}`)
      } else {
        alert(res.error || 'Failed to create')
      }
    } catch (err: any) {
      alert(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-playfair text-gold mb-6">Create Design</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-silver">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 p-2 bg-gray-900 border border-gray-800 rounded" required />
        </div>
        <div>
          <label className="block text-sm text-silver">Slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full mt-1 p-2 bg-gray-900 border border-gray-800 rounded" required />
        </div>
        <div>
          <label className="block text-sm text-silver">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 p-2 bg-gray-900 border border-gray-800 rounded" />
        </div>
        <div>
          <label className="block text-sm text-silver">Price (USD)</label>
          <input type="number" step="0.01" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full mt-1 p-2 bg-gray-900 border border-gray-800 rounded" />
        </div>
        <div>
          <label className="inline-flex items-center gap-2 text-silver">
            <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} /> Premium
          </label>
        </div>
        <div>
          <label className="block text-sm text-silver">Image</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-gold text-black rounded">{loading ? 'Creating...' : 'Create'}</button>
        </div>
      </form>
    </main>
  )
}
