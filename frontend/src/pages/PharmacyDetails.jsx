import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { apiGet, endpoints } from '../utils/api';

const PharmacyDetails = ({ pharmacyId }) => {
  const [pharmacy, setPharmacy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPharmacyDetails();
  }, [pharmacyId]);

  const loadPharmacyDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiGet(`${endpoints.pharmacies}${pharmacyId}/`);
      setPharmacy(data);
    } catch (err) {
      console.error('Failed to load pharmacy details:', err);
      setError('Failed to load pharmacy details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'closing_soon':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'closed':
        return 'bg-red-100 text-red-700 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-gray-600 mt-4">Loading pharmacy details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Pharmacies
          </button>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <p className="text-gray-600 text-lg">{error || 'Pharmacy not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Pharmacies
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 shadow-sm">
          {/* Pharmacy Logo */}
          {pharmacy.logo && (
            <div className="mb-6 flex justify-center">
              <img src={pharmacy.logo} alt={pharmacy.name} className="h-24 w-auto object-contain rounded-lg" />
            </div>
          )}
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{pharmacy.name}</h1>
              <p className="text-gray-600">{pharmacy.description}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(pharmacy.current_status)}`}>
              {getStatusDisplay(pharmacy.current_status)}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Key Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Location */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">{pharmacy.street_address || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">District</p>
                    <p className="text-gray-600">{pharmacy.district_name || 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Sector</p>
                    <p className="text-gray-600">{pharmacy.sector_name || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="text-emerald-600" size={24} />
                Operating Hours
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-600 font-semibold">Hours</span>
                <span className="text-gray-900 font-bold text-lg">
                  {pharmacy.opening_time} - {pharmacy.closing_time}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-emerald-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href={`tel:${pharmacy.phone_number}`} className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                      {pharmacy.phone_number}
                    </a>
                  </div>
                </div>
                {pharmacy.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="text-emerald-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a href={`mailto:${pharmacy.email}`} className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                        {pharmacy.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Insurance & Actions */}
          <div className="space-y-6">
            {/* Insurance Providers */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="text-emerald-600" size={24} />
                Insurance
              </h2>
              {pharmacy.insurance_providers && pharmacy.insurance_providers.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    This pharmacy accepts <span className="font-bold text-emerald-600">{pharmacy.insurance_providers.length}</span> insurance provider{pharmacy.insurance_providers.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-2">
                    {pharmacy.insurance_providers.map((insurance) => (
                      <div key={insurance.id} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <span className="text-emerald-600 text-lg">✓</span>
                        <span className="text-gray-900 font-medium">{insurance.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-600">No insurance information available</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${pharmacy.phone_number}`}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Call Now
                </a>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-colors">
                  Share Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetails;
