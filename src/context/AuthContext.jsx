import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Kept for compatibility if used

  const fetchProfile = useCallback(() => {
    const token = localStorage.getItem('mongomeals-token');
    if (token) {
      apiFetch('/auth/profile')
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('mongomeals-token');
          setUser(null);
        });
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    localStorage.setItem('mongomeals-token', data.token);
    const { token, ...userData } = data;
    setUser(userData);
    return userData;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('mongomeals-token', data.token);
    const { token, ...userData } = data;
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mongomeals-token');
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    users, // empty array now, should probably fetch from API if admin
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    fetchProfile,
  }), [user, users, register, login, logout, fetchProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
