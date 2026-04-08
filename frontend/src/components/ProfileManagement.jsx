import React, { useState } from 'react';
import { AlertCircle, Upload, X, Clock, Edit2, Phone, Mail, MapPin } from 'lucide-react';

const ProfileManagement = ({ pharmacy, setPharmacy, token, onRefresh }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(pharmacy);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogoPreview = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSave = async () => {
    try {
      setError('');
      setLoading(true);

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && key !== 'insurance_providers' && key !== 'id' && key !== 'logo') {
          data.append(key, formData[key]);
        }
      });

      if (logoFile) {
        data.append('logo', logoFile);
      }

      const response = await fetch(`http://localhost:8000/api/v1/pharmacies/${pharmacy.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: data
      });

      if (!response.ok) throw new Error('Failed to update pharmacy');
      const updatedPharmacy = await response.json();
      setPharmacy(updatedPharmacy);
      setFormData(updatedPharmacy);
      setEditing(false);
      setLogoFile(null);
      setLogoPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(pharmacy);
    setLogoFile(null);
    setLogoPreview(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
          <p className="text-gray-600 mt-1">Update your pharmacy information</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition font-semibold"
        >
          <Edit2 className="w-4 h-4" />
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 flex items-center gap-3">
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
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <p className="text-gray-900 font-semibold text-lg">{pharmacy.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </span>
            </label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <p className="text-gray-900 font-semibold">{pharmacy.email || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </span>
            </label>
            {editing ? (
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <p className="text-gray-900 font-semibold">{pharmacy.phone_number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </span>
            </label>
            {editing ? (
              <input
                type="text"
                name="street_address"
                value={formData.street_address || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <p className="text-gray-900 font-semibold">{pharmacy.street_address || 'Not provided'}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          {editing ? (
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500"
            />
          ) : (
            <p className="text-gray-900 whitespace-pre-wrap">{pharmacy.description || 'No description provided'}</p>
          )}
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
                {logoFile && <p className="text-sm text-emerald-600 mt-2">✓ {logoFile.name}</p>}
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

        {/* Action Buttons */}
        {editing && (
          <div className="border-t border-gray-200 pt-6 flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileManagement;
