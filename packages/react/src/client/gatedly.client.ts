import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT } from 'src/constants';
import { FlagContext } from 'src/interfaces/flag-context.interface';
import { FlagResponse } from 'src/interfaces/flag-response.interface';
import { GatedlyOptions } from 'src/interfaces/gatedly-options.interface';

export class GatedlyClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(private readonly options: GatedlyOptions) {
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
  }

  async evaluate(key: string, context?: FlagContext): Promise<FlagResponse> {
    return this.fetch<FlagResponse>('/api/v1/evaluation', { flagKey: key, userId: context?.userId, attributes: context?.attributes });
  }

  async evaluateBatch(keys: string[], context?: FlagContext): Promise<FlagResponse[]> {
    return this.fetch<FlagResponse[]>('/api/v1/evaluation/batch', { flagKeys: keys, userId: context?.userId, attributes: context?.attributes });
  }

  private async fetch<T>(path: string, body: unknown): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.options.apiKey}` },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Gatedly API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Gatedly API timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}
