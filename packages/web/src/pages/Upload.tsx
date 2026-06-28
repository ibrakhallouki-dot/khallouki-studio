import React from 'react'
import { trpc } from '../lib/trpc'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function Upload(){
  const navigate = useNavigate()
  const create = trpc.designs.create.useMutation()
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const [slug, setSlug] = React.useState('')
  const [preview, setPreview] = React.useState<string | null>(null)

  const handleFile = (f?: File) => {
    if (!f) return
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return alert('Please select a file')
    // If Supabase storage available, upload via client; otherwise use mock placeholder
    const storagePath = preview || 'https://placehold.co/600x400'
    try{
      const res = await create.mutateAsync({ title, description, slug: slug || title.toLowerCase().replace(/\s+/g,'-'), storage_path: storagePath })
      navigate(`/designs/${res.slug}`)
    }catch(err:any){
      alert(err.message || 'Upload failed')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload a design</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-silver mb-1">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 bg-gray-900 rounded" />
        </div>
        <div>
          <label className="block text-silver mb-1">Slug (optional)</label>
          <input value={slug} onChange={e=>setSlug(e.target.value)} className="w-full p-2 bg-gray-900 rounded" />
        </div>
        <div>
          <label className="block text-silver mb-1">Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-2 bg-gray-900 rounded" />
        </div>
        <div>
          <label className="block text-silver mb-1">Design file</label>
          <input type="file" onChange={e=>handleFile(e.target.files?.[0])} />
          {preview && <div className="mt-3 h-48 overflow-hidden rounded"><img src={preview} alt="preview" className="w-full h-full object-cover"/></div>}
        </div>
        <div>
          <button type="submit" className="px-4 py-2 bg-gold text-black rounded">Upload</button>
        </div>
      </form>
    </div>
  )
}
