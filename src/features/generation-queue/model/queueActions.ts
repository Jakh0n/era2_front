import type { GenerationTask } from "@/entities/generation-task";
import type { QueueSort, QueueState, QueueStatusFilter } from "./queueState";

/** Serializable task shape for localStorage hydration. */
export type HydratedTask = Omit<GenerationTask, "createdAt" | "startedAt"> & {
  createdAt: string | Date;
  startedAt?: string | Date;
};

export interface QueueHydratePayload {
  tasks: HydratedTask[];
  filter?: QueueStatusFilter;
  sort?: QueueSort;
  search?: string;
}

export type QueueAction =
  | { type: "ADD_TASK"; task: GenerationTask }
  | { type: "TICK_PROGRESS"; taskId: string; progress: number }
  | { type: "COMPLETE"; taskId: string }
  | { type: "FAIL"; taskId: string; error: string }
  | { type: "CANCEL"; taskId: string }
  | { type: "RETRY"; taskId: string }
  | { type: "DELETE"; taskId: string }
  | { type: "CLEAR_DONE" }
  | { type: "SET_FILTER"; filter: QueueStatusFilter }
  | { type: "SET_SORT"; sort: QueueSort }
  | { type: "SET_SEARCH"; search: string }
  | { type: "HYDRATE"; payload: QueueHydratePayload };

/** Discriminated union re-export for consumers that import state + actions together. */
export type { QueueState };
