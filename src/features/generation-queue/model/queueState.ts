import type { GenerationTask } from "@/entities/generation-task";

export type QueueStatusFilter = "all" | "queued" | "running" | "done" | "failed";

export type QueueSort = "newest" | "oldest";

export interface QueueState {
  tasks: GenerationTask[];
  filter: QueueStatusFilter;
  sort: QueueSort;
  search: string;
}

export const initialQueueState: QueueState = {
  tasks: [],
  filter: "all",
  sort: "newest",
  search: "",
};
