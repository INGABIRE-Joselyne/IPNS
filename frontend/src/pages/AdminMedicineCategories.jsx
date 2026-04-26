import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import AdminLayout from '../components/AdminLayout';
import { Plus, Trash2, Edit2, AlertCircle, Search } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

export default function AdminMedicineCategories() {
  const { user, token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigateTo('/unauthorized');
      return;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/medicines/categories/`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.results || []);
      setError('');
    } catch (e) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${API}/medicines/categories/${editingId}/`
        : `${API}/medicines/categories/`;
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Save failed');
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      fetchCategories();
    } catch (e) {
      setError('Could not save category (admin token required)');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Medicines may lose their category link.')) return;
    try {
      const res = await fetch(`${API}/medicines/categories/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchCategories();
    } catch (e) {
      setError('Could not delete category');
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout active="categories">
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="categories">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Medicine categories</h1>
          <p className="text-slate-600 mt-1">Group catalog items (e.g. Antibiotics, Analgesics).</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '' });
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add category
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSave}
          className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900">
            {editingId ? 'Edit category' : 'New category'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
            />
            <input
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold">
              Save
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
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search categories…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
        {filtered.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <p className="font-semibold text-slate-900">{c.name}</p>
              {c.description && <p className="text-sm text-slate-600">{c.description}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setFormData({ name: c.name, description: c.description || '' });
                  setEditingId(c.id);
                  setShowForm(true);
                }}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-slate-500">No categories found.</p>
        )}
      </div>
    </AdminLayout>
  );
}
