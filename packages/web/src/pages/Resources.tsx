import React, { useEffect, useState } from 'react'
import { trpc } from '../lib/trpc'
import DesignCard from '../components/DesignCard'

export default function ResourcesPage(){
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{
    async function load(){
      try{
        const res = await trpc.resources.list.query({ page: 1, perPage: 12 })
        setItems(res.items ?? [])
      }catch(err){
        console.error('resources load', err)
      }
    }
    load()
  },[])

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-playfair text-gold mb-6">Resources</h2>
      <div className="grid grid-cols-3 gap-6">
        {items.map((r:any)=> (
          <article key={r.id} className="bg-gray-900 p-4 rounded">
            <h3 className="text-lg font-semibold">{r.title}</h3>
            <p className="text-sm text-silver mt-2">{r.description}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
