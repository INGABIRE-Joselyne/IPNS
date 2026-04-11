import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import AdminLayout from '../components/AdminLayout';
import {
  Building2,
  Pill,
  Shield,
  Users,
  Package,
  BarChart3,
  AlertCircle,
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigateTo('/unauthorized');
      return;
    }
    (async () => {
      try {
        const headers = { Authorization: `Token ${token}` };
        const [phRes, medRes, insRes, usrRes, stockRes] = await Promise.all([
          fetch(`${API}/pharmacies/`, { headers }),
          fetch(`${API}/medicines/`, { headers }),
          fetch(`${API}/insurance/providers/`, { headers }),
          fetch(`${API}/auth/admin/users/`, { headers }),
          fetch(`${API}/inventory/stock/`, { headers }),
        ]);

        const ph = await phRes.json();
        const med = await medRes.json();
        const ins = await insRes.json();
        const usr = await usrRes.json();
        const st = await stockRes.json();

        const len = (data) => (Array.isArray(data) ? data.length : data.count || 0);

        setStats({
          pharmacies: len(ph),
          medicines: len(med),
          insurances: len(ins),
          users: usrRes.ok ? len(usr) : 0,
          stockLines: stRes.ok ? len(st) : 0,
        });
        if (!usrRes.ok) {
          setError('Could not load user counts (check admin API).');
        } else {
          setError('');
        }
      } catch (e) {
        setError('Failed to load statistics');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, token]);

  if (loading) {
    return (
      <AdminLayout active="dashboard">
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  const cards = [
    { label: 'Pharmacies', value: stats?.pharmacies ?? 0, icon: Building2, path: '/admin/pharmacies', color: 'emerald' },
    { label: 'Medicines (catalog)', value: stats?.medicines ?? 0, icon: Pill, path: '/admin/medicines', color: 'blue' },
    { label: 'Insurance providers', value: stats?.insurances ?? 0, icon: Shield, path: '/admin/insurance', color: 'purple' },
    { label: 'User accounts', value: stats?.users ?? 0, icon: Users, path: '/admin/users', color: 'orange' },
    { label: 'Stock lines (all)', value: stats?.stockLines ?? 0, icon: Package, path: '/admin/inventory', color: 'teal' },
  ];

  const colorMap = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    teal: 'from-teal-500 to-teal-600',
  };

  return (
    <AdminLayout active="dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">System overview</h1>
        <p className="text-slate-600 mt-1">
          Manage pharmacies, catalog, insurance, users, and monitor inventory from the sidebar.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => navigateTo(card.path)}
              className="text-left rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
                </div>
                <div className={`rounded-xl bg-gradient-to-br p-3 ${colorMap[card.color]}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Quick actions</h2>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          Use the left navigation for full CRUD screens. Run backend seed scripts to load locations,
          insurances, and the national medicine catalog when setting up a new environment.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('/reports')}
          className="rounded-lg bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-800"
        >
          Open reports
        </button>
      </div>
    </AdminLayout>
  );
}
