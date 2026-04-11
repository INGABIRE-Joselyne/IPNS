import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import AdminLayout from '../components/AdminLayout';
import { Plus, Trash2, Edit2, AlertCircle, Search } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const emptyForm = {
  name: '',
  generic_name: '',
  strength: '',
  unit: 'tablet',
  manufacturer: '',
  description: '',
  is_active: true,
  category_id: '',
};

export default function MedicineManagement() {
  const { user, token } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
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
    fetchMedicines();
    fetch(`${API}/medicines/categories/`)
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch(() => {});
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch(`${API}/medicines/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch medicines');
      const data = await response.json();
      setMedicines(Array.isArray(data) ? data : data.results || []);
      setError('');
    } catch (err) {
      setError('Failed to load medicines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buildPayload = () => {
    const payload = {
      name: formData.name,
      generic_name: formData.generic_name || '',
      strength: formData.strength || '',
      unit: formData.unit || 'tablet',
      manufacturer: formData.manufacturer || '',
      description: formData.description || '',
      is_active: !!formData.is_active,
    };
    if (formData.category_id) {
      payload.category_id = parseInt(formData.category_id, 10);
    } else {
      payload.category_id = null;
    }
    return payload;
  };

  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API}/medicines/${editingId}/` : `${API}/medicines/`;
      const method = editingId ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(buildPayload()),
      });

      if (!response.ok) throw new Error('Failed to save medicine');

      setFormData(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchMedicines();
    } catch (err) {
      setError('Failed to save medicine');
      console.error(err);
    }
  };

  const handleEdit = async (medicine) => {
    let m = medicine;
    try {
      const res = await fetch(`${API}/medicines/${medicine.id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) m = await res.json();
    } catch (_) {}
    setFormData({
      name: m.name || '',
      generic_name: m.generic_name || '',
      strength: m.strength || '',
      unit: m.unit || 'tablet',
      manufacturer: m.manufacturer || '',
      description: m.description || '',
      is_active: m.is_active !== false,
      category_id: m.category?.id != null ? String(m.category.id) : m.category_id != null ? String(m.category_id) : '',
    });
    setEditingId(medicine.id);
    setShowForm(true);
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (!window.confirm('Delete this medicine from the catalog?')) return;

    try {
      const response = await fetch(`${API}/medicines/${medicineId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete medicine');
      fetchMedicines();
    } catch (err) {
      setError('Failed to delete medicine');
      console.error(err);
    }
  };

  const filteredMedicines = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.generic_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout active="medicines">
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="medicines">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Medicines</h1>
          <p className="text-slate-600 mt-1">Maintain the national catalog (names, strengths, categories).</p>
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
          Add medicine
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
            {editingId ? 'Edit medicine' : 'New medicine'}
          </h3>
          <form onSubmit={handleSaveMedicine} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                placeholder="Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              />
              <input
                placeholder="Generic name"
                value={formData.generic_name}
                onChange={(e) => setFormData({ ...formData, generic_name: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              />
              <input
                placeholder="Strength (e.g. 500mg)"
                value={formData.strength}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              />
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="ml">ml</option>
                <option value="injection">Injection</option>
                <option value="cream">Cream</option>
                <option value="drops">Drops</option>
                <option value="inhaler">Inhaler</option>
                <option value="sachet">Sachet</option>
                <option value="infusion">Infusion</option>
              </select>
              <input
                placeholder="Manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              />
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              rows={2}
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Active in catalog
            </label>
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
          placeholder="Search medicines…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMedicines.map((medicine) => (
          <div
            key={medicine.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col"
          >
            <h3 className="text-lg font-semibold text-slate-900">{medicine.name}</h3>
            {medicine.generic_name && (
              <p className="text-sm text-slate-500 mt-0.5">{medicine.generic_name}</p>
            )}
            <p className="text-slate-600 text-sm mt-2 line-clamp-2">
              {[medicine.strength, medicine.unit].filter(Boolean).join(' · ') || '—'}
            </p>
            {medicine.category_name && (
              <span className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {medicine.category_name}
              </span>
            )}
            {medicine.is_active === false && (
              <span className="mt-2 text-xs font-semibold text-amber-700">Inactive</span>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleEdit(medicine)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMedicine(medicine.id)}
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
