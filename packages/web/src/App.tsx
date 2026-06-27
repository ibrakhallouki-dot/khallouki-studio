import React, { useEffect, useState } from 'react'
import { trpc } from './lib/trpc'

export default function App(){
  const [featured, setFeatured] = useState<any[]>([])
  useEffect(() => {
    async function load(){
      try{
        const res = await trpc.designs.list.query({ page: 1, perPage: 6 })
        setFeatured(res.items ?? [])
      }catch(err){
        console.error('tRPC error', err)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <header className="py-8 px-6 border-b border-gray-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-playfair text-gold">Khallouki Studio</h1>
          <nav>
            <a className="px-3 text-silver" href="#">Home</a>
            <a className="px-3 text-silver" href="#">Designs</a>
            <a className="px-3 text-silver" href="#">Resources</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <section className="py-12">
          <h2 className="text-4xl font-playfair text-gold">Cyber-Stoic Luxury</h2>
          <p className="mt-4 text-silver">A premium design portfolio & marketplace platform scaffold.</p>
        </section>

        <section className="grid grid-cols-3 gap-4 mt-8">
          {featured.length ? featured.map((f:any)=> (
            <article key={f.id} className="bg-gray-900 p-4 rounded">
              <div className="h-40 bg-gray-800 rounded mb-3" style={{backgroundImage: `url(${f.image_url})`, backgroundSize: 'cover'}} />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-silver mt-2">{f.description}</p>
            </article>
          )) : (
            <>
            <article className="bg-gray-900 p-4 rounded">
              <div className="h-40 bg-gray-800 rounded mb-3" />
              <h3 className="text-lg font-semibold">Featured design</h3>
              <p className="text-sm text-silver mt-2">Short description</p>
            </article>
            <article className="bg-gray-900 p-4 rounded">
              <div className="h-40 bg-gray-800 rounded mb-3" />
              <h3 className="text-lg font-semibold">Featured design</h3>
              <p className="text-sm text-silver mt-2">Short description</p>
            </article>
            <article className="bg-gray-900 p-4 rounded">
              <div className="h-40 bg-gray-800 rounded mb-3" />
              <h3 className="text-lg font-semibold">Featured design</h3>
              <p className="text-sm text-silver mt-2">Short description</p>
            </article>
            </>
          )}
        </section>
      </main>

      <footer className="py-8 mt-12 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center text-silver">© {new Date().getFullYear()} Khallouki Studio</div>
      </footer>
    </div>
  )
}
