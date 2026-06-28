import React from 'react'

export default function Footer(){
  return (
    <footer className="py-8 mt-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto text-center text-silver">© {new Date().getFullYear()} Khallouki Studio</div>
    </footer>
  )
}
