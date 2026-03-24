import type { FlagResponse } from "./types";

export class GatedlyCache {
  private store = new Map<string, { value: FlagResponse; expiresAt: number }>();

  get(key: string): FlagResponse | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: FlagResponse, ttl: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  clear(): void {
    this.store.clear();
  }
}
