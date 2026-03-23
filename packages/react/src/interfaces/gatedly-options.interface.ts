export interface GatedlyOptions {
  apiKey: string;
  baseUrl?: string; // default: https://api.gatedly.dev
  cache?: {
    ttl?: number; // seconds, default: 30
    enabled?: boolean; // default: true
  };
  timeout?: number; // ms, default: 5000
}
