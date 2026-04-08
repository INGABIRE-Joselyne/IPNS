import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import useRouter from '../hooks/useRouter'
import { AlertCircle, BarChart3, Package } from 'lucide-react'

export default function InventoryDetail() {
  const { user, token } = useRouter()
  const navigate = useRouter()
  const [inventory, setInventory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/inventory/stock/', {
        headers: { Authorization: `Token ${token}` }
      })
      if (!response.ok) throw new Error('Failed to fetch inventory')
      const data = await response.json()
      setInventory(Array.isArray(data) ? data : data.results || [])
      setError('')
    } catch (err) {
      setError('Failed to load inventory details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Details</h1>
          <p className="text-gray-600">Complete medicine and stock information</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Inventory Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Medicines</p>
                <p className="text-3xl font-bold text-gray-900">{inventory?.length || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock Items</p>
                <p className="text-3xl font-bold text-orange-600">
                  {inventory?.filter(i => i.quantity < 10).length || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Stock Value</p>
                <p className="text-3xl font-bold text-emerald-600">
                  ${inventory?.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2) || 0}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Medicine</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Unit Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Total Value</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {inventory?.map(item => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 text-white">{item.medicine_name || item.medicine}</td>
                    <td className="px-6 py-4 text-white font-semibold">{item.quantity}</td>
                    <td className="px-6 py-4 text-emerald-400">${parseFloat(item.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-white">${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.quantity < 10
                          ? 'bg-red-900/30 text-red-400'
                          : item.quantity < 50
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-green-900/30 text-green-400'
                      }`}>
                        {item.quantity < 10 ? 'Low' : item.quantity < 50 ? 'Medium' : 'High'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
