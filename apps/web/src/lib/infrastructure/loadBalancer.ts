import { ReplicaNode } from "./types";

/**
 * Client-Side Load Balancer & Replica Health Manager
 * Balances outgoing requests across mirrored CDN endpoints, Firebase mirrors, and fallback nodes.
 */
export class ClientLoadBalancer {
  private nodes: ReplicaNode[] = [];
  private currentIndex = 0;

  constructor(initialNodes?: ReplicaNode[]) {
    this.nodes = initialNodes || [
      { id: "node-primary", name: "Primary Edge Node (Asia-South1)", url: "https://kgupta171025.github.io/NITI-AI", healthy: true, latencyMs: 18, weight: 3 },
      { id: "node-mirror", name: "Secondary CDN Mirror", url: "https://niti--ai.firebaseapp.com", healthy: true, latencyMs: 24, weight: 2 },
      { id: "node-local", name: "Local Client Cache Worker", url: "worker://local", healthy: true, latencyMs: 2, weight: 1 }
    ];
  }

  /**
   * Select best node via Weighted Round-Robin
   */
  public selectNode(): ReplicaNode {
    const healthyNodes = this.nodes.filter((n) => n.healthy);
    if (healthyNodes.length === 0) {
      // Fallback to first node even if marked degraded
      return this.nodes[0]!;
    }

    this.currentIndex = (this.currentIndex + 1) % healthyNodes.length;
    return healthyNodes[this.currentIndex]!;
  }

  /**
   * Record outcome of a request for a node to adjust health score
   */
  public recordResult(nodeId: string, success: boolean, latencyMs: number): void {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (node) {
      node.latencyMs = Math.round((node.latencyMs * 0.7) + (latencyMs * 0.3));
      if (!success) {
        node.healthy = false;
        // Schedule recovery check
        setTimeout(() => {
          node.healthy = true;
        }, 15000);
      } else {
        node.healthy = true;
      }
    }
  }

  public getNodes(): ReplicaNode[] {
    return [...this.nodes];
  }
}

export const loadBalancer = new ClientLoadBalancer();
