import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT, DEFAULT_TTL } from "./constants";
import { GatedlyCache } from "./cache";
import type { FlagContext, FlagResponse, GatedlyOptions } from "./types";

export class Gatedly {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly ttl: number;
  private readonly cacheEnabled: boolean;
  private readonly cache: GatedlyCache;

  constructor(private readonly options: GatedlyOptions) {
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.ttl = options.cache?.ttl ?? DEFAULT_TTL;
    this.cacheEnabled = options.cache?.enabled ?? true;
    this.cache = new GatedlyCache();
  }

  async isEnabled(key: string, context?: FlagContext): Promise<boolean> {
    const flag = await this.getFlag(key, context);
    return flag.enabled;
  }

  async getFlag(key: string, context?: FlagContext): Promise<FlagResponse> {
    if (this.cacheEnabled) {
      const cacheKey = this.buildCacheKey(key, context);
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const response = await this.fetch<FlagResponse>("/api/v1/evaluation", {
      flagKey: key,
      userId: context?.userId ?? "",
      attributes: context?.attributes ?? {},
    });

    if (this.cacheEnabled) {
      this.cache.set(this.buildCacheKey(key, context), response, this.ttl);
    }

    return response;
  }

  async getFlags(
    keys: string[],
    context?: FlagContext,
  ): Promise<FlagResponse[]> {
    return this.fetch<FlagResponse[]>("/api/v1/evaluation/batch", {
      flagKeys: keys,
      userId: context?.userId ?? "",
      attributes: context?.attributes ?? {},
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  private buildCacheKey(key: string, context?: FlagContext): string {
    return `${key}:${context?.userId ?? "anonymous"}`;
  }

  private async fetch<T>(path: string, body: unknown): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.options.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Gatedly API error: ${response.status}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Gatedly API timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}
