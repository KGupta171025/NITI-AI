import { QueueJob, QueueMetrics, QueuePriority } from "./types";

const PRIORITY_WEIGHTS: Record<QueuePriority, number> = {
  CRITICAL: 4,
  HIGH: 3,
  NORMAL: 2,
  LOW: 1
};

/**
 * Priority Asynchronous Message Queue with Dead-Letter Handling
 * Decouples write operations, telemetry, and background syncing.
 */
export class PriorityMessageQueue {
  private queue: QueueJob[] = [];
  private deadLetterQueue: QueueJob[] = [];
  private processing: Map<string, QueueJob> = new Map();
  private completedCount = 0;
  private failedCount = 0;
  private isProcessing = false;
  private concurrency = 3;
  private handlers: Map<string, (payload: unknown) => Promise<void>> = new Map();

  constructor(concurrency = 3) {
    this.concurrency = concurrency;
  }

  /**
   * Register a job handler for a specific topic / job name
   */
  public registerHandler<T>(name: string, handler: (payload: T) => Promise<void>): void {
    this.handlers.set(name, handler as (payload: unknown) => Promise<void>);
  }

  /**
   * Push a job into the queue
   */
  public enqueue<T>(
    name: string,
    payload: T,
    priority: QueuePriority = "NORMAL",
    maxRetries = 3
  ): string {
    const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const job: QueueJob<T> = {
      id,
      name,
      payload,
      priority,
      retries: 0,
      maxRetries,
      createdAt: Date.now()
    };

    this.queue.push(job as QueueJob<unknown>);
    this.sortQueue();
    this.triggerProcessing();
    return id;
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => {
      const weightA = PRIORITY_WEIGHTS[a.priority];
      const weightB = PRIORITY_WEIGHTS[b.priority];
      if (weightA !== weightB) return weightB - weightA;
      return a.createdAt - b.createdAt;
    });
  }

  private async triggerProcessing(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0 && this.processing.size < this.concurrency) {
      const job = this.queue.shift();
      if (!job) break;

      this.processing.set(job.id, job);
      this.executeJob(job);
    }

    this.isProcessing = false;
  }

  private async executeJob(job: QueueJob): Promise<void> {
    const handler = this.handlers.get(job.name);

    if (!handler) {
      console.warn(`PriorityMessageQueue: No handler registered for job '${job.name}'`);
      this.processing.delete(job.id);
      this.failedCount++;
      this.deadLetterQueue.push(job);
      return;
    }

    try {
      await handler(job.payload);
      this.completedCount++;
      this.processing.delete(job.id);
    } catch (err) {
      console.warn(`PriorityMessageQueue: Job '${job.name}' failed (Attempt ${job.retries + 1}/${job.maxRetries}):`, err);
      job.retries++;

      if (job.retries < job.maxRetries) {
        // Exponential backoff
        const backoffMs = Math.pow(2, job.retries) * 1000;
        setTimeout(() => {
          this.processing.delete(job.id);
          this.queue.push(job);
          this.sortQueue();
          this.triggerProcessing();
        }, backoffMs);
      } else {
        this.failedCount++;
        this.processing.delete(job.id);
        this.deadLetterQueue.push(job);
      }
    } finally {
      this.triggerProcessing();
    }
  }

  public setConcurrency(concurrency: number): void {
    this.concurrency = Math.max(1, concurrency);
    this.triggerProcessing();
  }

  public getMetrics(): QueueMetrics {
    return {
      pendingCount: this.queue.length,
      processingCount: this.processing.size,
      completedCount: this.completedCount,
      failedCount: this.failedCount,
      activeWorkers: this.concurrency
    };
  }

  public getDeadLetterQueue(): QueueJob[] {
    return [...this.deadLetterQueue];
  }
}

export const messageQueue = new PriorityMessageQueue();
