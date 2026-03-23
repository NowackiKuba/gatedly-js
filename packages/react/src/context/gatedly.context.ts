import { createContext, useContext } from 'react';
import { GatedlyClient } from '../client/gatedly.client';
import { GatedlyCache } from '../cache/gatedly.cache';

export interface GatedlyContextValue {
  client: GatedlyClient;
  cache: GatedlyCache;
  userId?: string;
}

export const GatedlyContext = createContext<GatedlyContextValue | null>(null);

export const useGatedlyContext = (): GatedlyContextValue => {
  const context = useContext(GatedlyContext);
  if (!context) {
    throw new Error('useGatedlyContext must be used within GatedlyProvider');
  }
  return context;
};
