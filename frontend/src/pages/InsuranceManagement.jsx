import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import AdminLayout from '../components/AdminLayout';
import { Plus, Trash2, Edit2, AlertCircle, Search, Phone, Mail } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const emptyForm = {
  name: '',
  code: '',
  contact_email: '',
  contact_phone: '',
  description: '',
};

function slugCode(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 20) || 'INS';
}

export default function InsuranceManagement() {
  const { user, token } = useAuth();
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigateTo('/unauthorized');
      return;
    }
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    try {
      const response = await fetch(`${API}/insurance/providers/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch insurances');
      const data = await response.json();
      setInsurances(Array.isArray(data) ? data : data.results || []);
      setError('');
    } catch (err) {
      setError('Failed to load insurance providers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInsurance = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        code: (formData.code || slugCode(formData.name)).toUpperCase().slice(0, 20),
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || '',
        description: formData.description || '',
      };
      const url = editingId ? `${API}/insurance/providers/${editingId}/` : `${API}/insurance/providers/`;
      const method = editingId ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save insurance');

      setFormData(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchInsurances();
    } catch (err) {
      setError('Failed to save insurance provider');
      console.error(err);
    }
  };

  const handleEdit = (insurance) => {
    setFormData({
      name: insurance.name || '',
      code: insurance.code || '',
      contact_email: insurance.contact_email || '',
      contact_phone: insurance.contact_phone || '',
      description: insurance.description || '',
    });
    setEditingId(insurance.id);
    setShowForm(true);
  };

  const handleDeleteInsurance = async (insuranceId) => {
    if (!window.confirm('Are you sure you want to delete this insurance provider?')) return;

    try {
      const response = await fetch(`${API}/insurance/providers/${insuranceId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete insurance');
      fetchInsurances();
    } catch (err) {
      setError('Failed to delete insurance provider');
      console.error(err);
    }
  };

  const filteredInsurances = insurances.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout active="insurance">
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="insurance">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Insurance providers</h1>
          <p className="text-slate-600 mt-1">Codes must be unique; used across pharmacy registration.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            if (!showForm) setFormData(emptyForm);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          Add provider
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {editingId ? 'Edit provider' : 'New provider'}
          </h3>
          <form onSubmit={handleSaveInsurance} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              />
              <input
                type="text"
                placeholder="Code (e.g. RSSB) — auto if empty"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                maxLength={20}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Contact email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              />
              <input
                type="tel"
                placeholder="Contact phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              rows={3}
            />
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, code, or description…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsurances.map((insurance) => (
          <div key={insurance.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-900">{insurance.name}</h3>
              {insurance.code && (
                <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700">
                  {insurance.code}
                </span>
              )}
            </div>
            <p className="text-slate-600 text-sm mb-4">{insurance.description || 'No description'}</p>
            <div className="space-y-2 mb-4 text-sm text-slate-600">
              {insurance.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {insurance.contact_email}
                </div>
              )}
              {insurance.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {insurance.contact_phone}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEdit(insurance)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteInsurance(insurance.id)}
                className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
