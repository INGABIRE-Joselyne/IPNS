import React, { useState, useEffect } from 'react';
import { X, Search, AlertCircle, Plus } from 'lucide-react';

const AddMedicineModal = ({ isOpen, onClose, onSave, token, loading }) => {
  const [formData, setFormData] = useState({
    medicine_id: '',
    quantity: '',
    price: '',
    expiry_date: '',
  });
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMedicines, setShowMedicines] = useState(false);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const [error, setError] = useState('');
  const [creatingMedicine, setCreatingMedicine] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMedicineData, setNewMedicineData] = useState({
    name: '',
    generic_name: '',
    strength: '',
    unit: 'tablet',
  });

  useEffect(() => {
    if (isOpen && searchTerm.length > 0) {
      fetchMedicines(searchTerm);
    }
  }, [searchTerm, isOpen]);

  const fetchMedicines = async (query) => {
    try {
      setLoadingMedicines(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/medicines/?search=${query}`,
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setMedicines(data.results || data);
      }
    } catch (err) {
      setError('Failed to fetch medicines');
    } finally {
      setLoadingMedicines(false);
    }
  };

  const selectedMedicine = medicines.find(m => m.id === parseInt(formData.medicine_id));

  const handleMedicineSelect = (medicine) => {
    setFormData(prev => ({
      ...prev,
      medicine_id: medicine.id
    }));
    setShowMedicines(false);
    setSearchTerm('');
    setShowCreateForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewMedicineChange = (e) => {
    const { name, value } = e.target;
    setNewMedicineData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateMedicine = async (e) => {
    e.preventDefault();
    setError('');

    if (!newMedicineData.name.trim()) {
      setError('Please enter medicine name');
      return;
    }

    try {
      setCreatingMedicine(true);

      const response = await fetch('http://localhost:8000/api/v1/medicines/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          name: newMedicineData.name,
          generic_name: newMedicineData.generic_name || newMedicineData.name,
          strength: newMedicineData.strength || '',
          unit: newMedicineData.unit,
          is_active: true
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || data.message || 'Failed to create medicine');
      }

      const createdMedicine = await response.json();
      handleMedicineSelect(createdMedicine);
      setNewMedicineData({ name: '', generic_name: '', strength: '', unit: 'tablet' });
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingMedicine(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.medicine_id) {
      setError('Please select a medicine');
      return;
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Add Medicine to Inventory</h2>
          <button
            onClick={onClose}
            disabled={loading || creatingMedicine}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-700" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Medicine Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Medicine *
            </label>
            {selectedMedicine ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-300 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{selectedMedicine.name}</p>
                  <p className="text-xs text-gray-600">{selectedMedicine.generic_name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, medicine_id: '' }));
                    setSearchTerm('');
                    setShowCreateForm(false);
                  }}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowMedicines(true);
                      setShowCreateForm(false);
                    }}
                    onFocus={() => searchTerm && setShowMedicines(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />

                  {/* Dropdown */}
                  {showMedicines && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {loadingMedicines ? (
                        <div className="p-4 text-center text-gray-600">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-emerald-600 mx-auto"></div>
                        </div>
                      ) : medicines.length > 0 ? (
                        <>
                          {medicines.map(medicine => (
                            <button
                              key={medicine.id}
                              type="button"
                              onClick={() => handleMedicineSelect(medicine)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors"
                            >
                              <p className="font-medium text-gray-900">{medicine.name}</p>
                              <p className="text-xs text-gray-600">{medicine.generic_name}</p>
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setShowMedicines(false);
                              setShowCreateForm(true);
                            }}
                            className="w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border-t border-gray-200 transition-colors flex items-center gap-2 text-emerald-700 font-semibold"
                          >
                            <Plus size={18} />
                            Create New Medicine
                          </button>
                        </>
                      ) : searchTerm ? (
                        <div className="p-4 text-center text-gray-600 text-sm">
                          <p className="mb-3">No medicines found</p>
                          <button
                            type="button"
                            onClick={() => {
                              setShowMedicines(false);
                              setShowCreateForm(true);
                            }}
                            className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center justify-center gap-2 transition-colors"
                          >
                            <Plus size={18} />
                            Create "{searchTerm}"
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-600 text-sm">
                          Type to search medicines
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Create New Medicine Form */}
                {showCreateForm && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-300 rounded-lg space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Plus size={18} className="text-emerald-600" />
                      Create New Medicine
                    </h3>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newMedicineData.name}
                        onChange={handleNewMedicineChange}
                        placeholder="e.g., Paracetamol"
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Generic Name
                      </label>
                      <input
                        type="text"
                        name="generic_name"
                        value={newMedicineData.generic_name}
                        onChange={handleNewMedicineChange}
                        placeholder="e.g., Acetaminophen"
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Strength
                        </label>
                        <input
                          type="text"
                          name="strength"
                          value={newMedicineData.strength}
                          onChange={handleNewMedicineChange}
                          placeholder="e.g., 500mg"
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Unit
                        </label>
                        <select
                          name="unit"
                          value={newMedicineData.unit}
                          onChange={handleNewMedicineChange}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                          <option value="tablet">Tablet</option>
                          <option value="capsule">Capsule</option>
                          <option value="ml">ml</option>
                          <option value="injection">Injection</option>
                          <option value="cream">Cream</option>
                          <option value="ointment">Ointment</option>
                          <option value="inhaler">Inhaler</option>
                          <option value="powder">Powder</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleCreateMedicine}
                        disabled={creatingMedicine || !newMedicineData.name.trim()}
                        className="flex-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded font-semibold transition-colors disabled:opacity-50"
                      >
                        {creatingMedicine ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewMedicineData({ name: '', generic_name: '', strength: '', unit: 'tablet' });
                        }}
                        className="flex-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm rounded font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (Optional)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price per unit"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || creatingMedicine}
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Medicine'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading || creatingMedicine}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
