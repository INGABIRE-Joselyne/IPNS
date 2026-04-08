import React, { useState, useEffect } from 'react';
import { Search, Pill, MapPin, DollarSign, AlertCircle, Clock } from 'lucide-react';
import { apiGet, endpoints } from '../utils/api';

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      loadDistricts(selectedProvince);
      setSelectedSector('');
      setSectors([]);
    } else {
      setDistricts([]);
      setSectors([]);
    }
  }, [selectedProvince]);

  // Load sectors when district changes
  useEffect(() => {
    if (selectedDistrict) {
      loadSectors(selectedDistrict);
    } else {
      setSectors([]);
    }
  }, [selectedDistrict]);

  // Auto-search when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      setMedicines([]);
      setSelectedMedicine(null);
      setAvailability([]);
    }
  }, [searchTerm]);

  // Re-check availability when filters change
  useEffect(() => {
    if (selectedMedicine) {
      checkAvailability(selectedMedicine);
    }
  }, [selectedDistrict, selectedSector]);

  const loadProvinces = async () => {
    try {
      const data = await apiGet(endpoints.provinces);
      setProvinces(data.results || []);
    } catch (error) {
      console.error('Failed to load provinces:', error);
      setError('Failed to load provinces');
    }
  };

  const loadDistricts = async (provinceId) => {
    try {
      const data = await apiGet(`${endpoints.provinces}${provinceId}/districts/`);
      setDistricts(data.results || data);
    } catch (error) {
      console.error('Failed to load districts:', error);
    }
  };

  const loadSectors = async (districtId) => {
    try {
      const data = await apiGet(`${endpoints.districts}${districtId}/sectors/`);
      setSectors(data.results || data);
    } catch (error) {
      console.error('Failed to load sectors:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setMedicines([]);
      return;
    }

    setIsSearching(true);
    setError('');
    try {
      const data = await apiGet(endpoints.medicineSearch, { search: searchTerm });
      setMedicines(data.results || []);
      setSelectedMedicine(null);
      setAvailability([]);
    } catch (error) {
      console.error('Search failed:', error);
      setMedicines([]);
      setError('Failed to search medicines. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const checkAvailability = async (medicineId) => {
    setIsLoading(true);
    setError('');
    try {
      const params = { medicine_id: medicineId };
      if (selectedDistrict) {
        params.district_id = selectedDistrict;
      }
      if (selectedSector) {
        params.sector_id = selectedSector;
      }
      const data = await apiGet(endpoints.searchMedicineAvailability, params);
      // Handle both array response and wrapped response
      setAvailability(Array.isArray(data) ? data : data.results || []);
      setSelectedMedicine(medicineId);
    } catch (error) {
      console.error('Failed to check availability:', error);
      setAvailability([]);
      setError('Failed to check availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Medicines</h1>
          <p className="text-gray-600">Find where medicines are available across pharmacies</p>
        </div>

        {/* Search Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <div className="space-y-4">
            {/* Medicine Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for medicine (e.g., Paracetamol, Ibuprofen, Amoxicillin)"
                  className="w-full pl-10 pr-6 py-3 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Filters Toggle */}
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                <span>{showFilters ? '−' : '+'}</span>
                Advanced Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                {/* Province Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    <option value="">All Provinces</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedProvince}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors disabled:opacity-50"
                  >
                    <option value="">All Districts</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sector Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    disabled={!selectedDistrict}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors disabled:opacity-50"
                  >
                    <option value="">All Sectors</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medicines List */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Medicines {medicines.length > 0 && `(${medicines.length})`}
            </h2>
            {isSearching && medicines.length === 0 ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="text-gray-600 mt-3">Searching medicines...</p>
              </div>
            ) : medicines.length > 0 ? (
              <div className="space-y-2">
                {medicines.map((medicine) => (
                  <button
                    key={medicine.id}
                    onClick={() => checkAvailability(medicine.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                      selectedMedicine === medicine.id
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{medicine.name}</div>
                    <div className="text-xs text-gray-600">
                      {medicine.strength && `${medicine.strength} • `}
                      {medicine.manufacturer && `${medicine.manufacturer}`}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                <Pill className="mx-auto text-gray-400 mb-3" size={40} />
                <p className="text-gray-600">No medicines found for "{searchTerm}"</p>
                <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                <Search className="mx-auto text-gray-400 mb-3" size={40} />
                <p className="text-gray-600">Search for a medicine to get started</p>
              </div>
            )}
          </div>

          {/* Availability Results */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Available At {availability.length > 0 && `(${availability.length})`}
            </h2>
            {selectedMedicine ? (
              isLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  <p className="text-gray-600 mt-3">Checking availability...</p>
                </div>
              ) : availability.length > 0 ? (
                <div className="space-y-4">
                  {availability.map((stock) => (
                    <div
                      key={stock.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-all hover:shadow-md"
                    >
                      {/* Pharmacy Logo */}
                      {stock.pharmacy_logo && (
                        <div className="h-24 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center overflow-hidden">
                          <img src={stock.pharmacy_logo} alt={stock.pharmacy_name} className="h-full w-auto object-contain px-4" />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{stock.pharmacy_name}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <MapPin size={14} />
                              {stock.sector_name}, {stock.district_name}
                            </p>
                          </div>
                          {stock.is_in_stock ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              ✓ In Stock
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                              ✗ Out of Stock
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm border-t border-gray-100 pt-4">
                          <div>
                            <p className="text-gray-600 text-xs font-medium">Quantity Available</p>
                            <p className="text-gray-900 font-bold text-lg">{stock.quantity || 0} units</p>
                          </div>
                          {stock.price && (
                            <div>
                              <p className="text-gray-600 text-xs font-medium">Price</p>
                              <p className="text-gray-900 font-bold text-lg flex items-center gap-1">
                                <DollarSign size={16} />
                                {stock.price}
                              </p>
                            </div>
                          )}
                        </div>

                        {stock.is_expired && (
                          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="text-red-600 flex-shrink-0" size={16} />
                            <p className="text-red-700 text-sm font-semibold">Expired - Do not use</p>
                          </div>
                      )}

                      <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                        <Clock size={12} />
                        Last updated: {new Date(stock.last_updated).toLocaleDateString()}
                      </p>

                      <a 
                        href={`/pharmacies/${stock.pharmacy_id}`}
                        className="w-full block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-center"
                      >
                        View Pharmacy Details
                      </a>
                    </div>
                  </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <AlertCircle className="mx-auto text-gray-400 mb-3" size={40} />
                  <p className="text-gray-600 font-semibold">No availability information</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {selectedDistrict 
                      ? 'This medicine is not available in the selected district'
                      : 'This medicine is not currently available anywhere'}
                  </p>
                </div>
              )
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <Pill className="mx-auto text-gray-400 mb-3" size={40} />
                <p className="text-gray-600 font-semibold">No medicine selected</p>
                <p className="text-gray-500 text-sm mt-2">Select a medicine from the list to check where it's available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineSearch;
