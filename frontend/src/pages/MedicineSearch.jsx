import React, { useState, useEffect, useCallback } from 'react';
import { Search, Pill, MapPin, AlertCircle, Clock, Navigation, Phone, ExternalLink } from 'lucide-react';
import { apiGet, endpoints } from '../utils/api';

const API_BASE = 'http://localhost:8000';

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
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');

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

  // Debounced search against national catalog
  useEffect(() => {
    const q = searchTerm.trim();
    if (!q) {
      setMedicines([]);
      setSelectedMedicine(null);
      setAvailability([]);
      return;
    }
    const t = setTimeout(() => {
      runMedicineSearch(q);
    }, 320);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const loadProvinces = async () => {
    try {
      const data = await apiGet(endpoints.provinces);
      setProvinces(Array.isArray(data) ? data : data.results || []);
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

  const runMedicineSearch = async (q) => {
    setIsSearching(true);
    setError('');
    try {
      const data = await apiGet(endpoints.medicineSearch, { q });
      const list = Array.isArray(data) ? data : data.results || [];
      setMedicines(list);
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

  const requestUserLocation = useCallback(() => {
    setLocationStatus('locating');
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus('ok');
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, []);

  useEffect(() => {
    if (!selectedMedicine) {
      setAvailability([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError('');
      try {
        const params = { medicine_id: selectedMedicine };
        if (selectedDistrict) params.district_id = selectedDistrict;
        if (selectedSector) params.sector_id = selectedSector;
        if (userLocation?.lat != null && userLocation?.lng != null) {
          params.lat = userLocation.lat;
          params.lng = userLocation.lng;
        }
        const data = await apiGet(endpoints.searchMedicineAvailability, params);
        if (!cancelled) {
          setAvailability(Array.isArray(data) ? data : data.results || []);
        }
      } catch (err) {
        console.error('Failed to check availability:', err);
        if (!cancelled) {
          setAvailability([]);
          setError('Failed to check availability. Please try again.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedMedicine, selectedDistrict, selectedSector, userLocation]);

  const logoUrl = (path) => {
    if (!path) return null;
    if (typeof path === 'string' && path.startsWith('http')) return path;
    return `${API_BASE}${path}`;
  };

  const mapsUrl = (stock) => {
    if (stock.latitude != null && stock.longitude != null) {
      return `https://www.google.com/maps/dir/?api=1&destination=${stock.latitude},${stock.longitude}`;
    }
    const q = [stock.pharmacy_name, stock.street_address, stock.sector_name, stock.district_name]
      .filter(Boolean)
      .join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find medicine availability</h1>
          <p className="text-gray-600 max-w-3xl">
            Search the national medicine catalog, then see which pharmacies report stock, with location and optional
            sorting by distance from you.
          </p>
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

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={requestUserLocation}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <Navigation size={18} />
                {locationStatus === 'locating' ? 'Getting location…' : 'Use my location (nearest first)'}
              </button>
              {locationStatus === 'denied' && (
                <span className="text-sm text-amber-700">Location blocked — enable it in your browser to sort by distance.</span>
              )}
              {locationStatus === 'unsupported' && (
                <span className="text-sm text-gray-500">Geolocation not supported on this device.</span>
              )}
              {locationStatus === 'ok' && userLocation && (
                <span className="text-sm text-emerald-700 font-medium">Distance sort active</span>
              )}
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
                    onClick={() => setSelectedMedicine(medicine.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                      selectedMedicine === medicine.id
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{medicine.name}</div>
                    <div className="text-xs text-gray-600">
                      {medicine.generic_name && <span className="block text-gray-500">{medicine.generic_name}</span>}
                      {medicine.strength && `${medicine.strength} • `}
                      {medicine.manufacturer && `${medicine.manufacturer}`}
                      {medicine.category_name && (
                        <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {medicine.category_name}
                        </span>
                      )}
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
                      {logoUrl(stock.pharmacy_logo) && (
                        <div className="h-24 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center overflow-hidden">
                          <img src={logoUrl(stock.pharmacy_logo)} alt="" className="h-full w-auto object-contain px-4" />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3 gap-3">
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-gray-900">{stock.pharmacy_name}</h3>
                            <p className="text-sm text-gray-600 flex items-start gap-1 mt-1">
                              <MapPin size={14} className="mt-0.5 shrink-0" />
                              <span>
                                {[stock.street_address, stock.sector_name, stock.district_name, stock.province_name]
                                  .filter(Boolean)
                                  .join(' · ')}
                              </span>
                            </p>
                            {stock.phone_number && (
                              <a
                                href={`tel:${stock.phone_number}`}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                              >
                                <Phone size={14} />
                                {stock.phone_number}
                              </a>
                            )}
                            {stock.distance_km != null && (
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                ~{stock.distance_km} km away
                              </p>
                            )}
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
                          {stock.price != null && stock.price !== '' && (
                            <div>
                              <p className="text-gray-600 text-xs font-medium">Indicative price</p>
                              <p className="text-gray-900 font-bold text-lg">
                                {Number(stock.price).toLocaleString()} RWF
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

                      <div className="flex flex-col sm:flex-row gap-2">
                        <a
                          href={mapsUrl(stock)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                        >
                          <ExternalLink size={16} />
                          Directions
                        </a>
                        <a
                          href={`/pharmacies/${stock.pharmacy_id}`}
                          className="flex-1 block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-center"
                        >
                          Pharmacy profile
                        </a>
                      </div>
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
