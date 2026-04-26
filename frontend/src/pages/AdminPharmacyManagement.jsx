import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import AdminLayout from '../components/AdminLayout';
import { Search, AlertCircle, Building2, ExternalLink, Power } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

export default function AdminPharmacyManagement() {
  const { user, token } = useAuth();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigateTo('/unauthorized');
      return;
    }
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const res = await fetch(`${API}/pharmacies/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load pharmacies');
      const data = await res.json();
      setPharmacies(Array.isArray(data) ? data : data.results || []);
      setError('');
    } catch (e) {
      setError('Failed to load pharmacies');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (pharmacy) => {
    try {
      const res = await fetch(`${API}/pharmacies/${pharmacy.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ is_active: !pharmacy.is_active }),
      });
      if (!res.ok) throw new Error('Update failed');
      fetchPharmacies();
    } catch (e) {
      setError('Could not update pharmacy status');
    }
  };

  const filtered = pharmacies.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.district_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.owner_email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout active="pharmacies">
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="pharmacies">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pharmacies</h1>
          <p className="text-slate-600 mt-1">
            View all registered outlets, owner accounts, and activation status.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search by name, district, or owner email…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Pharmacy</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Location</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Owner</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Phone</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-slate-900">
                      <Building2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      {p.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {[p.sector_name, p.district_name, p.province_name].filter(Boolean).join(' · ') ||
                      '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{p.owner_email || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.phone_number || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <a
                      href={`/pharmacies/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Public
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleActive(p)}
                      className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium ml-2"
                    >
                      <Power className="h-4 w-4" />
                      {p.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-slate-500">No pharmacies match your search.</p>
        )}
      </div>
    </AdminLayout>
  );
}
