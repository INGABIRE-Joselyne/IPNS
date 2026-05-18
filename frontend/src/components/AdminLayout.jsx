import React, { useState } from 'react';
import {
  Bell,
  Building2,
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pill,
  Shield,
  Tags,
  UserRound,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import logo from '../assets/images/LOGO.png';

const linkBase =
  'relative flex items-center gap-4 rounded-lg px-8 py-4 text-base font-medium transition-colors';

const AdminLayout = ({ children, active = 'dashboard' }) => {
  const { logout, user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'pharmacies', label: 'Pharmacies', icon: Building2, path: '/admin/pharmacies' },
    { id: 'medicines', label: 'Medicines', icon: Pill, path: '/admin/medicines' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'inventory', label: 'Orders', icon: Package, path: '/admin/inventory' },
    { id: 'categories', label: 'Categories', icon: Tags, path: '/admin/categories' },
    { id: 'insurance', label: 'Insurance', icon: Shield, path: '/admin/insurance' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  ];

  const renderNav = () => (
    <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-8">
      {nav.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMobileNavOpen(false);
              navigateTo(item.path);
            }}
            className={`${linkBase} w-full text-left ${
              isActive
                ? 'bg-blue-50 text-blue-600 shadow-[inset_5px_0_0_#1683f7]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            <Icon className="h-6 w-6 shrink-0" strokeWidth={isActive ? 2.6 : 2.2} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  const renderLogout = () => (
    <div className="border-t border-slate-200 px-4 py-8">
      <button
        type="button"
        onClick={() => {
          setMobileNavOpen(false);
          logout();
          navigateTo('/login');
        }}
        className={`${linkBase} w-full text-left text-red-500 hover:bg-red-50`}
      >
        <LogOut className="h-6 w-6 shrink-0" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden w-[292px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-28 items-center px-9">
          <img src={logo} alt="IPNS Logo" className="h-14 w-14 object-contain" />
          <div className="ml-3 min-w-0">
            <p className="text-4xl font-bold leading-none text-blue-950">INPS</p>
            <p className="mt-1 text-[11px] font-medium text-slate-500">Inter Pharmacy Network System</p>
          </div>
        </div>
        {renderNav()}
        {renderLogout()}
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative flex h-full w-[292px] max-w-[86vw] flex-col border-r border-slate-200 bg-white shadow-2xl">
            <div className="flex h-24 items-center px-7">
              <img src={logo} alt="IPNS Logo" className="h-12 w-12 object-contain" />
              <div className="ml-3 min-w-0">
                <p className="text-3xl font-bold leading-none text-blue-950">INPS</p>
                <p className="mt-1 text-[10px] font-medium text-slate-500">Inter Pharmacy Network System</p>
              </div>
            </div>
            {renderNav()}
            {renderLogout()}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur lg:px-10">
          <div className="flex items-center gap-7">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="hidden h-10 w-10 items-center justify-center rounded-lg text-slate-700 lg:inline-flex">
              <Menu className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-semibold text-slate-950">Dashboard</h1>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                3
              </span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 rounded-full px-1 py-1 text-slate-950 hover:bg-slate-100"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-950">
                <UserRound className="h-8 w-8" />
              </span>
              <span className="hidden text-base font-medium sm:inline">{user?.first_name || 'Admin'}</span>
              <ChevronDown className="hidden h-4 w-4 sm:block" />
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-[1320px] px-5 py-10 lg:px-10">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
