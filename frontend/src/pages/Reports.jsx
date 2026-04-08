import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import useRouter from '../hooks/useRouter'
import { BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react'

export default function Reports() {
  const { user, token } = useAuth()
  const navigate = useRouter()
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/unauthorized')
      return
    }
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      const [pharmaciesRes, medicinesRes, inventoryRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/pharmacies/', {
          headers: { Authorization: `Token ${token}` }
        }),
        fetch('http://localhost:8000/api/v1/medicines/', {
          headers: { Authorization: `Token ${token}` }
        }),
        fetch('http://localhost:8000/api/v1/inventory/stock/', {
          headers: { Authorization: `Token ${token}` }
        })
      ])

      const pharmacies = await pharmaciesRes.json()
      const medicines = await medicinesRes.json()
      const inventory = await inventoryRes.json()

      const pharmaciesData = Array.isArray(pharmacies) ? pharmacies : pharmacies.results || []
      const medicinesData = Array.isArray(medicines) ? medicines : medicines.results || []
      const inventoryData = Array.isArray(inventory) ? inventory : inventory.results || []

      setReportData({
        totalPharmacies: pharmaciesData.length,
        activePharmacies: pharmaciesData.filter(p => p.is_active).length,
        totalMedicines: medicinesData.length,
        totalInventoryValue: inventoryData.reduce((sum, i) => sum + (parseFloat(i.price) * i.quantity), 0),
        lowStockItems: inventoryData.filter(i => i.quantity < 10).length,
        medicines: medicinesData
      })
      setError('')
    } catch (err) {
      setError('Failed to load report data')
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

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto bg-red-100 border border-red-300 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-700" />
          <p className="text-red-700">{error || 'Failed to load reports'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">System-wide statistics and insights</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Pharmacies</p>
                <p className="text-3xl font-bold text-gray-900">{reportData.totalPharmacies}</p>
                <p className="text-xs text-emerald-600 mt-1">{reportData.activePharmacies} active</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Medicines</p>
                <p className="text-3xl font-bold text-gray-900">{reportData.totalMedicines}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Inventory Value</p>
                <p className="text-3xl font-bold text-gray-900">${reportData.totalInventoryValue.toFixed(2)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock Items</p>
                <p className="text-3xl font-bold text-orange-600">{reportData.lowStockItems}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Medicines */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Medicines Catalog</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Medicine Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.medicines.slice(0, 10).map(medicine => (
                  <tr key={medicine.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-900">{medicine.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{medicine.description || 'N/A'}</td>
                    <td className="px-6 py-4 text-emerald-600 font-semibold">${parseFloat(medicine.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{medicine.unit}</td>
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
