export interface FlagResponse {
  key: string;
  enabled: boolean;
  variant?: string | null;
  payload?: Record<string, unknown> | null;
}
