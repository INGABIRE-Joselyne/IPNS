import React, { useState } from 'react';
import { Search, MapPin, Pill, Clock } from 'lucide-react';
import { apiGet, endpoints } from '../utils/api';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('medicine'); // medicine or pharmacy

  const handleMedicineSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const data = await apiGet(endpoints.medicineSearch, { q: searchTerm });
      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search failed:', error);
      setMedicines([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">Find Medicines</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              In Real-Time
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover medicine availability and pharmacy information across Rwanda's districts. 
            No more blind searches. Get instant access to real-time stock levels and pharmacy status.
          </p>

          {/* Search Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedTab('medicine')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTab === 'medicine'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Search Medicine
            </button>
            <button
              onClick={() => setSelectedTab('pharmacy')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTab === 'pharmacy'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Find Pharmacy
            </button>
          </div>

          {/* Search Bar */}
          {selectedTab === 'medicine' && (
            <form onSubmit={handleMedicineSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for medicine (e.g., Paracetamol)"
                  className="w-full px-6 py-4 rounded-xl bg-white border border-emerald-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          )}

          {selectedTab === 'pharmacy' && (
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                <input
                  type="text"
                  placeholder="Filter by location (District)"
                  className="w-full pl-16 pr-6 py-4 rounded-xl bg-white border border-emerald-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {medicines.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">{medicine.name}</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">
                      {medicine.strength || 'N/A'}
                    </span>
                  </div>
                  {medicine.generic_name && (
                    <p className="text-sm text-gray-600 mb-3">Generic: {medicine.generic_name}</p>
                  )}
                  <p className="text-sm text-gray-500 mb-4">Manufacturer: {medicine.manufacturer || 'N/A'}</p>
                  <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200">
                    View Availability
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
            <p className="text-gray-600 mt-4">Searching...</p>
          </div>
        )}

        {searchTerm && medicines.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Pill className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No medicines found. Try a different search term.</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Why Choose IPNS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="text-emerald-600" size={32} />,
                title: 'Real-Time Search',
                description: 'Find medicines instantly across all pharmacies in your district',
              },
              {
                icon: <MapPin className="text-emerald-600" size={32} />,
                title: 'Location Based',
                description: 'Search by Province, District, or Sector for personalized results',
              },
              {
                icon: <Clock className="text-emerald-600" size={32} />,
                title: 'Status Updates',
                description: 'Know if pharmacies are open, closing soon, or closed in real-time',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:border-emerald-300 transition-all duration-200"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Medicine?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop searching pharmacy by pharmacy. Get instant access to real-time medicine availability across Rwanda.
          </p>
          <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-colors duration-200">
            Start Searching Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
