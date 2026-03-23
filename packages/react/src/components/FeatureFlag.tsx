import React from 'react';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { FlagContext } from '../interfaces/flag-context.interface';

interface FeatureFlagProps {
  flag: string;
  context?: FlagContext;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  children: React.ReactNode;
}

export const FeatureFlag: React.FC<FeatureFlagProps> = ({ flag, context, fallback = null, loadingFallback = null, children }) => {
  const { enabled, loading } = useFeatureFlag(flag, context);

  if (loading) return <>{loadingFallback}</>;
  if (!enabled) return <>{fallback}</>;
  return <>{children}</>;
};
