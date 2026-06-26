import type { GenerationTask } from "@/entities/generation-task";
import type { QueueSort, QueueState, QueueStatusFilter } from "./queueState";

export interface QueueStats {
  queued: number;
  running: number;
  done: number;
  failed: number;
}

export function selectStats(tasks: GenerationTask[]): QueueStats {
  const stats: QueueStats = { queued: 0, running: 0, done: 0, failed: 0 };

  for (const task of tasks) {
    if (task.status === "queued") stats.queued += 1;
    else if (task.status === "running") stats.running += 1;
    else if (task.status === "done") stats.done += 1;
    else if (task.status === "failed") stats.failed += 1;
  }

  return stats;
}

export function selectActiveCount(tasks: GenerationTask[]): number {
  return tasks.filter(
    (task) => task.status === "queued" || task.status === "running",
  ).length;
}

export function selectAverageActiveProgress(tasks: GenerationTask[]): number {
  const active = tasks.filter(
    (task) => task.status === "queued" || task.status === "running",
  );

  if (active.length === 0) return 0;

  const total = active.reduce((sum, task) => sum + task.progress, 0);
  return Math.round(total / active.length);
}

function matchesSearch(task: GenerationTask, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return task.prompt.toLowerCase().includes(normalized);
}

function matchesFilter(
  task: GenerationTask,
  filter: QueueStatusFilter,
): boolean {
  if (filter === "all") return true;
  return task.status === filter;
}

function compareByCreatedAt(
  a: GenerationTask,
  b: GenerationTask,
  sort: QueueSort,
): number {
  const delta = a.createdAt.getTime() - b.createdAt.getTime();
  return sort === "newest" ? -delta : delta;
}

export function selectFilteredSortedTasks(state: QueueState): GenerationTask[] {
  return state.tasks
    .filter(
      (task) =>
        matchesFilter(task, state.filter) && matchesSearch(task, state.search),
    )
    .sort((a, b) => compareByCreatedAt(a, b, state.sort));
}

export function selectRunningTasks(tasks: GenerationTask[]): GenerationTask[] {
  return tasks
    .filter((task) => task.status === "running")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function selectTaskCount(tasks: GenerationTask[]): number {
  return tasks.length;
}
