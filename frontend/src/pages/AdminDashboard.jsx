import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import useRouter from '../hooks/useRouter'
import { Users, Package, DollarSign, AlertCircle, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const navigate = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/unauthorized')
      return
    }
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const [pharmaciesRes, medicinesRes, insuranceRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/pharmacies/?limit=1', {
          headers: { Authorization: `Token ${token}` }
        }),
        fetch('http://localhost:8000/api/v1/medicines/?limit=1', {
          headers: { Authorization: `Token ${token}` }
        }),
        fetch('http://localhost:8000/api/v1/insurance/providers/?limit=1', {
          headers: { Authorization: `Token ${token}` }
        })
      ])

      const pharmacies = await pharmaciesRes.json()
      const medicines = await medicinesRes.json()
      const insurance = await insuranceRes.json()

      setStats({
        pharmacies: pharmacies.count || 0,
        medicines: medicines.count || 0,
        insurances: insurance.count || 0,
        users: 0
      })
      setError('')
    } catch (err) {
      setError('Failed to load statistics')
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

  const statCards = [
    { label: 'Total Pharmacies', value: stats?.pharmacies || 0, icon: Package, color: 'emerald' },
    { label: 'Total Medicines', value: stats?.medicines || 0, icon: DollarSign, color: 'blue' },
    { label: 'Insurance Providers', value: stats?.insurances || 0, icon: TrendingUp, color: 'purple' },
    { label: 'Users', value: stats?.users || 0, icon: Users, color: 'orange' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System Overview & Management</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => {
            const Icon = card.icon
            const colors = {
              emerald: 'from-emerald-500 to-emerald-600',
              blue: 'from-blue-500 to-blue-600',
              purple: 'from-purple-500 to-purple-600',
              orange: 'from-orange-500 to-orange-600'
            }
            
            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${colors[card.color]} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Management Links */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-left transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-600">Manage users and roles</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/medicines')}
              className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-left transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Medicine Management</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove medicines</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/insurance')}
              className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-left transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Insurance Management</h3>
                  <p className="text-sm text-gray-600">Manage insurance providers</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-left transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reports</h3>
                  <p className="text-sm text-gray-600">View system reports and analytics</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
