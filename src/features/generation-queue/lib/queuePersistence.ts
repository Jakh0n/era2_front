import { GENERATION_TASK_SEED } from "@/entities/generation-task";
import type { GenType, TaskStatus } from "@/entities/generation-task";
import type { QueueHydratePayload, HydratedTask } from "../model/queueActions";
import type { QueueSort, QueueState, QueueStatusFilter } from "../model/queueState";

export const STORAGE_KEY = "era2_generation_queue";

const VALID_TYPES: GenType[] = ["text", "image", "video", "audio"];
const VALID_STATUSES: TaskStatus[] = [
  "queued",
  "running",
  "done",
  "failed",
  "canceled",
];
const VALID_FILTERS: QueueStatusFilter[] = [
  "all",
  "queued",
  "running",
  "done",
  "failed",
];
const VALID_SORTS: QueueSort[] = ["newest", "oldest"];

interface PersistedQueueState {
  tasks: HydratedTask[];
  filter?: QueueStatusFilter;
  sort?: QueueSort;
  search?: string;
}

function cloneSeedTasks(): HydratedTask[] {
  return GENERATION_TASK_SEED.map((task) => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGenType(value: unknown): value is GenType {
  return typeof value === "string" && VALID_TYPES.includes(value as GenType);
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === "string" && VALID_STATUSES.includes(value as TaskStatus)
  );
}

function isQueueFilter(value: unknown): value is QueueStatusFilter {
  return (
    typeof value === "string" &&
    VALID_FILTERS.includes(value as QueueStatusFilter)
  );
}

function isQueueSort(value: unknown): value is QueueSort {
  return typeof value === "string" && VALID_SORTS.includes(value as QueueSort);
}

function isHydratedTask(value: unknown): value is HydratedTask {
  if (!isRecord(value)) return false;

  const { id, type, prompt, model, status, progress, createdAt } = value;

  if (typeof id !== "string" || id.length === 0) return false;
  if (!isGenType(type)) return false;
  if (typeof prompt !== "string") return false;
  if (typeof model !== "string") return false;
  if (!isTaskStatus(status)) return false;
  if (typeof progress !== "number" || Number.isNaN(progress)) return false;
  if (typeof createdAt !== "string" && !(createdAt instanceof Date)) {
    return false;
  }

  if (value.error !== undefined && typeof value.error !== "string") {
    return false;
  }
  if (value.eta !== undefined && typeof value.eta !== "number") return false;
  if (value.credits !== undefined && typeof value.credits !== "number") {
    return false;
  }
  if (
    value.queuePosition !== undefined &&
    typeof value.queuePosition !== "number"
  ) {
    return false;
  }

  return true;
}

function isPersistedQueueState(value: unknown): value is PersistedQueueState {
  if (!isRecord(value) || !Array.isArray(value.tasks)) return false;
  if (!value.tasks.every(isHydratedTask)) return false;

  if (value.filter !== undefined && !isQueueFilter(value.filter)) return false;
  if (value.sort !== undefined && !isQueueSort(value.sort)) return false;
  if (value.search !== undefined && typeof value.search !== "string") {
    return false;
  }

  return true;
}

/** Running tasks cannot resume after reload — engine timers are gone. */
function normalizeRestoredTasks(tasks: HydratedTask[]): HydratedTask[] {
  return tasks.map((task) => {
    if (task.status !== "running") return task;

    return {
      ...task,
      status: "queued",
      progress: 0,
    };
  });
}

export function buildHydratePayload(
  source: PersistedQueueState | null,
): QueueHydratePayload {
  if (!source) {
    return { tasks: cloneSeedTasks() };
  }

  return {
    tasks: normalizeRestoredTasks(source.tasks),
    filter: source.filter,
    sort: source.sort,
    search: source.search,
  };
}

export function readPersistedState(): PersistedQueueState | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedQueueState(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function writePersistedState(state: QueueState): void {
  if (typeof window === "undefined") return;

  const payload: PersistedQueueState = {
    tasks: state.tasks.map((task) => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
    })),
    filter: state.filter,
    sort: state.sort,
    search: state.search,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
