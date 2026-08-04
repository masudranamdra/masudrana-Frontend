'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../lib/api';
import { ConfigSettings } from '../types';

interface ConfigContextType {
  config: ConfigSettings | null;
  loading: boolean;
  fetchConfig: () => Promise<void>;
  updateConfig: (newSettings: Partial<ConfigSettings>) => Promise<ConfigSettings>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ConfigSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await API.get('/config');
      if (res.data && res.data.success) {
        setConfig(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch site config settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newSettings: Partial<ConfigSettings>): Promise<ConfigSettings> => {
    const res = await API.put('/config', newSettings);
    if (res.data && res.data.success) {
      setConfig(res.data.data);
      return res.data.data;
    }
    throw new Error(res.data.message || 'Failed to update configurations');
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading, fetchConfig, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
