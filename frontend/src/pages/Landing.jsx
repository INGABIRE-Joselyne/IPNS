import React, { useState, useEffect } from 'react';
import { Search, MapPin, CheckCircle, Users, Pill, TrendingUp, ShieldCheck, Lock, Zap, AlertTriangle, Building2 } from 'lucide-react';
import { StatCard, LoadingSpinner, EmptyState } from '../components/Cards';

const Landing = () => {
  const [medicineSearch, setMedicineSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    pharmacies: 0,
    medicines: 0,
    districts: 0,
    searches: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pharmaciesRes, medicinesRes, districtsRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/pharmacies/'),
        fetch('http://localhost:8000/api/v1/medicines/'),
        fetch('http://localhost:8000/api/v1/locations/districts/')
      ]);

      if (pharmaciesRes.ok && medicinesRes.ok && districtsRes.ok) {
        const pharmaciesData = await pharmaciesRes.json();
        const medicinesData = await medicinesRes.json();
        const districtsData = await districtsRes.json();

        setStats({
          pharmacies: pharmaciesData.count || 0,
          medicines: medicinesData.count || 0,
          districts: districtsData.count || 0,
          searches: Math.floor(Math.random() * 10000) + 1000
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!medicineSearch.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (medicineSearch) params.append('search', medicineSearch);
      if (districtFilter) params.append('district', districtFilter);

      const response = await fetch(`http://localhost:8000/api/v1/inventory/stock/?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Find your medicine, instantly
            </span>
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Connect with pharmacies in real-time. Check stock, compare insurance, and locate the nearest open pharmacy.
          </p>

          <a href="/login" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors mb-8">
            Get Started
          </a>

          {/* Search Results Preview */}
          {loading && <LoadingSpinner />}
          {searchResults.length > 0 && (
            <div className="mt-8 bg-gray-100 rounded-lg p-6 border border-gray-300">
              <p className="text-gray-700 mb-4">Found {searchResults.length} locations with this medicine</p>
              <div className="grid md:grid-cols-2 gap-4">
                {searchResults.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded text-left border border-gray-300 shadow-sm">
                    <p className="text-gray-900 font-semibold">{item.pharmacy?.name}</p>
                    <p className="text-emerald-600 text-sm mt-1">
                      {item.is_in_stock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 mb-2">{stats.pharmacies}+</p>
              <p className="text-gray-600">Pharmacies Connected</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 mb-2">{stats.medicines}+</p>
              <p className="text-gray-600">Medicines Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 mb-2">{stats.districts}+</p>
              <p className="text-gray-600">Districts Covered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 mb-2">{stats.searches.toLocaleString()}+</p>
              <p className="text-gray-600">Searches Today</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-300">
                <Search size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-3">Search by Medicine Name</h3>
              <p className="text-gray-600">Enter the medicine name to find all available options in your area.</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-300">
                <MapPin size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-3">Filter by District</h3>
              <p className="text-gray-600">Narrow down results based on your location for nearest results.</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-300">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-3">Find Open Pharmacy</h3>
              <p className="text-gray-600">Get real-time status of nearby pharmacies and their current availability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Why Choose IPNS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-emerald-400 transition-colors shadow-sm">
              <TrendingUp size={32} className="text-emerald-600 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-3">Real-time Stock Visibility</h3>
              <p className="text-gray-400">Instant updates on medicine availability across all connected pharmacies.</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-emerald-400 transition-colors shadow-sm">
              <MapPin size={32} className="text-emerald-600 mb-4" />
              <h3 className="text-gray-900 font-semibold text-lg mb-3">District-based Filtering</h3>
              <p className="text-gray-600">Find the nearest pharmacy to your location with ease.</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-emerald-400 transition-colors shadow-sm">
              <ShieldCheck size={32} className="text-emerald-600 mb-4" />
              <h3 className="text-gray-900 font-semibold text-lg mb-3">Insurance Partner Filter</h3>
              <p className="text-gray-600">Verify insurance acceptance before visiting a pharmacy.</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-emerald-400 transition-colors shadow-sm">
              <Zap size={32} className="text-emerald-600 mb-4" />
              <h3 className="text-gray-900 font-semibold text-lg mb-3">Open/Closed Status Engine</h3>
              <p className="text-gray-600">Know which pharmacies are open right now, no guessing needed.</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-emerald-400 transition-colors shadow-sm">
              <Pill size={32} className="text-emerald-600 mb-4" />
              <h3 className="text-gray-900 font-semibold text-lg mb-3">Comprehensive Medicine Catalog</h3>
              <p className="text-gray-600">Access thousands of medicines with detailed information.</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-emerald-400 transition-colors shadow-sm">
              <Lock size={32} className="text-emerald-600 mb-4" />
              <h3 className="text-gray-900 font-semibold text-lg mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">Your data is safe with our enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Pharmacies Section */}
      <section id="for-pharmacies" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">For Pharmacy Managers</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Benefits of Joining IPNS</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle size={24} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-600"><strong>Increased Visibility</strong> — Reach more customers searching for your medicines.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle size={24} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-600"><strong>Better Inventory Control</strong> — Track stock in real-time from one dashboard.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle size={24} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-600"><strong>Reduce Stock-outs</strong> — Know instantly when medicines are running low.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle size={24} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-600"><strong>Insurance Partner Integration</strong> — Manage multiple insurance partnerships easily.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle size={24} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-600"><strong>No Setup Fees</strong> — Free to join, pay nothing upfront.</span>
                </li>
              </ul>
              <a href="/register" className="mt-8 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded font-semibold transition-colors">
                Register Your Pharmacy
              </a>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-12 border border-emerald-300 flex items-center justify-center min-h-96">
              <Building2 size={128} className="text-emerald-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Partners Strip */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600 mb-8">Trusted by Rwanda's Leading Insurance Providers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold">RSSB</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold">MMI</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold">MIS UR</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold">Medicore</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">What People Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-emerald-600">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-6">"IPNS has transformed how we manage medicines. Patients no longer waste time looking, and we've reduced stock-outs by 40%."</p>
              <p className="text-gray-900 font-semibold">Jean Marie - Pharmacy Manager</p>
              <p className="text-gray-500 text-sm">Kigali Central Pharmacy</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-emerald-600">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-6">"Finding medicines used to be a nightmare. Now I search once and know exactly where to go. Love it!"</p>
              <p className="text-gray-900 font-semibold">Emmanuel - Patient</p>
              <p className="text-gray-500 text-sm">Gasabo, Kigali</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-t border-emerald-300">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Join?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Pharmacies: Start managing inventory with real patient demand today. Patients: Find your medicines instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded font-semibold transition-colors">
              Register as Pharmacy
            </a>
            <a href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded font-semibold transition-colors border border-gray-300">
              Search Medicines
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
