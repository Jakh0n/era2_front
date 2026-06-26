import type { QueueEngine } from "./queueEngine";

let engine: QueueEngine | null = null;

export function bindQueueEngine(instance: QueueEngine | null): void {
  engine = instance;
}

export function getQueueEngine(): QueueEngine | null {
  return engine;
}

export function abortQueueTask(taskId: string): void {
  engine?.abortTask(taskId);
}

export function syncQueueEngine(): void {
  engine?.sync();
}
