// components
export { GatedlyProvider } from './components/GatedlyProvider';
export { FeatureFlag } from './components/FeatureFlag';

// hooks
export { useFeatureFlag } from './hooks/useFeatureFlag';
export { useFeatureFlags } from './hooks/useFeatureFlags';

// context
export { GatedlyContext, useGatedlyContext } from './context/gatedly.context';

// types
export type { GatedlyOptions } from './interfaces/gatedly-options.interface';
export type { FlagContext } from './interfaces/flag-context.interface';
export type { FlagResponse } from './interfaces/flag-response.interface';
