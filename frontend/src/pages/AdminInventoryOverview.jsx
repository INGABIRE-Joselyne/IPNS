import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import AdminLayout from '../components/AdminLayout';
import { Search, AlertCircle, Package } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

export default function AdminInventoryOverview() {
  const { user, token } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigateTo('/unauthorized');
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API}/inventory/stock/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load stock');
        const data = await res.json();
        setRows(Array.isArray(data) ? data : data.results || []);
        setError('');
      } catch (e) {
        setError('Failed to load inventory');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, token]);

  const filtered = rows.filter(
    (r) =>
      (r.medicine_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.pharmacy_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.district_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout active="inventory">
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="inventory">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Inventory overview</h1>
        <p className="text-slate-600 mt-1">
          Read-only view of stock rows across all pharmacies (latest updates first).
        </p>
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
          placeholder="Filter by medicine, pharmacy, or district…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 z-10">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Medicine</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Pharmacy</th>
                <th className="px-4 py-3 font-semibold text-slate-700">District</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Qty</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Listed</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-2.5 font-medium text-slate-900">{r.medicine_name}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.pharmacy_name}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.district_name || '—'}</td>
                  <td className="px-4 py-2.5">{r.quantity}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={
                        r.is_in_stock
                          ? 'text-emerald-700 font-medium'
                          : 'text-slate-400'
                      }
                    >
                      {r.is_in_stock ? 'In stock' : 'Out'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">
                    {r.last_updated ? new Date(r.last_updated).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Package className="h-5 w-5" />
            No stock lines match your search.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
