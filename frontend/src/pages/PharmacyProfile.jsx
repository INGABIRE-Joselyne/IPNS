import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import useRouter from '../hooks/useRouter'
import { Edit2, Phone, Mail, MapPin, Clock, AlertCircle, Upload, X } from 'lucide-react'

export default function PharmacyProfile() {
  const { user, token } = useAuth()
  const navigate = useRouter()
  const [pharmacy, setPharmacy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({})
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchPharmacyProfile()
  }, [])

  const fetchPharmacyProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/pharmacies/profile/', {
        headers: { Authorization: `Token ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch pharmacy')
      const data = await response.json()
      setPharmacy(data)
      setFormData(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearLogoPreview = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleSave = async () => {
    try {
      // Create FormData for multipart file upload
      const data = new FormData()
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key])
        }
      })
      
      // Add logo file if selected
      if (logoFile) {
        data.append('logo', logoFile)
      }

      const response = await fetch(`http://localhost:8000/api/v1/pharmacies/${pharmacy.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: data
      })

      if (!response.ok) throw new Error('Failed to update pharmacy')
      const updatedPharmacy = await response.json()
      setPharmacy(updatedPharmacy)
      setFormData(updatedPharmacy)
      setEditing(false)
      setLogoFile(null)
      setLogoPreview(null)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto bg-red-100 border border-red-300 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-700" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700">{error || 'Failed to load pharmacy profile'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pharmacy.name}</h1>
            <p className="text-gray-600">Pharmacy Details</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
          >
            <Edit2 className="w-4 h-4" />
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-6 shadow-sm">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy Name</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold text-lg">{pharmacy.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <span className="text-gray-900">{pharmacy.email}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                {editing ? (
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <span className="text-gray-900">{pharmacy.phone_number}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                {editing ? (
                  <input
                    type="text"
                    name="street_address"
                    value={formData.street_address || ''}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <span className="text-gray-900">{pharmacy.street_address || 'Not specified'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Pharmacy Logo */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pharmacy Logo</h3>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Current Logo Preview */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-3">Current Logo</p>
                <div className="w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {pharmacy.logo ? (
                    <img src={pharmacy.logo} alt={pharmacy.name} className="h-full w-auto object-contain p-4" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Section */}
              {editing && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {logoPreview ? 'New Logo Preview' : 'Upload Logo'}
                  </p>
                  <div className="w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative group cursor-pointer hover:bg-gray-50 transition">
                    {logoPreview ? (
                      <>
                        <img src={logoPreview} alt="Logo preview" className="h-full w-auto object-contain p-4" />
                        <button
                          onClick={clearLogoPreview}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex items-center justify-center cursor-pointer">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm font-medium">Click to upload</p>
                          <p className="text-gray-500 text-xs">PNG, JPG, GIF (max 5MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {logoFile && (
                    <p className="text-sm text-emerald-600 mt-2">✓ {logoFile.name}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Operating Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                {editing ? (
                  <input
                    type="time"
                    name="opening_time"
                    value={formData.opening_time || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{pharmacy.opening_time}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                {editing ? (
                  <input
                    type="time"
                    name="closing_time"
                    value={formData.closing_time || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold">{pharmacy.closing_time}</p>
                )}
              </div>
            </div>
          </div>

          {/* Activity Status */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Pharmacy Status</h4>
                <p className="text-gray-600 text-sm">Currently {pharmacy.is_active ? 'Active' : 'Inactive'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${pharmacy.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {pharmacy.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="border-t border-gray-200 pt-6 flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setFormData(pharmacy)
                  setLogoFile(null)
                  setLogoPreview(null)
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
