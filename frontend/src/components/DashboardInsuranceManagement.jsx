import React, { useState, useEffect } from 'react';
import { AlertCircle, Shield, Check, X, Loader } from 'lucide-react';
import InsurancePartnerSelector from './InsurancePartnerSelector';

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
    if (pharmacy?.insurance_providers) {
      setSelectedInsurances(pharmacy.insurance_providers.map((p) => p.id));
      setHasChanges(false);
    }
  }, [pharmacy]);

  const loadInsurances = async () => {
    try {
      setError('');
      const response = await fetch('http://localhost:8000/api/v1/insurance/providers/', {
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch insurance providers');
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.results || [];
      setAllInsurances(list);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSelectionChange = (ids) => {
    setHasChanges(true);
    setSelectedInsurances(ids);
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
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          insurance_provider_ids: selectedInsurances,
        }),
      });

      if (!response.ok) throw new Error('Failed to update insurance partners');
      const updatedPharmacy = await response.json();
      setPharmacy(updatedPharmacy);
      setHasChanges(false);
      setSuccess('Insurance partners updated successfully.');
      setTimeout(() => setSuccess(''), 4000);
      onRefresh?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    const providers = pharmacy?.insurance_providers || [];
    setSelectedInsurances(providers.map((p) => p.id));
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Shield className="h-6 w-6" aria-hidden />
          </span>
          Insurance partners
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Keep this list aligned with your contracts and counter acceptance policy. Patients rely on it when
          choosing your pharmacy.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
          <Check className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <InsurancePartnerSelector
        providers={allInsurances}
        selectedIds={selectedInsurances}
        onSelectedIdsChange={handleSelectionChange}
      />

      {hasChanges && (
        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                Save changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
            Discard
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardInsuranceManagement;
