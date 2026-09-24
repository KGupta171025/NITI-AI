import { GatewayRequest, GatewayResponse } from "./types";
import { rateLimiter } from "./rateLimiter";
import { cacheManager } from "./cacheManager";
import { circuitBreakers } from "./circuitBreaker";
import { loadBalancer } from "./loadBalancer";
import { autoScaler } from "./autoScaler";
import { messageQueue } from "./messageQueue";

/**
 * Enterprise API Gateway & Dispatch Pipeline
 * Coordinates Rate Limiting, Multi-Tier Caching, Circuit Breaking, and Load Balancing.
 */
export class UnifiedApiGateway {
  /**
   * Dispatch a protected operation through the entire infrastructure pipeline
   */
  public async dispatch<T>(
    req: GatewayRequest,
    handler: (nodeUrl: string) => Promise<T>
  ): Promise<GatewayResponse<T>> {
    const startTime = performance.now();
    const correlationId = `niti-req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const identifier = req.userId || req.clientIp || "client-default";

    // 1. Record incoming traffic to Auto-Scaler
    autoScaler.recordRequest();

    // 2. Enforce Rate Limiting
    const rateLimit = rateLimiter.check(identifier);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetTimeMs - Date.now()) / 1000)} seconds.`,
        metadata: {
          correlationId,
          latencyMs: Math.round(performance.now() - startTime),
          cached: false,
          rateLimitRemaining: 0,
          circuitBreakerState: "CLOSED",
          timestamp: new Date().toISOString()
        }
      };
    }

    // 3. Multi-Tier Cache Check (L1 / L2) for idempotent reads
    const cacheKey = `${req.method}:${req.endpoint}:${JSON.stringify(req.payload || {})}`;
    if (req.method === "GET" && !req.skipCache) {
      const cached = cacheManager.get<T>(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached.data,
          metadata: {
            correlationId,
            latencyMs: Math.round(performance.now() - startTime),
            cached: true,
            cacheTier: cached.tier,
            rateLimitRemaining: rateLimit.remaining,
            circuitBreakerState: "CLOSED",
            timestamp: new Date().toISOString()
          }
        };
      }
    }

    // 4. Select Target Replica Node from Load Balancer
    const node = loadBalancer.selectNode();

    // 5. Execute through Circuit Breaker
    const breaker = circuitBreakers.default;
    try {
      const data = await breaker.execute(async () => {
        return await handler(node.url);
      });

      // 6. Populate Multi-Tier Cache on GET
      if (req.method === "GET" && !req.skipCache) {
        cacheManager.set(cacheKey, data);
      }

      // Record telemetry into Background Message Queue
      messageQueue.enqueue("telemetry_log", {
        correlationId,
        endpoint: req.endpoint,
        latencyMs: Math.round(performance.now() - startTime),
        node: node.id
      }, "LOW");

      loadBalancer.recordResult(node.id, true, Math.round(performance.now() - startTime));

      return {
        success: true,
        data,
        metadata: {
          correlationId,
          latencyMs: Math.round(performance.now() - startTime),
          cached: false,
          cacheTier: "NONE",
          rateLimitRemaining: rateLimit.remaining,
          circuitBreakerState: breaker.state,
          timestamp: new Date().toISOString()
        }
      };
    } catch (err: unknown) {
      loadBalancer.recordResult(node.id, false, Math.round(performance.now() - startTime));
      const message = err instanceof Error ? err.message : "Gateway execution failure";

      return {
        success: false,
        error: message,
        metadata: {
          correlationId,
          latencyMs: Math.round(performance.now() - startTime),
          cached: false,
          cacheTier: "NONE",
          rateLimitRemaining: rateLimit.remaining,
          circuitBreakerState: breaker.state,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}

export const apiGateway = new UnifiedApiGateway();
