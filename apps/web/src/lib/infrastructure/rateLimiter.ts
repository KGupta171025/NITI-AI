import { RateLimitConfig, RateLimitStatus } from "./types";

/**
 * Enterprise Sliding-Window Rate Limiter
 * Enforces per-client and per-user operation throttling to prevent DDoS and API abuse.
 */
export class SlidingWindowRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private defaultConfig: RateLimitConfig;

  constructor(defaultConfig: RateLimitConfig = { maxRequests: 60, windowMs: 60000 }) {
    this.defaultConfig = defaultConfig;
  }

  /**
   * Check if a request is allowed under the current rate limit window
   */
  public check(identifier: string, customConfig?: Partial<RateLimitConfig>): RateLimitStatus {
    const config: RateLimitConfig = {
      maxRequests: customConfig?.maxRequests ?? this.defaultConfig.maxRequests,
      windowMs: customConfig?.windowMs ?? this.defaultConfig.windowMs
    };

    const now = Date.now();
    const windowStart = now - config.windowMs;

    const timestamps = this.requests.get(identifier) || [];
    // Discard timestamps older than the sliding window
    const validTimestamps = timestamps.filter((t) => t > windowStart);

    if (validTimestamps.length >= config.maxRequests) {
      const oldestInWindow = validTimestamps[0] || now;
      const resetTimeMs = oldestInWindow + config.windowMs;

      this.requests.set(identifier, validTimestamps);
      return {
        allowed: false,
        remaining: 0,
        resetTimeMs,
        limit: config.maxRequests
      };
    }

    // Allow and record current request
    validTimestamps.push(now);
    this.requests.set(identifier, validTimestamps);

    return {
      allowed: true,
      remaining: Math.max(0, config.maxRequests - validTimestamps.length),
      resetTimeMs: now + config.windowMs,
      limit: config.maxRequests
    };
  }

  /**
   * Reset rate limit bucket for a specific client or testing
   */
  public reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Periodically purge expired buckets to reclaim memory
   */
  public cleanup(): void {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const active = timestamps.filter((t) => t > now - this.defaultConfig.windowMs);
      if (active.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, active);
      }
    }
  }
}

export const rateLimiter = new SlidingWindowRateLimiter();
