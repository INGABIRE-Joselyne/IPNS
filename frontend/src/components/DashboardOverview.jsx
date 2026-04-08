import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Eye, BarChart3 } from 'lucide-react';
import { StatCard } from './Cards';

const DashboardOverview = ({ pharmacy, token, onRefresh }) => {
  const [stats, setStats] = useState({
    medicines_listed: 0,
    low_stock_count: 0,
    insurance_count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [pharmacy]);

  const fetchStats = async () => {
    try {
      // Fetch inventory stats
      const stockResponse = await fetch(
        `http://localhost:8000/api/v1/inventory/stock/?pharmacy_id=${pharmacy.id}`,
        { headers: { Authorization: `Token ${token}` } }
      );

      if (stockResponse.ok) {
        const stockData = await stockResponse.json();
        const lowStock = stockData.results?.filter(s => s.quantity < 10).length || 0;
        setStats(prev => ({
          ...prev,
          medicines_listed: stockData.count || 0,
          low_stock_count: lowStock,
        }));
      }

      // Set insurance count from pharmacy data
      setStats(prev => ({
        ...prev,
        insurance_count: pharmacy.insurance_providers?.length || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's an overview of your pharmacy</p>
      </div>

      {/* Key Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={BarChart3}
          label="Medicines Listed"
          value={stats.medicines_listed}
          trend="In inventory"
        />
        <StatCard
          icon={AlertCircle}
          label="Low Stock Items"
          value={stats.low_stock_count}
          trend="Review soon"
        />
        <StatCard
          icon={TrendingUp}
          label="Insurance Partners"
          value={stats.insurance_count}
          trend="Active agreements"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Pharmacy Information</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-700">Phone</span>
            <span className="text-gray-900 font-semibold">{pharmacy.phone_number}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-700">Email</span>
            <span className="text-gray-900 font-semibold">{pharmacy.email || 'Not provided'}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-700">Address</span>
            <span className="text-gray-900 font-semibold">{pharmacy.street_address || 'Not provided'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Operating Hours</span>
            <span className="text-gray-900 font-semibold">
              {pharmacy.opening_time} - {pharmacy.closing_time}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="grid md:grid-cols-2 gap-6">
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
          href="/find-pharmacy"
          className="bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-lg rounded-lg p-6 transition-all group"
        >
          <h3 className="text-gray-900 font-semibold text-lg mb-2 group-hover:text-emerald-600 transition-colors">
            View Public Profile
          </h3>
          <p className="text-gray-600 text-sm mb-4">See how your pharmacy appears to customers</p>
          <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-sm font-semibold">
            View Profile
          </div>
        </a>
      </div>
    </div>
  );
};

export default DashboardOverview;
