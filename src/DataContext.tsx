import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PublicSettings, ServiceAddon, TrailerItem } from './types';
import { fetchFleet, fetchPublicSettings } from './api';

interface DataContextValue {
  fleet: TrailerItem[];
  addons: ServiceAddon[];
  settings: PublicSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

const DEFAULT_SETTINGS: PublicSettings = {
  bookingEnabled: true,
  businessName: 'Hitch & Haul Trailer Rental LLC',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fleet, setFleet] = useState<TrailerItem[]>([]);
  const [addons, setAddons] = useState<ServiceAddon[]>([]);
  const [settings, setSettings] = useState<PublicSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [f, s] = await Promise.all([
        fetchFleet(),
        fetchPublicSettings().catch(() => DEFAULT_SETTINGS),
      ]);
      setFleet(f);
      setSettings(s);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Static addons (kept in sync with backend seed)
    setAddons([
      { id: 'job-delivery', name: 'Job Site Trailer Delivery & Pick-Up', description: 'Direct delivery and retrieval to your job site.', price: 50, priceNote: '$50 / drop' },
      { id: 'straps-rigging', name: 'Heavy-Duty Straps & Chains Kit', description: 'Commercial straps, chains and binders.', price: 25, priceNote: '$25 / rental' },
      { id: 'hitch-receiver', name: 'Hitch Receiver & Ball Kit', description: 'Adjustable 2-5/16" or 2" drop-hitch assembly.', price: 15, priceNote: '$15 / rental' },
    ]);
    refresh();
  }, [refresh]);

  return (
    <DataContext.Provider value={{ fleet, addons, settings, loading, refresh }}>
      {children}
    </DataContext.Provider>
  );
};

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
