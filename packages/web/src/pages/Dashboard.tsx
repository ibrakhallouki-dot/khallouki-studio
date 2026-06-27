import React from 'react'

export default function Dashboard(){
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-playfair text-gold mb-6">User Dashboard</h2>
      <p className="text-silver">Profile, My Designs, Favorites, Download History — data fetched from tRPC (auth TODO)</p>
    </main>
  )
}
