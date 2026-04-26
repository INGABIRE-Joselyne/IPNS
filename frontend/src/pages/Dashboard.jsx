import React, { useState, useEffect } from 'react';
import { Power, TrendingUp, AlertCircle, Eye, LogOut, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { StatCard, LoadingSpinner } from '../components/Cards';

const Dashboard = () => {
  const [pharmacy, setPharmacy] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    medicines_listed: 0,
    low_stock_count: 0,
    profile_completion: 85,
  });
  const { user, token, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/pharmacies/profile/', {
        headers: { Authorization: `Token ${token}` }
      });

      if (!response.ok) {
        console.error('Profile fetch error:', response.status, response.statusText);
        const errorData = await response.json().catch(() => null);
        console.error('Error data:', errorData);
        throw new Error(`Failed to fetch pharmacy profile: ${response.status}`);
      }

      const data = await response.json();
      console.log('Pharmacy profile loaded:', data);
      setPharmacy(data);
      setIsOpen(data.is_active ?? true);

      // Fetch inventory stats
      const stockResponse = await fetch(
        `http://localhost:8000/api/v1/inventory/stock/?pharmacy_id=${data.id}`,
        { headers: { Authorization: `Token ${token}` } }
      );

      if (stockResponse.ok) {
        const stockData = await stockResponse.json();
        const lowStock = stockData.results?.filter(s => s.quantity < 10).length || 0;
        setStats({
          medicines_listed: stockData.count || 0,
          low_stock_count: lowStock,
          profile_completion: 85,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
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
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({ is_active: !isOpen })
      });

      if (response.ok) {
        setIsOpen(!isOpen);
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-gray-900 font-bold text-xl">{pharmacy?.name}</h1>
          <div className="flex gap-3">
            <a
              href="/settings"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm transition-colors border border-gray-300"
            >
              <Settings size={18} />
              Settings
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm transition-colors border border-red-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Greeting & Status Toggle */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name ? user.name.split(' ')[0] : 'Manager'}</h2>
            <p className="text-gray-600">Here's what's happening at your pharmacy today</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-4">Pharmacy Status</p>
            <button
              onClick={handleToggleOpen}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded font-semibold transition-colors mb-2 ${
                isOpen
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              <Power size={20} />
              {isOpen ? 'Currently Open' : 'Currently Closed'}
            </button>
            <p className="text-gray-500 text-xs">Click to toggle status</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={BarChart3}
            label="Medicines Listed"
            value={stats.medicines_listed}
            trend="Up to date"
          />
          <StatCard
            icon={AlertCircle}
            label="Low Stock Items"
            value={stats.low_stock_count}
            trend="Review soon"
          />
          <StatCard
            icon={Eye}
            label="Profile Completion"
            value={`${stats.profile_completion}%`}
            trend="Almost complete"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a
            href="/inventory"
            className="bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-lg rounded-lg p-6 transition-all group"
          >
            <h3 className="text-gray-900 font-semibold text-lg mb-2 group-hover:text-emerald-600 transition-colors">
              Manage Inventory
            </h3>
            <p className="text-gray-600 text-sm mb-4">Update stock levels, add medicines, manage expiry dates</p>
            <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-sm font-semibold">
              Go to Inventory
            </div>
          </a>

          <a
            href="/pharmacy-profile"
            className="bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-lg rounded-lg p-6 transition-all group"
          >
            <h3 className="text-gray-900 font-semibold text-lg mb-2 group-hover:text-emerald-600 transition-colors">
              Update Profile
            </h3>
            <p className="text-gray-600 text-sm mb-4">Edit pharmacy information, hours, insurance partners</p>
            <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-sm font-semibold">
              Go to Profile
            </div>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-gray-900 font-semibold text-lg mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex gap-4 pb-4 border-b border-gray-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-semibold">Stock Updated</p>
                <p className="text-gray-600 text-xs">Paracetamol quantity changed to 150 units</p>
              </div>
              <p className="text-gray-500 text-xs whitespace-nowrap">2 hours ago</p>
            </div>

            <div className="flex gap-4 pb-4 border-b border-gray-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-semibold">Profile Viewed</p>
                <p className="text-gray-600 text-xs">Your profile was viewed 15 times today</p>
              </div>
              <p className="text-gray-500 text-xs whitespace-nowrap">5 hours ago</p>
            </div>

            <div className="flex gap-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-semibold">Low Stock Alert</p>
                <p className="text-gray-600 text-xs">Ibuprofen running low (8 units remaining)</p>
              </div>
              <p className="text-gray-500 text-xs whitespace-nowrap">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
