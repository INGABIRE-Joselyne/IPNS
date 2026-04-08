import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Load user on app start
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/user/', {
        headers: { Authorization: `Token ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const userData = data.data || data;
        setUser(userData);
      } else {
        // Token invalid
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (pharmacyData) => {
    try {
      // Determine if data is FormData (file upload) or JSON
      const isFormData = pharmacyData instanceof FormData;
      const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
      const body = isFormData ? pharmacyData : JSON.stringify(pharmacyData);

      const response = await fetch('http://localhost:8000/api/v1/auth/register/', {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errors?.detail?.[0] || data.message || 'Registration failed');
      }

      const data = await response.json();
      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isPharmacist: user?.role === 'pharmacist',
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
