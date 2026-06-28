import React from 'react'

export default function EmptyState({ title, subtitle, action }: { title: string, subtitle?: string, action?: React.ReactNode }){
  return (
    <div className="text-center py-16">
      <div className="text-4xl font-semibold mb-4">{title}</div>
      {subtitle && <p className="text-silver mb-6">{subtitle}</p>}
      {action}
    </div>
  )
}
