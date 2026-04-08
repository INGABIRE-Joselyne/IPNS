import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import useRouter from '../hooks/useRouter'
import { Plus, Trash2, Edit2, AlertCircle, Search, Phone, Mail } from 'lucide-react'

export default function InsuranceManagement() {
  const { user, token } = useAuth()
  const navigate = useRouter()
  const [insurances, setInsurances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    description: ''
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/unauthorized')
      return
    }
    fetchInsurances()
  }, [])

  const fetchInsurances = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/insurance/providers/', {
        headers: { Authorization: `Token ${token}` }
      })
      if (!response.ok) throw new Error('Failed to fetch insurances')
      const data = await response.json()
      setInsurances(Array.isArray(data) ? data : data.results || [])
      setError('')
    } catch (err) {
      setError('Failed to load insurance providers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveInsurance = async (e) => {
    e.preventDefault()
    try {
      const url = editingId
        ? `http://localhost:8000/api/v1/insurance/providers/${editingId}/`
        : 'http://localhost:8000/api/v1/insurance/providers/'
      
      const method = editingId ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to save insurance')
      
      setFormData({ name: '', contact_email: '', contact_phone: '', description: '' })
      setShowForm(false)
      setEditingId(null)
      fetchInsurances()
    } catch (err) {
      setError('Failed to save insurance provider')
      console.error(err)
    }
  }

  const handleEdit = (insurance) => {
    setFormData(insurance)
    setEditingId(insurance.id)
    setShowForm(true)
  }

  const handleDeleteInsurance = async (insuranceId) => {
    if (!window.confirm('Are you sure you want to delete this insurance provider?')) return
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/insurance/providers/${insuranceId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      })
      if (!response.ok) throw new Error('Failed to delete insurance')
      fetchInsurances()
    } catch (err) {
      setError('Failed to delete insurance provider')
      console.error(err)
    }
  }

  const filteredInsurances = insurances.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Management</h1>
            <p className="text-gray-600">Add, edit, or remove insurance providers from the system</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              if (!showForm) setFormData({ name: '', contact_email: '', contact_phone: '', description: '' })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Insurance
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{editingId ? 'Edit Insurance' : 'Add New Insurance'}</h3>
            <form onSubmit={handleSaveInsurance} className="space-y-4">
              <input
                type="text"
                placeholder="Insurance Provider Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Contact Email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="tel"
                  placeholder="Contact Phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <textarea
                placeholder="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                rows="3"
              ></textarea>
              <div className="flex gap-4">
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">
                  {editingId ? 'Update' : 'Create'} Insurance
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search insurance providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Insurance List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInsurances.map(insurance => (
            <div key={insurance.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{insurance.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{insurance.description || 'No description'}</p>
              <div className="space-y-2 mb-4">
                {insurance.contact_email && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {insurance.contact_email}
                  </div>
                )}
                {insurance.contact_phone && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {insurance.contact_phone}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(insurance)}
                  className="flex-1 p-2 hover:bg-blue-900/30 text-blue-400 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteInsurance(insurance.id)}
                  className="flex-1 p-2 hover:bg-red-900/30 text-red-400 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
