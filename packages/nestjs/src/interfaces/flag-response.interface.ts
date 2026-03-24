export interface FlagResponse {
  flagKey: string;
  enabled: boolean;
  reason: string;
  variant?: string;
  experimentId?: string;
}
