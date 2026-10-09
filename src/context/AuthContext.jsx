import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Auth validation failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
      travelPreference: response.travelPreference,
      budgetPreference: response.budgetPreference
    });
    return response;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
      travelPreference: response.travelPreference,
      budgetPreference: response.budgetPreference
    });
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const isAdmin = user && user.role === 'ROLE_ADMIN';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      isAdmin,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
