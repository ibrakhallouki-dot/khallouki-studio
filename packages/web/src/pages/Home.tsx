import React from 'react'

export default function Home(){
  return (
    <main className="max-w-5xl mx-auto p-6">
      <section className="py-12">
        <h2 className="text-4xl font-playfair text-gold">Cyber-Stoic Luxury</h2>
        <p className="mt-4 text-silver">A premium design portfolio & marketplace platform powered by Drizzle, tRPC and Supabase (storage/auth TBD).</p>
      </section>

      <section className="py-6">
        <h3 className="text-2xl font-semibold text-silver mb-4">Featured designs</h3>
        <div id="featured-grid" className="grid grid-cols-3 gap-4">
          {/* The actual items are rendered in src/main.tsx via trpc-loaded content for backward compatibility with index.html entrypoint. */}
        </div>
      </section>
    </main>
  )
}
