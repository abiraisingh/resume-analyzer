import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await api.get('/auth/me');
          if (active) {
            setToken(storedToken);
            setUser(response.data.user);
            setError(null);
          }
        } catch {
          if (active) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setError('Session expired. Please sign in again.');
          }
        }
      }

      if (active) setLoading(false);
    };

    verifyToken();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (requestError) {
      const message = requestError.response?.data?.error || 'Login failed';
      setError(message);
      throw requestError;
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    } catch (requestError) {
      const message = requestError.response?.data?.error || 'Registration failed';
      setError(message);
      throw requestError;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token && user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
