import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isPharmacist, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.pathname = '/login';
    return null;
  }

  if (requiredRole === 'pharmacist' && !isPharmacist) {
    window.location.pathname = '/unauthorized';
    return null;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    window.location.pathname = '/unauthorized';
    return null;
  }

  return children;
};
