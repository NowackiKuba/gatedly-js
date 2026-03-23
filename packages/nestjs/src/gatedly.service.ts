import { Inject, Injectable } from '@nestjs/common';
import { GatedlyClient } from './gatedly.client';
import { GatedlyCache } from './gatedly.cache';
import { DEFAULT_TTL, GATEDLY_OPTIONS } from './constants';
import { GatedlyOptions } from './interfaces/gatedly-options.interface';
import { FlagContext } from './interfaces/flag-context.interface';
import { FlagResponse } from './interfaces/flag-response.interface';

@Injectable()
export class GatedlyService {
  constructor(
    private readonly client: GatedlyClient,
    private readonly cache: GatedlyCache,
    @Inject(GATEDLY_OPTIONS) private readonly options: GatedlyOptions,
  ) {}

  async isEnabled(key: string, context?: FlagContext): Promise<boolean> {
    const flag = await this.getFlag(key, context);

    return flag.enabled;
  }

  async getFlag(key: string, context?: FlagContext): Promise<FlagResponse> {
    const cacheKey = this.buildCacheKey(key, context);
    const cached = this.cache.get(cacheKey);

    if (cached) return cached;

    const flag = await this.client.evaluate(key, context);

    const ttl = this.options.cache?.ttl ?? DEFAULT_TTL;

    this.cache.set(cacheKey, flag, ttl);

    return flag;
  }

  async getAllFlags(keys: string[], context?: FlagContext): Promise<FlagResponse[]> {
    return this.client.evaluateBatch(keys, context);
  }

  private buildCacheKey(key: string, context?: FlagContext): string {
    return `${key}:${context?.userId ?? 'anonymous'}`;
  }
}
