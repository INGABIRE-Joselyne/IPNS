import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Pill,
  Tags,
  Shield,
  Users,
  Package,
  BarChart3,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';

const linkBase =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors';

const AdminLayout = ({ children, active = 'dashboard' }) => {
  const { logout, user } = useAuth();

  const nav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'pharmacies', label: 'Pharmacies', icon: Building2, path: '/admin/pharmacies' },
    { id: 'medicines', label: 'Medicines', icon: Pill, path: '/admin/medicines' },
    { id: 'categories', label: 'Medicine categories', icon: Tags, path: '/admin/categories' },
    { id: 'insurance', label: 'Insurance', icon: Shield, path: '/admin/insurance' },
    { id: 'inventory', label: 'Inventory (all)', icon: Package, path: '/admin/inventory' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">IPNS</p>
          <h1 className="text-lg font-bold text-slate-900">Admin</h1>
          {user?.email && <p className="text-xs text-slate-500 truncate mt-1">{user.email}</p>}
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.path)}
                className={`${linkBase} w-full text-left ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-80" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-200 space-y-1">
          <a
            href="/"
            className={`${linkBase} text-slate-600 hover:bg-slate-100`}
          >
            <ExternalLink className="h-5 w-5 shrink-0" />
            Public site
          </a>
          <button
            type="button"
            onClick={() => {
              logout();
              navigateTo('/login');
            }}
            className={`${linkBase} w-full text-left text-red-700 hover:bg-red-50`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
