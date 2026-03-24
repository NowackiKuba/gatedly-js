import { useEffect, useState } from "react";
import { useGatedlyContext } from "../context/gatedly.context";
import { FlagContext } from "../interfaces/flag-context.interface";
import { DEFAULT_TTL } from "../constants";

interface UseFeatureFlagResult {
  enabled: boolean;
  loading: boolean;
  error: Error | null;
  variant: string | null;
  experimentId: string | null;
}

export const useFeatureFlag = (
  key: string,
  context?: FlagContext,
): UseFeatureFlagResult => {
  const { client, cache, userId } = useGatedlyContext();
  const [enabled, setEnabled] = useState<boolean>(false);
  const [variant, setVariant] = useState<string | null>(null);
  const [experimentId, setExperimentId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const mergedContext: FlagContext = {
      userId: context?.userId ?? userId,
      attributes: context?.attributes,
    };

    const cacheKey = `${key}:${mergedContext.userId ?? "anonymous"}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      setEnabled(cached.enabled);
      setLoading(false);
      return;
    }

    setLoading(true);

    client
      .evaluate(key, mergedContext)
      .then((flag) => {
        cache.set(cacheKey, flag, DEFAULT_TTL);
        setEnabled(flag.enabled);
        setExperimentId(flag.experimentId ?? null);
        setVariant(flag.variant ?? null);
        setError(null);
      })
      .catch((err) => {
        setEnabled(false);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [key, context?.userId, context?.attributes]);

  return { enabled, loading, error, variant, experimentId };
};
