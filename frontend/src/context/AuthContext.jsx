import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('imovies_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('imovies_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser((prev) => ({ ...prev, ...res.data.user }));
            localStorage.setItem('imovies_user', JSON.stringify({ ...user, ...res.data.user }));
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const userData = res.data.user;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('imovies_token', userData.token);
      localStorage.setItem('imovies_user', JSON.stringify(userData));
      setIsAuthModalOpen(false);
      return userData;
    }
  };

  const register = async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone });
    if (res.data.success) {
      const userData = res.data.user;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('imovies_token', userData.token);
      localStorage.setItem('imovies_user', JSON.stringify(userData));
      setIsAuthModalOpen(false);
      return userData;
    }
  };

  const quickLogin = async (role = 'user') => {
    const email = role === 'admin' ? 'admin@imovies.com' : 'user@imovies.com';
    const password = role === 'admin' ? 'admin123' : 'password123';
    return await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_user');
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        quickLogin,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

