import type { QueueSort } from "../model/queueState";

export type { QueueSort, QueueState, QueueStatusFilter } from "../model/queueState";
export type { QueueStats } from "../model/selectors";

export function isQueueSort(value: string): value is QueueSort {
  return value === "newest" || value === "oldest";
}
