import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { trpc } from '../lib/trpc'

export default function DesignDetail(){
  const { slug } = useParams()
  const [design, setDesign] = useState<any | null>(null)
  useEffect(()=>{
    if(!slug) return
    let cancelled = false
    async function load(){
      try{
        const res = await trpc.designs.getBySlug.query({ slug })
        if(!cancelled) setDesign(res.design)
        // record view
        if(res.design?.id) await trpc.designs.incrementView.mutate({ designId: res.design.id })
      }catch(err){
        console.error('design load error', err)
      }
    }
    load()
    return ()=>{ cancelled = true }
  },[slug])

  if(!design) return <div className="p-6 text-silver">Loading...</div>

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-900 rounded p-6">
        <div className="h-96 bg-gray-800 rounded mb-6 bg-cover bg-center" style={{ backgroundImage: `url(${design.image_url})` }} />
        <h1 className="text-4xl font-playfair text-gold">{design.title}</h1>
        <p className="text-silver mt-4">{design.description}</p>
        <div className="mt-6 flex gap-4">
          <button className="px-4 py-2 bg-gray-800 rounded">Like</button>
          <button className="px-4 py-2 bg-gray-800 rounded">Favorite</button>
          <button className="px-4 py-2 bg-gray-800 rounded">Download</button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <div className="mt-4 text-silver">Comments UI will call interactions.comment (auth required)</div>
      </section>
    </main>
  )
}
