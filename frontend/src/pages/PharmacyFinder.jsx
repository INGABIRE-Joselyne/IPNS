import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Heart, Building2, Filter, Search } from 'lucide-react';
import { apiGet, endpoints } from '../utils/api';

const PharmacyFinder = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Load provinces and pharmacies on mount
  useEffect(() => {
    loadProvinces();
    loadPharmacies();
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

  // Apply filters whenever any filter or search changes
  useEffect(() => {
    applyFilters();
  }, [pharmacies, searchQuery, selectedDistrict, selectedSector, selectedStatus]);

  const loadProvinces = async () => {
    try {
      const data = await apiGet(endpoints.provinces);
      setProvinces(data.results || []);
    } catch (error) {
      console.error('Failed to load provinces:', error);
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

  const loadPharmacies = async () => {
    setIsLoading(true);
    try {
      const data = await apiGet(endpoints.pharmacies);
      setPharmacies(data.results || []);
    } catch (error) {
      console.error('Failed to load pharmacies:', error);
      setPharmacies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...pharmacies];

    // Filter by search query (name or location)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (pharmacy) =>
          pharmacy.name.toLowerCase().includes(query) ||
          (pharmacy.sector_name && pharmacy.sector_name.toLowerCase().includes(query)) ||
          (pharmacy.district_name && pharmacy.district_name.toLowerCase().includes(query))
      );
    }

    // Filter by district
    if (selectedDistrict) {
      results = results.filter((pharmacy) => pharmacy.district_id === parseInt(selectedDistrict));
    }

    // Filter by sector
    if (selectedSector) {
      results = results.filter((pharmacy) => pharmacy.sector_id === parseInt(selectedSector));
    }

    // Filter by status
    if (selectedStatus) {
      results = results.filter((pharmacy) => pharmacy.current_status === selectedStatus);
    }

    setFilteredPharmacies(results);
  };

  const toggleFavorite = (pharmacyId) => {
    setFavorites((prev) =>
      prev.includes(pharmacyId)
        ? prev.filter((id) => id !== pharmacyId)
        : [...prev, pharmacyId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-600 border border-green-300';
      case 'closing_soon':
        return 'bg-yellow-500/20 text-yellow-600 border border-yellow-300';
      case 'closed':
        return 'bg-red-500/20 text-red-600 border border-red-300';
      default:
        return 'bg-gray-500/20 text-gray-600 border border-gray-300';
    }
  };

  const getStatusDisplay = (status) => {
    const map = {
      open: '🟢 Open',
      closing_soon: '🟡 Closing Soon',
      closed: '🔴 Closed',
    };
    return map[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find a Pharmacy</h1>
          <p className="text-gray-600">Search and filter pharmacies near you</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by pharmacy name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={20} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <span className="text-gray-500 ml-auto">{showFilters ? '−' : '+'}</span>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Province Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-emerald-600"
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
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-emerald-600 disabled:opacity-50"
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
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-emerald-600 disabled:opacity-50"
                >
                  <option value="">All Sectors</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="">All Status</option>
                  <option value="open">Open Now</option>
                  <option value="closing_soon">Closing Soon</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-4 text-gray-600">
            Showing <span className="font-semibold">{filteredPharmacies.length}</span> of <span className="font-semibold">{pharmacies.length}</span> pharmacies
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-gray-600 mt-4">Loading pharmacies...</p>
          </div>
        ) : filteredPharmacies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-100"
              >
                {/* Card Image */}
                <div className="w-full h-56 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border-b border-gray-200 overflow-hidden">
                  {pharmacy.logo ? (
                    <img src={pharmacy.logo} alt={pharmacy.name} className="w-full h-full object-contain p-4" />
                  ) : (
                    <Building2 size={48} className="text-emerald-300" />
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{pharmacy.name}</h3>
                    <button
                      onClick={() => toggleFavorite(pharmacy.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favorites.includes(pharmacy.id)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600 hover:text-emerald-600'
                      }`}
                    >
                      <Heart size={20} fill={favorites.includes(pharmacy.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusColor(pharmacy.current_status)}`}>
                    {getStatusDisplay(pharmacy.current_status)}
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-emerald-600" />
                      <span>{pharmacy.sector_name}, {pharmacy.district_name}</span>
                    </div>
                    {pharmacy.opening_time && pharmacy.closing_time && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={16} className="text-emerald-600" />
                        <span>{pharmacy.opening_time} - {pharmacy.closing_time}</span>
                      </div>
                    )}
                  </div>

                  {/* Insurance Count */}
                  {pharmacy.insurance_count > 0 && (
                    <p className="text-xs text-emerald-600 mb-4">
                      ✓ Accepts {pharmacy.insurance_count} insurance provider{pharmacy.insurance_count !== 1 ? 's' : ''}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={`/pharmacies/${pharmacy.id}`}
                      className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-lg font-medium transition-colors text-center"
                    >
                      View Details
                    </a>
                    <a 
                      href={`tel:${pharmacy.phone_number}`}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors text-center"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">No pharmacies found</p>
            {(searchQuery || selectedDistrict || selectedStatus) && (
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            )}
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Favorites ({favorites.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPharmacies
                .filter((p) => favorites.includes(p.id))
                .map((pharmacy) => (
                  <div
                    key={pharmacy.id}
                    className="bg-red-50 border border-red-200 rounded-xl p-6 hover:border-red-300 transition-all"
                  >
                    <h3 className="text-lg font-bold text-gray-900">{pharmacy.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">
                      {pharmacy.sector_name}, {pharmacy.district_name}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <a 
                        href={`/pharmacies/${pharmacy.id}`}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-center"
                      >
                        View Details
                      </a>
                      <button
                        onClick={() => toggleFavorite(pharmacy.id)}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyFinder;
