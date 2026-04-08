import React from 'react';
import { Building2, Heart, MapPin, Clock, Star } from 'lucide-react';

export const StatCard = ({ icon: Icon, label, value, trend = null }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-emerald-600 text-xs mt-2">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className="bg-emerald-100 p-3 rounded-lg">
            <Icon size={24} className="text-emerald-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export const PharmacyCard = ({ pharmacy, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all">
      <div className="bg-gradient-to-br from-emerald-100 to-teal-100 h-32 flex items-center justify-center">
        <Building2 size={48} className="text-emerald-300" />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-900 font-semibold">{pharmacy.name}</h3>
          <Heart size={18} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
        </div>
        
        <p className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-3 ${
          pharmacy.status === 'open' 
            ? 'bg-emerald-100 text-emerald-700' 
            : pharmacy.status === 'closing_soon'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {pharmacy.status === 'open' ? 'Open' : pharmacy.status === 'closing_soon' ? 'Closing Soon' : 'Closed'}
        </p>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex gap-2 items-center">
            <MapPin size={16} className="text-emerald-600" />
            {pharmacy.sector?.name || pharmacy.sector?.district?.name}
          </div>
          <div className="flex gap-2 items-center">
            <Clock size={16} className="text-emerald-600" />
            {pharmacy.opening_time} - {pharmacy.closing_time}
          </div>
          {pharmacy.insurance_providers?.length > 0 && (
            <div className="flex gap-2 items-center">
              <Star size={16} className="text-emerald-600" />
              {pharmacy.insurance_providers.length} insurance partners
            </div>
          )}
        </div>

        <button 
          onClick={() => onViewDetails(pharmacy.id)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-sm font-semibold transition-colors mb-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export const MedicineCard = ({ medicine, pharmacy, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(medicine)}
      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-400 cursor-pointer transition-all hover:shadow-lg"
    >
      <h4 className="text-gray-900 font-semibold text-sm mb-1">{medicine.name}</h4>
      <p className="text-gray-600 text-xs mb-2">{medicine.generic_name}</p>
      
      {pharmacy && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-emerald-600 text-xs font-semibold mb-1">{pharmacy.name}</p>
          <p className={`text-xs font-semibold ${
            medicine.in_stock ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {medicine.in_stock ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      )}
    </div>
  );
};

export const ProgressBar = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-600">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, action = null }) => {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="text-gray-400 mb-4 flex justify-center">
          <Icon size={48} />
        </div>
      )}
      <h3 className="text-gray-900 font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && action}
    </div>
  );
};
