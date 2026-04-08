import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import useRouter from '../hooks/useRouter'
import { Plus, Trash2, Edit2, AlertCircle, Search } from 'lucide-react'

export default function MedicineManagement() {
  const { user, token } = useAuth()
  const navigate = useRouter()
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'tablet'
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/unauthorized')
      return
    }
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/medicines/', {
        headers: { Authorization: `Token ${token}` }
      })
      if (!response.ok) throw new Error('Failed to fetch medicines')
      const data = await response.json()
      setMedicines(Array.isArray(data) ? data : data.results || [])
      setError('')
    } catch (err) {
      setError('Failed to load medicines')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMedicine = async (e) => {
    e.preventDefault()
    try {
      const url = editingId
        ? `http://localhost:8000/api/v1/medicines/${editingId}/`
        : 'http://localhost:8000/api/v1/medicines/'
      
      const method = editingId ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to save medicine')
      
      setFormData({ name: '', description: '', price: '', unit: 'tablet' })
      setShowForm(false)
      setEditingId(null)
      fetchMedicines()
    } catch (err) {
      setError('Failed to save medicine')
      console.error(err)
    }
  }

  const handleEdit = (medicine) => {
    setFormData(medicine)
    setEditingId(medicine.id)
    setShowForm(true)
  }

  const handleDeleteMedicine = async (medicineId) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/medicines/${medicineId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      })
      if (!response.ok) throw new Error('Failed to delete medicine')
      fetchMedicines()
    } catch (err) {
      setError('Failed to delete medicine')
      console.error(err)
    }
  }

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.description || '').toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">Medicine Management</h1>
            <p className="text-gray-600">Add, edit, or remove medicines from the system</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              if (!showForm) setFormData({ name: '', description: '', price: '', unit: 'tablet' })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h3>
            <form onSubmit={handleSaveMedicine} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
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
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500"
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="ml">ML</option>
                <option value="bottle">Bottle</option>
                <option value="box">Box</option>
              </select>
              <div className="flex gap-4">
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">
                  {editingId ? 'Update' : 'Create'} Medicine
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
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Medicines List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map(medicine => (
            <div key={medicine.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{medicine.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{medicine.description || 'No description'}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-emerald-600 font-semibold">${medicine.price || '0.00'}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">{medicine.unit}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(medicine)}
                  className="flex-1 p-2 hover:bg-blue-900/30 text-blue-400 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMedicine(medicine.id)}
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
