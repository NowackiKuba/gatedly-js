export type FlagContext = {
  userId?: string;
  attributes?: Record<string, unknown>;
};

export type FlagResponse = {
  flagKey: string;
  enabled: boolean;
  reason: string;
  variant?: string;
  experimentId?: string;
};

export type GatedlyOptions = {
  apiKey: string;
  baseUrl?: string;
  cache?: {
    ttl?: number;
    enabled?: boolean;
  };
  timeout?: number;
};
