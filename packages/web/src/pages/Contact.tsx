import React from 'react'

export default function Contact(){
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-playfair text-gold mb-6">Contact</h2>
      <form className="grid gap-4 text-silver">
        <input className="p-3 bg-gray-900 rounded" placeholder="Name" />
        <input className="p-3 bg-gray-900 rounded" placeholder="Email" />
        <textarea className="p-3 bg-gray-900 rounded" placeholder="Message" />
        <button className="px-4 py-2 bg-gray-800 rounded">Send</button>
      </form>
    </main>
  )
}
