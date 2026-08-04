'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { testBackendConnection } from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  backendConnected: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  googleOAuthLogin: (payload: { email: string; username: string; googleId: string; avatar?: string }) => Promise<User>;
  checkUserSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [backendConnected, setBackendConnected] = useState<boolean>(true);

  const checkUserSession = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.user);
        // Persist role/user details in localStorage for faster route guard checking on boot
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check backend connection on app startup
    const checkBackend = async () => {
      const isConnected = await testBackendConnection();
      setBackendConnected(isConnected);
      if (!isConnected) {
        console.warn('⚠️ Backend server is not reachable. Check if it is running.');
      }
    };
    
    checkBackend();
    checkUserSession();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await API.post('/auth/login', { email, password });
      
      // Check if the request was successful
      if (!res.data.success) {
        throw new Error(res.data.message || 'Login failed');
      }
      
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      return userData;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check your connection.');
    }
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    try {
      const res = await API.post('/auth/register', { username, email, password });
      
      // Check if the request was successful
      if (!res.data.success) {
        throw new Error(res.data.message || 'Registration failed');
      }
      
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      return userData;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check your connection.');
    }
  };

  const googleOAuthLogin = async (payload: {
    email: string;
    username: string;
    googleId: string;
    avatar?: string;
  }): Promise<User> => {
    try {
      const res = await API.post('/auth/google', payload);
      
      // Check if the request was successful
      if (!res.data.success) {
        throw new Error(res.data.message || 'Google authentication failed');
      }
      
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      return userData;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw error;
      }
      throw new Error(error.message || 'Network error. Please check your connection.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await API.get('/auth/logout');
    } catch (error) {
      console.error('Logout API failed, clearing local state', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        backendConnected,
        login,
        register,
        logout,
        googleOAuthLogin,
        checkUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
