import { useEffect, useState } from 'react';
import { useGatedlyContext } from '../context/gatedly.context';
import { FlagContext } from '../interfaces/flag-context.interface';
import { FlagResponse } from '../interfaces/flag-response.interface';
import { DEFAULT_TTL } from '../constants';

interface UseFeatureFlagsResult {
  flags: Record<string, boolean>;
  responses: FlagResponse[];
  loading: boolean;
  error: Error | null;
}

export const useFeatureFlags = (keys: string[], context?: FlagContext): UseFeatureFlagsResult => {
  const { client, cache, userId } = useGatedlyContext();
  const [responses, setResponses] = useState<FlagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const mergedContext: FlagContext = {
      userId: context?.userId ?? userId,
      attributes: context?.attributes,
    };

    const cacheKey = `batch:${keys.join(',')}:${mergedContext.userId ?? 'anonymous'}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      setResponses([cached]);
      setLoading(false);
      return;
    }

    setLoading(true);

    client
      .evaluateBatch(keys, mergedContext)
      .then((flags) => {
        flags.forEach((flag) => {
          const key = `${flag.flagKey}:${mergedContext.userId ?? 'anonymous'}`;
          cache.set(key, flag, DEFAULT_TTL);
        });
        setResponses(flags);
        setError(null);
      })
      .catch((err) => {
        setResponses([]);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keys.join(','), context?.userId]);

  const flags = responses.reduce<Record<string, boolean>>((acc, flag) => {
    acc[flag.flagKey] = flag.enabled;
    return acc;
  }, {});

  return { flags, responses, loading, error };
};
