import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Link,
  Pill,
  ShoppingCart,
  Store,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import AdminLayout from '../components/AdminLayout';

const API = 'http://localhost:8000/api/v1';

const countItems = (data) => {
  if (Array.isArray(data)) return data.length;
  if (typeof data?.count === 'number') return data.count;
  if (Array.isArray(data?.results)) return data.results.length;
  return 0;
};

const fetchCount = async (url, headers) => {
  const response = await fetch(url, { headers });
  if (!response.ok) return { count: 0, ok: false };

  const data = await response.json();
  return { count: countItems(data), ok: true };
};

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    pharmacies: 0,
    medicines: 0,
    categories: 0,
    insurances: 0,
    users: 0,
    stockLines: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigateTo('/unauthorized');
      return;
    }

    const loadStats = async () => {
      setLoading(true);
      setError('');

      try {
        const headers = { Authorization: `Token ${token}` };
        const [pharmacies, medicines, categories, insurances, users, stockLines] = await Promise.all([
          fetchCount(`${API}/pharmacies/`, headers),
          fetchCount(`${API}/medicines/`, headers),
          fetchCount(`${API}/medicines/categories/`, headers),
          fetchCount(`${API}/insurance/providers/`, headers),
          fetchCount(`${API}/auth/admin/users/`, headers),
          fetchCount(`${API}/inventory/stock/`, headers),
        ]);

        setStats({
          pharmacies: pharmacies.count,
          medicines: medicines.count,
          categories: categories.count,
          insurances: insurances.count,
          users: users.count,
          stockLines: stockLines.count,
        });

        if (!users.ok) {
          setError('Dashboard loaded, but user count could not be read. Check admin API permissions.');
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
        setError('Failed to load dashboard statistics. Make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, token]);

  const statCards = useMemo(
    () => [
      {
        label: 'Total Pharmacies',
        value: stats.pharmacies,
        icon: Store,
        path: '/admin/pharmacies',
        tone: 'text-blue-600',
        halo: 'bg-blue-100',
        accent: 'bg-blue-500',
      },
      {
        label: 'Total Medicines',
        value: stats.medicines,
        icon: Pill,
        path: '/admin/medicines',
        tone: 'text-emerald-600',
        halo: 'bg-emerald-100',
        accent: 'bg-emerald-500',
      },
      {
        label: 'Total Users',
        value: stats.users,
        icon: Users,
        path: '/admin/users',
        tone: 'text-violet-600',
        halo: 'bg-violet-100',
        accent: 'bg-violet-500',
      },
      {
        label: 'Orders Today',
        value: stats.stockLines,
        icon: ShoppingCart,
        path: '/admin/inventory',
        tone: 'text-orange-500',
        halo: 'bg-orange-100',
        accent: 'bg-orange-500',
      },
    ],
    [stats]
  );

  const activityItems = [
    {
      icon: Store,
      tone: 'bg-blue-100 text-blue-600',
      activity: `Network includes ${stats.pharmacies.toLocaleString()} pharmacies`,
      date: 'Today',
    },
    {
      icon: Link,
      tone: 'bg-emerald-100 text-emerald-600',
      activity: `${stats.medicines.toLocaleString()} medicines available in the catalog`,
      date: 'Today',
    },
    {
      icon: Users,
      tone: 'bg-violet-100 text-violet-600',
      activity: `${stats.users.toLocaleString()} users registered on INPS`,
      date: 'Today',
    },
    {
      icon: ShoppingCart,
      tone: 'bg-orange-100 text-orange-500',
      activity: `${stats.stockLines.toLocaleString()} inventory stock records tracked`,
      date: 'Today',
    },
    {
      icon: Building2,
      tone: 'bg-blue-100 text-blue-600',
      activity: `${stats.categories.toLocaleString()} medicine categories and ${stats.insurances.toLocaleString()} insurance providers configured`,
      date: 'Today',
    },
  ];

  return (
    <AdminLayout active="dashboard">
      <div className="mb-9">
        <h2 className="text-3xl font-bold text-slate-950">Welcome back, Admin!</h2>
        <p className="mt-3 text-lg text-slate-600">Here&apos;s what&apos;s happening with your pharmacy network.</p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center rounded-xl border border-slate-200 bg-white py-24 shadow-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.label}
                  type="button"
                  onClick={() => navigateTo(card.path)}
                  className="group relative min-h-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-7 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`absolute inset-x-0 bottom-0 h-1.5 ${card.accent}`} />
                  <div className="flex items-center gap-6">
                    <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${card.halo}`}>
                      <Icon className={`h-9 w-9 ${card.tone}`} strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-medium text-slate-700">{card.label}</p>
                      <p className="mt-5 text-4xl font-bold tracking-normal text-slate-950">
                        {card.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Recent Activity</h2>
            <div className="mt-6 overflow-hidden">
              <div className="grid grid-cols-[1fr_auto] bg-slate-100 px-3 py-4 text-base font-semibold text-slate-950 sm:px-4">
                <span>Activity</span>
                <span className="hidden min-w-64 sm:block">Date</span>
              </div>

              <div className="divide-y divide-slate-200">
                {activityItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.activity} className="grid grid-cols-1 gap-3 px-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-4">
                      <div className="flex min-w-0 items-center gap-6">
                        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.tone}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-base text-slate-800">{item.activity}</span>
                      </div>
                      <span className="pl-16 text-sm text-slate-600 sm:min-w-64 sm:pl-0 sm:text-base">{item.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-slate-200 pt-4 text-center">
              <button
                type="button"
                onClick={() => navigateTo('/reports')}
                className="rounded-lg px-4 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
              >
                View all activity
              </button>
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}
