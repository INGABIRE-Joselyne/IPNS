/**
 * API configuration and helper functions
 * Base URL: http://localhost:8000/api/v1/
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Generic fetch wrapper with error handling
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * GET request
 */
export const apiGet = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return apiCall(url);
};

/**
 * POST request
 */
export const apiPost = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 */
export const apiPut = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
export const apiDelete = (endpoint) => {
  return apiCall(endpoint, {
    method: 'DELETE',
  });
};

// API Endpoints
export const endpoints = {
  // Locations
  provinces: '/locations/provinces/',
  districts: '/locations/districts/',
  sectors: '/locations/sectors/',
  
  // Insurance
  insurance: '/insurance/providers/',
  
  // Medicines
  medicines: '/medicines/',
  medicineSearch: '/medicines/search/',
  medicineCategories: '/medicines/categories/',
  
  // Pharmacies
  pharmacies: '/pharmacies/',
  pharmaciesByDistrict: '/pharmacies/by_district/',
  pharmaciesOpenNow: '/pharmacies/open_now/',
  
  // Inventory
  stock: '/inventory/stock/',
  stockByPharmacy: '/inventory/stock/by_pharmacy/',
  searchMedicineAvailability: '/inventory/stock/search_medicine/',
  outOfStock: '/inventory/stock/out_of_stock/',
  expiredStock: '/inventory/stock/expired/',
};
