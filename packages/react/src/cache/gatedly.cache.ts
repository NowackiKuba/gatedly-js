import { FlagResponse } from 'src/interfaces/flag-response.interface';

export class GatedlyCache {
  private store = new Map<string, { value: FlagResponse; expiresAt: number }>();

  get(key: string): FlagResponse | null {
    const elem = this.store.get(key);

    if (!elem) {
      return null;
    }

    if (Date.now() >= elem.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return elem.value;
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
