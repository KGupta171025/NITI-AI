import { AutoScalerMetrics } from "./types";
import { messageQueue } from "./messageQueue";

/**
 * Adaptive Auto-Scaler & Concurrency Regulator
 * Dynamically adjusts message worker pool and batch sizes based on request pressure.
 */
export class AdaptiveAutoScaler {
  private minWorkers = 1;
  private maxWorkers = 8;
  private currentWorkers = 3;
  private requestVelocity: number[] = []; // Timestamps of recent requests

  constructor(minWorkers = 1, maxWorkers = 8) {
    this.minWorkers = minWorkers;
    this.maxWorkers = maxWorkers;
    this.currentWorkers = 3;
  }

  public recordRequest(): void {
    const now = Date.now();
    this.requestVelocity.push(now);
    // Keep last 60 seconds
    const cutoff = now - 60000;
    this.requestVelocity = this.requestVelocity.filter((t) => t > cutoff);

    this.evaluateScale();
  }

  private evaluateScale(): void {
    const reqsPerMinute = this.requestVelocity.length;
    const queueMetrics = messageQueue.getMetrics();
    const queueDepth = queueMetrics.pendingCount;

    // High pressure threshold
    if (reqsPerMinute > 60 || queueDepth > 10) {
      if (this.currentWorkers < this.maxWorkers) {
        this.currentWorkers = Math.min(this.maxWorkers, this.currentWorkers + 1);
        messageQueue.setConcurrency(this.currentWorkers);
      }
    } else if (reqsPerMinute < 10 && queueDepth === 0) {
      if (this.currentWorkers > this.minWorkers) {
        this.currentWorkers = Math.max(this.minWorkers, this.currentWorkers - 1);
        messageQueue.setConcurrency(this.currentWorkers);
      }
    }
  }

  public getMetrics(): AutoScalerMetrics {
    const reqsPerMinute = this.requestVelocity.length;
    const queueDepth = messageQueue.getMetrics().pendingCount;
    const cpuEstimate = Math.min(100, Math.round((reqsPerMinute / 120) * 100));

    let recommendation: "SCALE_UP" | "SCALE_DOWN" | "STEADY" = "STEADY";
    if (reqsPerMinute > 60 || queueDepth > 10) recommendation = "SCALE_UP";
    else if (reqsPerMinute < 10 && queueDepth === 0 && this.currentWorkers > this.minWorkers) recommendation = "SCALE_DOWN";

    return {
      currentWorkers: this.currentWorkers,
      minWorkers: this.minWorkers,
      maxWorkers: this.maxWorkers,
      cpuLoadEstimate: Math.max(12, cpuEstimate),
      queuePressure: queueDepth,
      scalingRecommendation: recommendation
    };
  }
}

export const autoScaler = new AdaptiveAutoScaler();
