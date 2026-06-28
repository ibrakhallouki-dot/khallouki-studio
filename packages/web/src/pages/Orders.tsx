import React from 'react'
import { trpc } from '../lib/trpc'

export default function Orders(){
  const userQ = trpc.users.current.useQuery()
  const [orders, setOrders] = React.useState<any[]>([])
  const ordersQ = trpc.orders.getByUser.useQuery({ user_id: userQ.data?.id || 1 }, { enabled: !!userQ.data })

  React.useEffect(()=>{
    if (ordersQ.data) setOrders(ordersQ.data)
  },[ordersQ.data])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-silver">You have no orders yet. Request a custom design from a creator.</div>
      ) : (
        <div className="grid gap-3">
          {orders.map(o=> (
            <div key={o.id} className="p-3 bg-gray-900 rounded">Order #{o.id} — Status: {o.status}</div>
          ))}
        </div>
      )}
    </div>
  )
}
