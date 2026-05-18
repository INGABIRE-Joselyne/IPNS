import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Pill,
  Search,
  ShieldCheck,
} from 'lucide-react';
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
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState([]);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    loadProvinces();
    loadInsuranceProviders();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      loadDistricts(selectedProvince);
      setSelectedDistrict('');
      setSelectedSector('');
      setSectors([]);
    } else {
      setSelectedDistrict('');
      setDistricts([]);
      setSelectedSector('');
      setSectors([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      loadSectors(selectedDistrict);
      setSelectedSector('');
    } else {
      setSelectedSector('');
      setSectors([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const q = searchTerm.trim();
    if (!q) {
      setMedicines([]);
      setSelectedMedicine(null);
      setAvailability([]);
      return;
    }

    const timer = setTimeout(() => {
      runMedicineSearch(q);
    }, 320);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!selectedMedicine) {
      setAvailability([]);
      return;
    }

    let cancelled = false;

    const loadAvailability = async () => {
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
    };

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [selectedMedicine, selectedDistrict, selectedSector, userLocation]);

  const loadProvinces = async () => {
    try {
      const data = await apiGet(endpoints.provinces);
      setProvinces(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to load provinces:', err);
      setError('Failed to load provinces');
    }
  };

  const loadInsuranceProviders = async () => {
    try {
      const data = await apiGet(endpoints.insurance);
      setInsuranceProviders(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to load insurance providers:', err);
      setInsuranceProviders([]);
    }
  };

  const loadDistricts = async (provinceId) => {
    try {
      const data = await apiGet(`${endpoints.provinces}${provinceId}/districts/`);
      setDistricts(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to load districts:', err);
      setDistricts([]);
    }
  };

  const loadSectors = async (districtId) => {
    try {
      const data = await apiGet(`${endpoints.districts}${districtId}/sectors/`);
      setSectors(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to load sectors:', err);
      setSectors([]);
    }
  };

  const runMedicineSearch = async (q) => {
    setIsSearching(true);
    setError('');

    try {
      const data = await apiGet(endpoints.medicineSearch, { q });
      const list = Array.isArray(data) ? data : data.results || [];
      setMedicines(list);
      setSelectedMedicine(list.length > 0 ? list[0].id : null);
      setAvailability([]);
    } catch (err) {
      console.error('Search failed:', err);
      setMedicines([]);
      setSelectedMedicine(null);
      setAvailability([]);
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

  const selectedMedicineRecord = useMemo(
    () => medicines.find((medicine) => medicine.id === selectedMedicine),
    [medicines, selectedMedicine]
  );

  const displayedAvailability = useMemo(() => {
    if (selectedInsurance.length === 0) return availability;

    return availability.filter((stock) => {
      const accepted = stock.insurance_providers || stock.accepted_insurance || stock.insurances || [];
      if (!Array.isArray(accepted) || accepted.length === 0) return true;

      return accepted.some((insurance) => {
        const id = typeof insurance === 'object' ? insurance.id : insurance;
        return selectedInsurance.includes(String(id));
      });
    });
  }, [availability, selectedInsurance]);

  const toggleInsurance = (insuranceId) => {
    setSelectedInsurance((current) =>
      current.includes(String(insuranceId))
        ? current.filter((id) => id !== String(insuranceId))
        : [...current, String(insuranceId)]
    );
  };

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
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Patients Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Search Medicine</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                const q = searchTerm.trim();
                if (q) runMedicineSearch(q);
              }}
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Input Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Type medicine name"
                    className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800">Selection Medicine</label>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Province</label>
                  <select
                    value={selectedProvince}
                    onChange={(event) => setSelectedProvince(event.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">All provinces</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(event) => setSelectedDistrict(event.target.value)}
                    disabled={!selectedProvince}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">All districts</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Sector</label>
                  <select
                    value={selectedSector}
                    onChange={(event) => setSelectedSector(event.target.value)}
                    disabled={!selectedDistrict}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">All sectors</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <ShieldCheck size={17} className="text-blue-700" />
                  Insurance Partner
                </div>
                <div className="space-y-2">
                  {insuranceProviders.length > 0 ? (
                    insuranceProviders.map((insurance) => (
                      <label key={insurance.id} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={selectedInsurance.includes(String(insurance.id))}
                          onChange={() => toggleInsurance(insurance.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {insurance.name}
                      </label>
                    ))
                  ) : (
                    ['RSSB', 'MMI', 'Radiant', 'Prime'].map((name) => (
                      <label key={name} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                        {name}
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!searchTerm.trim() || isSearching}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Search size={18} />
                  {isSearching ? 'Searching...' : 'Search result'}
                </button>

                <button
                  type="button"
                  onClick={requestUserLocation}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-100"
                >
                  <Navigation size={18} />
                  Nearest first
                </button>
              </div>

              {locationStatus === 'denied' && (
                <p className="text-xs text-amber-700">Location blocked. Enable it in your browser to sort by distance.</p>
              )}
              {locationStatus === 'unsupported' && (
                <p className="text-xs text-slate-500">Geolocation is not supported on this device.</p>
              )}
              {locationStatus === 'ok' && (
                <p className="text-xs font-medium text-blue-700">Distance sort active.</p>
              )}
            </form>
          </aside>

          <section className="space-y-6">
            {error && (
              <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={18} />
                {error}
              </div>
            )}

            <div className="rounded-lg border border-slate-300 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-bold text-slate-950">Search Result</h2>
                <p className="text-sm text-slate-500">
                  {selectedMedicineRecord
                    ? `Showing pharmacies for ${selectedMedicineRecord.name}`
                    : 'Search a medicine to see matching pharmacies.'}
                </p>
              </div>

              <div className="p-5">
                {medicines.length > 0 && (
                  <div className="mb-5">
                    <h3 className="mb-2 text-sm font-semibold text-slate-700">Matching medicines</h3>
                    <div className="flex flex-wrap gap-2">
                      {medicines.map((medicine) => (
                        <button
                          key={medicine.id}
                          type="button"
                          onClick={() => setSelectedMedicine(medicine.id)}
                          className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                            selectedMedicine === medicine.id
                              ? 'border-blue-700 bg-blue-50 text-blue-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                          }`}
                        >
                          <span className="block font-semibold">{medicine.name}</span>
                          {(medicine.generic_name || medicine.strength) && (
                            <span className="block text-xs text-slate-500">
                              {[medicine.generic_name, medicine.strength].filter(Boolean).join(' - ')}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isSearching && medicines.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-b-2 border-blue-700" />
                    <p className="mt-3 text-sm text-slate-600">Searching medicines...</p>
                  </div>
                ) : selectedMedicine ? (
                  isLoading ? (
                    <div className="py-16 text-center">
                      <div className="mx-auto h-9 w-9 animate-spin rounded-full border-b-2 border-blue-700" />
                      <p className="mt-3 text-sm text-slate-600">Checking pharmacy availability...</p>
                    </div>
                  ) : displayedAvailability.length > 0 ? (
                    <div className="space-y-3">
                      {displayedAvailability.map((stock, index) => (
                        <div
                          key={stock.id || `${stock.pharmacy_id}-${index}`}
                          className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_auto]"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              {logoUrl(stock.pharmacy_logo) && (
                                <img
                                  src={logoUrl(stock.pharmacy_logo)}
                                  alt=""
                                  className="h-10 w-10 rounded-md object-contain"
                                />
                              )}
                              <div>
                                <h3 className="font-bold text-slate-950">
                                  {stock.pharmacy_name || `Pharmacy ${index + 1}`}
                                </h3>
                                <p className="text-sm text-slate-600">
                                  {[stock.street_address, stock.sector_name, stock.district_name, stock.province_name]
                                    .filter(Boolean)
                                    .join(' - ')}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
                              <span className="inline-flex items-center gap-1">
                                <Pill size={15} className="text-blue-700" />
                                {stock.quantity || 0} units
                              </span>
                              {stock.phone_number && (
                                <a
                                  href={`tel:${stock.phone_number}`}
                                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800"
                                >
                                  <Phone size={15} />
                                  {stock.phone_number}
                                </a>
                              )}
                              {stock.distance_km != null && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin size={15} className="text-blue-700" />
                                  {stock.distance_km} km away
                                </span>
                              )}
                              {stock.last_updated && (
                                <span className="inline-flex items-center gap-1">
                                  <Clock size={15} className="text-blue-700" />
                                  {new Date(stock.last_updated).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:w-40">
                            <span
                              className={`rounded-full px-3 py-1 text-center text-xs font-semibold ${
                                stock.is_in_stock
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {stock.is_in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <a
                              href={`/pharmacies/${stock.pharmacy_id}`}
                              className="rounded-md bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                            >
                              View detail
                            </a>
                            <a
                              href={mapsUrl(stock)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                            >
                              Map
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-10 text-center">
                      <AlertCircle className="mx-auto mb-3 text-slate-400" size={42} />
                      <p className="font-semibold text-slate-700">No availability information</p>
                      <p className="mt-1 text-sm text-slate-500">
                        This medicine is not currently available for the selected location.
                      </p>
                    </div>
                  )
                ) : searchTerm ? (
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-10 text-center">
                    <Pill className="mx-auto mb-3 text-slate-400" size={42} />
                    <p className="font-semibold text-slate-700">No medicines found for "{searchTerm}"</p>
                    <p className="mt-1 text-sm text-slate-500">Try another medicine name.</p>
                  </div>
                ) : (
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-10 text-center">
                    <Search className="mx-auto mb-3 text-slate-400" size={42} />
                    <p className="font-semibold text-slate-700">Start by searching a medicine name</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Results will show pharmacies and View detail buttons here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MedicineSearch;
