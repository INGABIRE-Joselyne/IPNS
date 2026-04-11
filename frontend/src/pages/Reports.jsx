import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import AdminLayout from '../components/AdminLayout';
import { BarChart3, TrendingUp, Building2, AlertCircle, Package } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

export default function Reports() {
  const { user, token } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigateTo('/unauthorized');
      return;
    }
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const headers = { Authorization: `Token ${token}` };
      const [pharmaciesRes, medicinesRes, inventoryRes] = await Promise.all([
        fetch(`${API}/pharmacies/`, { headers }),
        fetch(`${API}/medicines/`, { headers }),
        fetch(`${API}/inventory/stock/`, { headers }),
      ]);

      const pharmacies = await pharmaciesRes.json();
      const medicines = await medicinesRes.json();
      const inventory = await inventoryRes.json();

      const pharmaciesData = Array.isArray(pharmacies) ? pharmacies : pharmacies.results || [];
      const medicinesData = Array.isArray(medicines) ? medicines : medicines.results || [];
      const inventoryData = Array.isArray(inventory) ? inventory : inventory.results || [];

      const totalInventoryValue = inventoryData.reduce((sum, i) => {
        const p = parseFloat(i.price);
        const q = Number(i.quantity) || 0;
        if (!Number.isFinite(p)) return sum;
        return sum + p * q;
      }, 0);

      setReportData({
        totalPharmacies: pharmaciesData.length,
        activePharmacies: pharmaciesData.filter((p) => p.is_active).length,
        totalMedicines: medicinesData.length,
        totalStockLines: inventoryData.length,
        totalInventoryValue,
        lowStockItems: inventoryData.filter((i) => (Number(i.quantity) || 0) < 10).length,
        medicines: medicinesData,
      });
      setError('');
    } catch (err) {
      setError('Failed to load report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout active="reports">
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  if (!reportData) {
    return (
      <AdminLayout active="reports">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex items-center gap-3 text-red-800">
          <AlertCircle className="w-6 h-6 shrink-0" />
          {error || 'Failed to load reports'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="reports">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-1">Aggregated counts from live API data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Pharmacies</p>
              <p className="text-3xl font-bold text-slate-900">{reportData.totalPharmacies}</p>
              <p className="text-xs text-emerald-600 mt-1">{reportData.activePharmacies} active</p>
            </div>
            <div className="rounded-xl bg-blue-100 p-3">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Catalog medicines</p>
              <p className="text-3xl font-bold text-slate-900">{reportData.totalMedicines}</p>
            </div>
            <div className="rounded-xl bg-emerald-100 p-3">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Stock lines</p>
              <p className="text-3xl font-bold text-slate-900">{reportData.totalStockLines}</p>
              <p className="text-xs text-slate-500 mt-1">
                Indicative value {Math.round(reportData.totalInventoryValue).toLocaleString()} RWF
              </p>
            </div>
            <div className="rounded-xl bg-violet-100 p-3">
              <BarChart3 className="w-6 h-6 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Low stock (&lt;10)</p>
              <p className="text-3xl font-bold text-amber-600">{reportData.lowStockItems}</p>
            </div>
            <div className="rounded-xl bg-amber-100 p-3">
              <Package className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Sample of catalog (first 15)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Generic</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Strength</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.medicines.slice(0, 15).map((medicine) => (
                <tr key={medicine.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-slate-900 font-medium">{medicine.name}</td>
                  <td className="px-4 py-3 text-slate-600">{medicine.generic_name || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{medicine.strength || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{medicine.unit || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
