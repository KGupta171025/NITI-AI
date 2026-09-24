import { CacheEntry, CacheStats } from "./types";

/**
 * Multi-Tier High-Performance Cache (L1 Memory + L2 Storage)
 * Accelerates scheme searches and AI calculations to sub-millisecond retrieval.
 */
export class MultiTierCacheManager {
  private memoryCache: Map<string, CacheEntry<unknown>> = new Map();
  private maxMemoryEntries: number;
  private defaultTtlMs: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(maxMemoryEntries = 500, defaultTtlMs = 300000) {
    this.maxMemoryEntries = maxMemoryEntries;
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Retrieve item checking L1 (Memory) then L2 (Storage)
   */
  public get<T>(key: string): { data: T; tier: "L1_MEMORY" | "L2_STORAGE" } | null {
    const now = Date.now();

    // 1. Check L1 Memory Cache
    const memEntry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    if (memEntry) {
      if (memEntry.expiresAt > now) {
        memEntry.hits++;
        this.hits++;
        return { data: memEntry.data, tier: "L1_MEMORY" };
      } else {
        this.memoryCache.delete(key);
      }
    }

    // 2. Check L2 Storage Cache
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const raw = sessionStorage.getItem(`niti_cache_${key}`);
        if (raw) {
          const entry: CacheEntry<T> = JSON.parse(raw);
          if (entry.expiresAt > now) {
            // Promote to L1
            this.setMemory(key, entry.data, entry.expiresAt - now);
            this.hits++;
            return { data: entry.data, tier: "L2_STORAGE" };
          } else {
            sessionStorage.removeItem(`niti_cache_${key}`);
          }
        }
      } catch {
        // Storage quota / parse handling
      }
    }

    this.misses++;
    return null;
  }

  /**
   * Set item into both L1 and L2 caches
   */
  public set<T>(key: string, data: T, ttlMs?: number): void {
    const actualTtl = ttlMs ?? this.defaultTtlMs;
    const expiresAt = Date.now() + actualTtl;

    // Set L1
    this.setMemory(key, data, actualTtl);

    // Set L2
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const entry: CacheEntry<T> = {
          data,
          expiresAt,
          createdAt: Date.now(),
          hits: 0
        };
        sessionStorage.setItem(`niti_cache_${key}`, JSON.stringify(entry));
      } catch {
        // Session storage overflow handled gracefully
      }
    }
  }

  private setMemory<T>(key: string, data: T, ttlMs: number): void {
    // Evict oldest entry if at capacity
    if (this.memoryCache.size >= this.maxMemoryEntries) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) this.memoryCache.delete(oldestKey);
    }

    this.memoryCache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
      createdAt: Date.now(),
      hits: 0
    });
  }

  public delete(key: string): void {
    this.memoryCache.delete(key);
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.removeItem(`niti_cache_${key}`);
    }
  }

  public clear(): void {
    this.memoryCache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  public getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRatio: total > 0 ? Math.round((this.hits / total) * 100) : 100,
      size: this.memoryCache.size,
      maxSize: this.maxMemoryEntries
    };
  }
}

export const cacheManager = new MultiTierCacheManager();
