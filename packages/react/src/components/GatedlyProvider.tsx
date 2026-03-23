import React, { useMemo } from 'react';
import { GatedlyContext } from '../context/gatedly.context';
import { GatedlyClient } from '../client/gatedly.client';
import { GatedlyCache } from '../cache/gatedly.cache';
import { GatedlyOptions } from '../interfaces/gatedly-options.interface';

interface GatedlyProviderProps extends GatedlyOptions {
  userId?: string;
  children: React.ReactNode;
}

export const GatedlyProvider: React.FC<GatedlyProviderProps> = ({ children, userId, ...options }) => {
  const client = useMemo(() => new GatedlyClient(options), [options.apiKey]);
  const cache = useMemo(() => new GatedlyCache(), []);

  return <GatedlyContext.Provider value={{ client, cache, userId }}>{children}</GatedlyContext.Provider>;
};
