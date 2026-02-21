import type { VideoGenerationTask } from "./video";

/**
 * In-memory task store.
 *
 * For production, consider replacing with Redis (Upstash) or a database.
 * Currently uses a Map, suitable for single-instance deployments.
 * Automatically cleans up tasks older than 1 hour.
 */
class TaskStore {
  private store = new Map<string, VideoGenerationTask>();
  private readonly TTL = 60 * 60 * 1000; // 1 hour

  set(taskId: string, task: VideoGenerationTask): void {
    this.store.set(taskId, task);
    this.cleanup();
  }

  get(taskId: string): VideoGenerationTask | null {
    return this.store.get(taskId) || null;
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
      }
    }
  }
}

export const taskStore = new TaskStore();
