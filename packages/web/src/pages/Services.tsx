import React from 'react'

export default function Services(){
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-playfair text-gold">Services</h1>
      <p className="text-silver mt-3">We offer premium design services including custom UI/UX, brand identity, and high-end visual assets tailored for luxury brands.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-4 bg-gray-900 rounded">
          <h3 className="text-xl font-semibold">Custom Branding</h3>
          <p className="text-silver mt-2">Full brand identity including logos, type, and visual systems.</p>
        </div>
        <div className="p-4 bg-gray-900 rounded">
          <h3 className="text-xl font-semibold">UI/UX Design</h3>
          <p className="text-silver mt-2">Product and interface design for web and mobile platforms.</p>
        </div>
        <div className="p-4 bg-gray-900 rounded">
          <h3 className="text-xl font-semibold">Design Licensing</h3>
          <p className="text-silver mt-2">License premium designs and assets for commercial use.</p>
        </div>
      </div>
    </div>
  )
}
