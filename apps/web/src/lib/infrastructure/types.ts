/**
 * NITI AI Enterprise Infrastructure Types
 * Full-stack specifications for Gateway, Rate Limiting, Caching, Circuit Breakers, Queue, and Scaling.
 */

export interface GatewayRequest<T = unknown> {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  payload?: T;
  userId?: string;
  clientIp?: string;
  timeoutMs?: number;
  skipCache?: boolean;
}

export interface GatewayResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata: {
    correlationId: string;
    latencyMs: number;
    cached: boolean;
    cacheTier?: "L1_MEMORY" | "L2_STORAGE" | "NONE";
    rateLimitRemaining: number;
    circuitBreakerState: "CLOSED" | "HALF_OPEN" | "OPEN";
    timestamp: string;
  };
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTimeMs: number;
  limit: number;
}

export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerConfig {
  failureThreshold: number;
  cooldownMs: number;
  timeoutMs: number;
}

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
  hits: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRatio: number;
  size: number;
  maxSize: number;
}

export type QueuePriority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";

export interface QueueJob<T = unknown> {
  id: string;
  name: string;
  payload: T;
  priority: QueuePriority;
  retries: number;
  maxRetries: number;
  createdAt: number;
  delayMs?: number;
}

export interface QueueMetrics {
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  failedCount: number;
  activeWorkers: number;
}

export interface ReplicaNode {
  id: string;
  name: string;
  url: string;
  healthy: boolean;
  latencyMs: number;
  weight: number;
}

export interface AutoScalerMetrics {
  currentWorkers: number;
  minWorkers: number;
  maxWorkers: number;
  cpuLoadEstimate: number;
  queuePressure: number;
  scalingRecommendation: "SCALE_UP" | "SCALE_DOWN" | "STEADY";
}
