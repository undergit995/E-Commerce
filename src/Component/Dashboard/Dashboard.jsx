import React from 'react'

export default function Dashboard() {


    
function Orders() {
    const orders=["32",'324']
    const [filter, setFilter] = useState("All");
    const statuses = ["All", "Delivered", "Shipped", "Processing"];
    const filtered = filter === "All" ? orders : orders.filter(o => o === filter);
}
  return (
    <div>
        <aside>
            <ul>
                <li>Profile</li>
            </ul>
        </aside>

        <main>
            
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
                <div className="flex gap-2">
                    {statuses.map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                filter === s ? 'bg-slate-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filtered.map(order => {
                    const sc = statusColors[order.status];
                    return (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
                            <img src={order.image} alt={order.item} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-gray-900">{order.item}</p>
                                </div>
                                <p className="text-sm text-gray-500">{order.brand} · {order.id}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-bold text-gray-900">{formatPrice(order.price)}</p>
                                <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        </main>
    </div>
  )
}
