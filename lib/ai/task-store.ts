import type { VideoGenerationTask } from "./video";

/**
 * In-memory task store.
 *
 * For production, consider replacing with Redis (Upstash) or a database.
 * Currently uses a Map, suitable for single-instance deployments.
 * Automatically cleans up tasks older than 1 hour.
 *
 * Uses globalThis to persist across Next.js HMR in development.
 */
class TaskStore {
  private store = new Map<string, VideoGenerationTask>();
  /** Reverse mapping: external (KIE/provider) taskId → internal taskId */
  private externalIdMap = new Map<string, string>();
  private readonly TTL = 60 * 60 * 1000; // 1 hour

  set(taskId: string, task: VideoGenerationTask): void {
    this.store.set(taskId, task);
    this.cleanup();
  }

  get(taskId: string): VideoGenerationTask | null {
    return this.store.get(taskId) || null;
  }

  /** Look up internal taskId by external (provider) taskId */
  getByExternalId(externalId: string): VideoGenerationTask | null {
    const internalId = this.externalIdMap.get(externalId);
    if (!internalId) return null;
    return this.store.get(internalId) || null;
  }

  /** Register a mapping from external taskId → internal taskId */
  setExternalId(externalId: string, internalId: string): void {
    this.externalIdMap.set(externalId, internalId);
  }

  update(taskId: string, updates: Partial<VideoGenerationTask>): void {
    const task = this.store.get(taskId);
    if (task) {
      Object.assign(task, updates, { updatedAt: Date.now() });
    }
  }

  /** Clean up expired tasks */
  private cleanup(): void {
    const now = Date.now();
    for (const [id, task] of this.store) {
      if (now - task.createdAt > this.TTL) {
        this.store.delete(id);
        // Also clean up external ID mapping
        if (task.externalId) {
          this.externalIdMap.delete(task.externalId);
        }
      }
    }
  }
}

const globalForTaskStore = globalThis as unknown as { __taskStore?: TaskStore };
export const taskStore = globalForTaskStore.__taskStore ??= new TaskStore();
