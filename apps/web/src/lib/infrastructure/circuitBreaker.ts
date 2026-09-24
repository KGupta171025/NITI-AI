import { CircuitBreakerConfig, CircuitBreakerState } from "./types";

/**
 * Resilient Tri-State Circuit Breaker
 * Prevents cascading outages by quickly short-circuiting failing third-party calls.
 */
export class CircuitBreaker {
  public state: CircuitBreakerState = "CLOSED";
  private failureCount = 0;
  private lastFailureTime = 0;
  private config: CircuitBreakerConfig;

  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = {
      failureThreshold: config?.failureThreshold ?? 4,
      cooldownMs: config?.cooldownMs ?? 15000,
      timeoutMs: config?.timeoutMs ?? 8000
    };
  }

  /**
   * Execute an asynchronous task through the protective circuit
   */
  public async execute<T>(action: () => Promise<T>, fallback?: () => T | Promise<T>): Promise<T> {
    const now = Date.now();

    // Check if cooldown has elapsed in OPEN state
    if (this.state === "OPEN") {
      if (now - this.lastFailureTime > this.config.cooldownMs) {
        this.state = "HALF_OPEN";
      } else {
        if (fallback) return fallback();
        throw new Error("CircuitBreaker: Circuit is OPEN. Operation blocked to prevent cascade.");
      }
    }

    try {
      // Execute with timeout race
      const result = await this.executeWithTimeout(action, this.config.timeoutMs);
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      if (fallback) return fallback();
      throw err;
    }
  }

  private async executeWithTimeout<T>(action: () => Promise<T>, timeoutMs: number): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("CircuitBreaker: Operation timed out")), timeoutMs);
    });

    try {
      return await Promise.race([action(), timeoutPromise]);
    } finally {
      // @ts-expect-error - timer is initialized before race
      clearTimeout(timer);
    }
  }

  private onSuccess(): void {
    if (this.state === "HALF_OPEN" || this.failureCount > 0) {
      this.failureCount = 0;
      this.state = "CLOSED";
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold || this.state === "HALF_OPEN") {
      this.state = "OPEN";
    }
  }

  public getStatus(): { state: CircuitBreakerState; failureCount: number; cooldownRemainingMs: number } {
    const now = Date.now();
    const cooldownRemaining = this.state === "OPEN" 
      ? Math.max(0, this.config.cooldownMs - (now - this.lastFailureTime))
      : 0;

    return {
      state: this.state,
      failureCount: this.failureCount,
      cooldownRemainingMs: cooldownRemaining
    };
  }

  public reset(): void {
    this.state = "CLOSED";
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

export const circuitBreakers = {
  firebase: new CircuitBreaker({ failureThreshold: 3, cooldownMs: 10000, timeoutMs: 6000 }),
  geocoding: new CircuitBreaker({ failureThreshold: 3, cooldownMs: 15000, timeoutMs: 5000 }),
  default: new CircuitBreaker()
};
