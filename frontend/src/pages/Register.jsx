import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, AlertCircle, Store, MapPin, Clock, Lock, Upload, X, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ProgressBar } from '../components/Cards';
import InsurancePartnerSelector from '../components/InsurancePartnerSelector';
import logo from '../assets/images/LOGO.png';

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);

  // Form Data
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    pharmacy_name: '',
    phone_number: '',
    email: '',

    // Step 2: Location
    province_id: '',
    district_id: '',
    sector_id: '',
    street_address: '',

    // Step 3: Hours & Insurance
    opening_time: '08:00',
    closing_time: '20:00',
    insurance_ids: [],

    // Step 4: Password
    password: '',
    password_confirm: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [insurances, setInsurances] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.province_id) {
      fetchDistricts(formData.province_id);
      // Reset district and sector when province changes
      setFormData(prev => ({ ...prev, district_id: '', sector_id: '' }));
      setSectors([]);
    }
  }, [formData.province_id]);

  useEffect(() => {
    if (formData.district_id) {
      fetchSectors(formData.district_id);
      // Reset sector when district changes
      setFormData(prev => ({ ...prev, sector_id: '' }));
    }
  }, [formData.district_id]);

  const fetchInitialData = async () => {
    try {
      const [provinceRes, insuranceRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/locations/provinces/'),
        fetch('http://localhost:8000/api/v1/insurance/providers/')
      ]);

      if (provinceRes.ok) {
        const data = await provinceRes.json();
        const provinceList = Array.isArray(data) ? data : (data.results || []);
        setProvinces(provinceList);
      }

      if (insuranceRes.ok) {
        const data = await insuranceRes.json();
        const insuranceList = Array.isArray(data) ? data : (data.results || []);
        setInsurances(insuranceList);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setInsurances([]);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/locations/provinces/${provinceId}/districts/`);
      if (response.ok) {
        const data = await response.json();
        const districtList = Array.isArray(data) ? data : (data.results || []);
        setDistricts(districtList);
      }
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      setDistricts([]);
    }
  };

  const fetchSectors = async (districtId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/locations/districts/${districtId}/sectors/`);
      if (response.ok) {
        const data = await response.json();
        const sectorList = Array.isArray(data) ? data : (data.results || []);
        setSectors(sectorList);
      }
    } catch (error) {
      console.error('Failed to fetch sectors:', error);
      setSectors([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogoPreview = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const validateStep = () => {
    setError('');
    
    if (step === 1) {
      if (!formData.pharmacy_name.trim()) {
        setError('Pharmacy name is required');
        return false;
      }
      if (!formData.phone_number.trim()) {
        setError('Phone number is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
    } else if (step === 2) {
      if (!formData.province_id) {
        setError('Province is required');
        return false;
      }
      if (!formData.district_id) {
        setError('District is required');
        return false;
      }
      if (!formData.sector_id) {
        setError('Sector is required');
        return false;
      }
    } else if (step === 4) {
      if (!formData.password || formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      if (formData.password !== formData.password_confirm) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    // Create FormData for multipart file upload
    const data = new FormData();
    data.append('pharmacy_name', formData.pharmacy_name);
    data.append('phone_number', formData.phone_number);
    data.append('email', formData.email);
    data.append('sector_id', parseInt(formData.sector_id));
    data.append('street_address', formData.street_address);
    data.append('opening_time', formData.opening_time);
    data.append('closing_time', formData.closing_time);
    data.append('password', formData.password);
    
    formData.insurance_ids.forEach((id) => {
      data.append('insurance_ids', Number(id));
    });
    
    // Add logo file if selected
    if (logoFile) {
      data.append('logo', logoFile);
    }

    const result = await register(data);

    if (result.success) {
      window.location.pathname = '/dashboard';
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="IPNS Logo" className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Pharmacy</h1>
          <p className="text-gray-600">Join our network in just 4 steps</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={step} totalSteps={4} />

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle size={20} className="text-red-700 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Store size={24} className="text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Pharmacy Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Pharmacy Name</label>
                  <input
                    type="text"
                    name="pharmacy_name"
                    value={formData.pharmacy_name}
                    onChange={handleChange}
                    placeholder="e.g., Central Pharmacy Kigali"
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+250 788 123 456"
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="manager@pharmacy.rw"
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Pharmacy Logo Upload */}
                <div className="pt-4 border-t border-gray-200 mt-6">
                  <label className="block text-gray-700 text-sm font-semibold mb-4">Pharmacy Logo (Optional)</label>
                  <div className="space-y-3">
                    <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative group cursor-pointer hover:bg-gray-50 transition">
                      {logoPreview ? (
                        <>
                          <img src={logoPreview} alt="Logo preview" className="h-full w-auto object-contain p-4" />
                          <button
                            type="button"
                            onClick={clearLogoPreview}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex items-center justify-center cursor-pointer">
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm font-medium">Click to upload logo</p>
                            <p className="text-gray-500 text-xs">PNG, JPG, GIF (max 5MB)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    {logoFile && (
                      <p className="text-sm text-emerald-600">✓ {logoFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={24} className="text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Location Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Province</label>
                  <select
                    name="province_id"
                    value={formData.province_id}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Select Province</option>
                    {provinces.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">District</label>
                  <select
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleChange}
                    disabled={!formData.province_id}
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                  >
                    <option value="">Select District</option>
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Sector</label>
                  <select
                    name="sector_id"
                    value={formData.sector_id}
                    onChange={handleChange}
                    disabled={!formData.district_id}
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                  >
                    <option value="">Select Sector</option>
                    {sectors.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    placeholder="123 Main Street, KG 123"
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Hours & Insurance */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock size={24} className="text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Operating Hours & Insurance</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Opening Time</label>
                    <input
                      type="time"
                      name="opening_time"
                      value={formData.opening_time}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Closing Time</label>
                    <input
                      type="time"
                      name="closing_time"
                      value={formData.closing_time}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden />
                    <div>
                      <label className="block text-gray-900 text-sm font-semibold">
                        Insurance partners
                      </label>
                      <p className="text-gray-600 text-sm">
                        Select every scheme and insurer you accept. You can change this later in your dashboard.
                      </p>
                    </div>
                  </div>
                  <InsurancePartnerSelector
                    embedded
                    providers={insurances}
                    selectedIds={formData.insurance_ids}
                    onSelectedIdsChange={(ids) =>
                      setFormData((prev) => ({ ...prev, insurance_ids: ids }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Password */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Lock size={24} className="text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Create Password</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <p className="text-gray-500 text-xs mt-2">Must be at least 8 characters</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            {step === 4 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Registering...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
