import React, { useState, useEffect } from 'react';
import { Plus, Upload, Search, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner, EmptyState } from '../components/Cards';
import AddMedicineModal from '../components/AddMedicineModal';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingMedicine, setAddingMedicine] = useState(false);
  const [addError, setAddError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [pharmacyId, setPharmacyId] = useState(null);
  const { token, logout } = useAuth();

  useEffect(() => {
    fetchPharmacyAndInventory();
  }, []);

  const fetchPharmacyAndInventory = async () => {
    try {
      setFetchError('');
      setLoading(true);
      console.log('Fetching pharmacy profile...');
      
      // First get pharmacy profile to get pharmacy ID
      const pharmacyResponse = await fetch('http://localhost:8000/api/v1/pharmacies/profile/', {
        headers: { Authorization: `Token ${token}` }
      });

      if (!pharmacyResponse.ok) {
        const errorData = await pharmacyResponse.json().catch(() => ({}));
        console.error('Pharmacy fetch failed:', pharmacyResponse.status, errorData);
        throw new Error('Failed to load pharmacy profile. Please make sure you are logged in as a pharmacist.');
      }

      const pharmacyData = await pharmacyResponse.json();
      console.log('Pharmacy loaded:', pharmacyData.id);
      setPharmacyId(pharmacyData.id);
      
      // Then fetch inventory for this pharmacy
      await fetchInventory(pharmacyData.id);
    } catch (error) {
      console.error('Failed to fetch pharmacy:', error);
      setFetchError(error.message || 'Failed to load data');
      setLoading(false);
    }
  };

  const fetchInventory = async (pId) => {
    if (!pId) {
      console.error('Pharmacy ID is not set');
      setFetchError('Unable to load inventory: No pharmacy ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching inventory for pharmacy:', pId);
      const response = await fetch(`http://localhost:8000/api/v1/inventory/stock/?pharmacy_id=${pId}`, {
        headers: { Authorization: `Token ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Inventory fetch failed:', response.status, errorData);
        throw new Error(errorData.detail || errorData.message || `Failed to load inventory (${response.status})`);
      }

      const data = await response.json();
      console.log('Inventory loaded:', data);
      setInventory(data.results || data);
      setFetchError('');
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setFetchError(error.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/inventory/stock/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({ quantity: editQuantity })
      });

      if (response.ok) {
        fetchInventory(pharmacyId);
        setEditingId(null);
      }
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  const handleToggleStock = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/inventory/stock/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({ is_in_stock: !currentStatus })
      });

      if (response.ok) {
        fetchInventory(pharmacyId);
      }
    } catch (error) {
      console.error('Failed to toggle stock:', error);
    }
  };

  const handleAddMedicine = async (formData) => {
    try {
      setAddingMedicine(true);
      setAddError('');

      if (!pharmacyId) {
        throw new Error('Pharmacy not loaded. Please refresh the page.');
      }

      // Prepare the data for submission
      const submitData = {
        medicine_id: parseInt(formData.medicine_id),
        pharmacy_id: pharmacyId,
        quantity: parseInt(formData.quantity),
      };

      if (formData.price) {
        submitData.price = parseFloat(formData.price);
      }

      if (formData.expiry_date) {
        submitData.expiry_date = formData.expiry_date;
      }

      console.log('Adding medicine with data:', submitData);

      const response = await fetch('http://localhost:8000/api/v1/inventory/stock/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.detail || errorData.message || `Failed to add medicine (${response.status})`);
      }

      // Success - refresh inventory
      console.log('Medicine added successfully, refreshing inventory...');
      setShowAddModal(false);
      await fetchInventory(pharmacyId);
      console.log('Inventory refreshed');
    } catch (error) {
      console.error('Error adding medicine:', error);
      setAddError(error.message);
    } finally {
      setAddingMedicine(false);
    }
  };

  const filteredInventory = inventory.filter(item =>
    (item.medicine_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.medicine?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.generic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.medicine?.generic_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-gray-900 font-bold text-xl">Inventory Management</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded text-sm transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Messages */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">{fetchError}</p>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add Medicine
          </button>

          <button className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded font-semibold flex items-center gap-2 transition-colors">
            <Upload size={18} />
            CSV Upload
          </button>
        </div>

        {/* Inventory Table */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredInventory.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="No medicines in inventory"
            description="Add medicines to your pharmacy inventory to get started"
            action={
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Add Medicine
              </button>
            }
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Medicine Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Generic Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expiry</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInventory.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900 font-semibold text-sm">{item.medicine_name || item.medicine?.name}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{item.generic_name || item.medicine?.generic_name}</td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-20"
                            onKeyPress={(e) => e.key === 'Enter' && handleUpdateQuantity(item.id)}
                          />
                        ) : (
                          <span
                            onClick={() => {
                              setEditingId(item.id);
                              setEditQuantity(item.quantity);
                            }}
                            className="cursor-pointer hover:text-emerald-400 transition-colors"
                          >
                            {item.quantity} units
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleToggleStock(item.id, item.is_in_stock)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                            item.is_in_stock
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {item.is_in_stock ? 'In Stock' : 'Out'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{item.expiry_date || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === item.id ? (
                          <button
                            onClick={() => handleUpdateQuantity(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditQuantity(item.quantity);
                            }}
                            className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        {filteredInventory.length > 0 && (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded border border-slate-700">
              <p className="text-gray-400 text-sm mb-2">Total Items</p>
              <p className="text-2xl font-bold text-white">{filteredInventory.length}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded border border-slate-700">
              <p className="text-gray-400 text-sm mb-2">In Stock</p>
              <p className="text-2xl font-bold text-emerald-400">
                {filteredInventory.filter(i => i.is_in_stock).length}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded border border-slate-700">
              <p className="text-gray-400 text-sm mb-2">Out of Stock</p>
              <p className="text-2xl font-bold text-red-400">
                {filteredInventory.filter(i => !i.is_in_stock).length}
              </p>
            </div>
          </div>
        )}

        {/* Add Medicine Modal */}
        <AddMedicineModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setAddError('');
          }}
          onSave={handleAddMedicine}
          token={token}
          loading={addingMedicine}
        />

        {/* Add Error Message */}
        {addError && !showAddModal && (
          <div className="mt-6 bg-red-100 border border-red-300 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <p className="text-red-700">{addError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
