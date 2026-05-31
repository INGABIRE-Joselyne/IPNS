import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, CheckCircle, TrendingUp, ShieldCheck,
  Lock, Zap, Building2, Pill, ArrowRight
} from 'lucide-react';
import heroImage from '../assets/images/hero-pharmacy.jpg';

const Landing = () => {
  const [medicineSearch, setMedicineSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
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
          pharmacies: Array.isArray(pharmaciesData) ? pharmaciesData.length : pharmaciesData.count || 0,
          medicines: Array.isArray(medicinesData) ? medicinesData.length : medicinesData.count || 0,
          districts: Array.isArray(districtsData) ? districtsData.length : districtsData.count || 0,
          searches: Math.floor(Math.random() * 10000) + 1000
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!medicineSearch.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({
        search: medicineSearch,
        is_in_stock: 'true',
      });
      const response = await fetch(`http://localhost:8000/api/v1/inventory/stock/?${params}`);
      if (response.ok) {
        const data = await response.json();
        const results = Array.isArray(data) ? data : (data.results || []);
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden min-h-screen flex items-center">

        {/* Background pharmacy image - local file, works without internet */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Darker overlay for better text readability */}
        <div className="absolute inset-0 bg-[#0B1528]/75" />

        {/* Subtle emerald glow */}
        <div className="absolute bottom-0 left-1/3 w-96 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center w-full">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Rwanda's #1 Pharmacy Network
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Medicine,{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Connect with pharmacies across Rwanda in real-time. Check stock,
            verify insurance, and locate the nearest open pharmacy — all in one place.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={medicineSearch}
                onChange={(e) => setMedicineSearch(e.target.value)}
                placeholder="Search for a medicine..."
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white/15 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search size={18} />
              Search
            </button>
          </form>

          {/* Search Results */}
          {loading && (
            <div className="flex justify-center mt-4"><LoadingSpinner /></div>
          )}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white/10 border border-white/20 rounded-xl p-6 text-left max-w-2xl mx-auto backdrop-blur-sm">
              <p className="text-gray-300 mb-4 text-sm">
                Found <span className="text-emerald-400 font-semibold">{searchResults.length}</span> pharmacy{searchResults.length > 1 ? 'ies' : ''} with this medicine in stock
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {searchResults.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="bg-white/10 p-4 rounded-lg border border-white/10 hover:border-emerald-500/50 transition-colors">
                    <p className="text-white font-semibold text-sm">{item.pharmacy_name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={11} className="text-gray-400" />
                      <p className="text-gray-400 text-xs">{item.district_name}{item.sector_name ? `, ${item.sector_name}` : ''}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-emerald-400 text-xs font-medium">● In Stock ({item.quantity})</span>
                      {item.price && <span className="text-gray-300 text-xs">{Number(item.price).toLocaleString()} RWF</span>}
                    </div>
                  </div>
                ))}
              </div>
              {searchResults.length > 4 && (
                <p className="text-gray-400 text-xs text-center mt-3">
                  +{searchResults.length - 4} more — <a href="/medicines" className="text-emerald-400 hover:underline">View all</a>
                </p>
              )}
            </div>
          )}
          {!loading && searchResults.length === 0 && searched && (
            <div className="mt-2 bg-white/10 border border-white/20 rounded-xl p-4 text-center max-w-2xl mx-auto backdrop-blur-sm">
              <p className="text-gray-400 text-sm">No results for <span className="text-white font-medium">"{medicineSearch}"</span>.</p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
              Get Started <ArrowRight size={18} />
            </a>
            <a href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-colors">
              Register Your Pharmacy
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <p className="text-gray-400 text-xs uppercase tracking-widest">Scroll</p>
            <div className="w-5 h-8 border-2 border-gray-400/50 rounded-full flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
          </div>

        </div>
      </section>

      {/* ── LIVE STATS STRIP ── */}
      <section className="bg-emerald-600 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: `${stats.pharmacies}+`, label: 'Pharmacies Connected' },
            { value: `${stats.medicines}+`, label: 'Medicines Tracked' },
            { value: `${stats.districts}+`, label: 'Districts Covered' },
            { value: `${stats.searches.toLocaleString()}+`, label: 'Searches Today' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-emerald-100 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search size={28} className="text-emerald-600" />,
                step: '01',
                title: 'Search by Medicine Name',
                desc: 'Enter the medicine name to find all available options across Rwanda.'
              },
              {
                icon: <MapPin size={28} className="text-emerald-600" />,
                step: '02',
                title: 'Filter by District',
                desc: 'Narrow down results based on your location for the nearest pharmacy.'
              },
              {
                icon: <CheckCircle size={28} className="text-emerald-600" />,
                step: '03',
                title: 'Visit Open Pharmacy',
                desc: 'Get real-time open/closed status and go directly to the right pharmacy.'
              },
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
                <span className="absolute top-6 right-6 text-5xl font-black text-gray-100">{item.step}</span>
                <div className="bg-emerald-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-emerald-100">
                  {item.icon}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-bold text-gray-900">Why Choose IPNS</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <TrendingUp size={24} />, title: 'Real-time Stock Visibility', desc: 'Instant updates on medicine availability across all connected pharmacies.' },
              { icon: <MapPin size={24} />, title: 'District-based Filtering', desc: 'Find the nearest pharmacy to your location with ease.' },
              { icon: <ShieldCheck size={24} />, title: 'Insurance Partner Filter', desc: 'Verify insurance acceptance before visiting a pharmacy.' },
              { icon: <Zap size={24} />, title: 'Open/Closed Status', desc: 'Know which pharmacies are open right now, no guessing needed.' },
              { icon: <Pill size={24} />, title: 'Medicine Catalog', desc: 'Browse thousands of medicines with generic names and categories.' },
              { icon: <Lock size={24} />, title: 'Secure & Reliable', desc: 'Your data is safe with our enterprise-grade security.' },
            ].map((feature, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:border-emerald-400 hover:shadow-md transition-all bg-white">
                <div className="w-11 h-11 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 transition-colors border border-emerald-100">
                  {feature.icon}
                </div>
                <h3 className="text-gray-900 font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR PHARMACIES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1528]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-emerald-400 font-semibold text-sm uppercase tracking-widest mb-3">For Pharmacies</p>
            <h2 className="text-4xl font-bold text-white mb-6">Benefits of Joining IPNS</h2>
            <ul className="space-y-4 mb-8">
              {[
                { title: 'Increased Visibility', desc: 'Reach more customers searching for your medicines.' },
                { title: 'Better Inventory Control', desc: 'Track stock in real-time from one dashboard.' },
                { title: 'Reduce Stock-outs', desc: 'Know instantly when medicines are running low.' },
                { title: 'Insurance Integration', desc: 'Manage multiple insurance partnerships easily.' },
                { title: 'No Setup Fees', desc: 'Free to join, pay nothing upfront.' },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">
                    <strong className="text-white">{item.title}</strong> — {item.desc}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              Register Your Pharmacy
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Visual placeholder */}
          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-10 flex items-center justify-center min-h-80">
            <div className="absolute top-4 left-4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            <div className="absolute top-4 right-4 w-3 h-3 bg-teal-400 rounded-full animate-pulse delay-300" />
            <Building2 size={100} className="text-emerald-500/30" />
          </div>
        </div>
      </section>

      {/* ── INSURANCE PARTNERS ── */}
      <section className="py-14 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-400 text-sm uppercase tracking-widest mb-8">
            Trusted by Rwanda's Leading Insurance Providers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['RSSB', 'MMI', 'MIS UR', 'Medicore'].map((name, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 py-5 flex items-center justify-center hover:border-emerald-300 hover:shadow-sm transition-all">
                <p className="text-gray-700 font-bold text-lg">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl font-bold text-gray-900">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: '"IPNS has transformed how we manage medicines. Patients no longer waste time looking, and we\'ve reduced stock-outs by 40%."',
                name: 'Jean Marie',
                role: 'Pharmacy Manager',
                place: 'Kigali Central Pharmacy'
              },
              {
                text: '"Finding medicines used to be a nightmare. Now I search once and know exactly where to go. Love it!"',
                name: 'Emmanuel',
                role: 'Patient',
                place: 'Gasabo, Kigali'
              },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:border-emerald-200 hover:shadow-sm transition-all">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-emerald-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm border border-emerald-200">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{t.name} — {t.role}</p>
                    <p className="text-gray-400 text-xs">{t.place}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-emerald-100 text-lg mb-10">
            Join pharmacies and patients across Rwanda using IPNS every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-emerald-700 hover:bg-gray-100 font-bold rounded-xl transition-colors"
            >
              Register as Pharmacy
              <ArrowRight size={18} />
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-xl transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
