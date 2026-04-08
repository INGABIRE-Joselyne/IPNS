import React, { useState, useEffect } from 'react';
import { AlertCircle, Shield, Check, X, Loader } from 'lucide-react';

const DashboardInsuranceManagement = ({ pharmacy, setPharmacy, token, onRefresh }) => {
  const [allInsurances, setAllInsurances] = useState([]);
  const [selectedInsurances, setSelectedInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadInsurances();
  }, []);

  useEffect(() => {
    if (pharmacy.insurance_providers) {
      setSelectedInsurances(pharmacy.insurance_providers.map(p => p.id));
    }
  }, [pharmacy]);

  const loadInsurances = async () => {
    try {
      setError('');
      const response = await fetch('http://localhost:8000/api/v1/insurance/providers/', {
        headers: { Authorization: `Token ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch insurance providers');
      const data = await response.json();
      setAllInsurances(data.results || data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInsuranceToggle = (insuranceId) => {
    setHasChanges(true);
    setSelectedInsurances(prev => {
      if (prev.includes(insuranceId)) {
        return prev.filter(id => id !== insuranceId);
      } else {
        return [...prev, insuranceId];
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await fetch(`http://localhost:8000/api/v1/pharmacies/${pharmacy.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          insurance_provider_ids: selectedInsurances
        })
      });

      if (!response.ok) throw new Error('Failed to update insurance partners');
      const updatedPharmacy = await response.json();
      setPharmacy(updatedPharmacy);
      setHasChanges(false);
      setSuccess('Insurance partners updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="text-emerald-600" size={32} />
          Insurance Partners Management
        </h1>
        <p className="text-gray-600 mt-1">Select which insurance providers your pharmacy accepts</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-700" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-700" />
          <p className="text-emerald-700">{success}</p>
        </div>
      )}

      {/* Insurance Selection Grid */}
      {allInsurances.length > 0 ? (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">
                  Selected: <span className="font-bold text-emerald-600">{selectedInsurances.length}</span> of {allInsurances.length}
                </p>
              </div>
            </div>

            {/* Insurance Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allInsurances.map(insurance => {
                const isSelected = selectedInsurances.includes(insurance.id);
                return (
                  <div
                    key={insurance.id}
                    onClick={() => handleInsuranceToggle(insurance.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all mt-1 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <Check size={16} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{insurance.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Code: {insurance.code}</p>
                        {insurance.description && (
                          <p className="text-sm text-gray-600 mt-2">{insurance.description}</p>
                        )}
                        {insurance.contact_phone && (
                          <p className="text-xs text-gray-500 mt-2">📞 {insurance.contact_phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          {hasChanges && (
            <div className="flex gap-4">
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Save Insurance Partners
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedInsurances(pharmacy.insurance_providers.map(p => p.id));
                  setHasChanges(false);
                }}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <X size={18} />
                Discard Changes
              </button>
            </div>
          )}

          {/* Current Selection Summary */}
          {selectedInsurances.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Currently Selected Partners</h3>
              <div className="flex flex-wrap gap-2">
                {allInsurances
                  .filter(ins => selectedInsurances.includes(ins.id))
                  .map(ins => (
                    <span
                      key={ins.id}
                      className="inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-semibold"
                    >
                      {ins.name}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No insurance providers available</p>
        </div>
      )}
    </div>
  );
};

export default DashboardInsuranceManagement;
