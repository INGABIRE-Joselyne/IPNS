import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
  Shield,
  Package,
  AlertCircle,
  Power,
} from 'lucide-react';
import DashboardOverview from '../components/DashboardOverview';
import ProfileManagement from '../components/ProfileManagement';
import InsuranceManagement from '../components/DashboardInsuranceManagement';

const PharmacyDashboard = () => {
  const { user, token, logout } = useAuth();
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    fetchPharmacyData();
  }, []);

  const fetchPharmacyData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/pharmacies/profile/', {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch pharmacy');
      const data = await response.json();
      setPharmacy(data);
      setIsOpen(data.is_active ?? true);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOpen = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/pharmacies/${pharmacy.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ is_active: !isOpen }),
      });

      if (response.ok) {
        setIsOpen(!isOpen);
        setPharmacy(prev => ({ ...prev, is_active: !isOpen }));
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'insurance', label: 'Insurance Partners', icon: Shield },
    { id: 'inventory', label: 'Inventory', icon: Package },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
        </div>
      );
    }

    if (error || !pharmacy) {
      return (
        <div className="bg-red-100 border border-red-300 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-700" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700">{error || 'Failed to load pharmacy'}</p>
          </div>
        </div>
      );
    }

    const props = { pharmacy, setPharmacy, token, onRefresh: fetchPharmacyData };

    switch (activeSection) {
      case 'overview':
        return <DashboardOverview {...props} />;
      case 'profile':
        return <ProfileManagement {...props} />;
      case 'insurance':
        return <InsuranceManagement {...props} />;
      case 'inventory':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Inventory Management</h2>
            <p className="text-gray-600 mb-4">Inventory management section</p>
            <a
              href="/inventory"
              className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
            >
              Go to Inventory
            </a>
          </div>
        );
      default:
        return <DashboardOverview {...props} />;
    }
  };

  if (loading && !pharmacy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 z-40 lg:translate-x-0 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">
            {pharmacy?.name || 'Pharmacy'}
          </h1>
          <p className="text-sm text-gray-600 mt-2">Management Dashboard</p>
        </div>

        {/* Status Toggle */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleToggleOpen}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
              isOpen
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            <Power size={18} />
            {isOpen ? 'Currently Open' : 'Currently Closed'}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                  activeSection === item.id
                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-700 hover:bg-red-100 rounded-lg transition font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold text-gray-900">
                {menuItems.find(m => m.id === activeSection)?.label}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              Logged in as <span className="font-semibold text-gray-900">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-100 border border-red-300 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-700" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default PharmacyDashboard;
