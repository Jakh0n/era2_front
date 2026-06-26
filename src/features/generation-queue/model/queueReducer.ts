import type { GenerationTask } from "@/entities/generation-task";
import { clampProgress } from "../lib/clampProgress";
import type { HydratedTask, QueueAction } from "./queueActions";
import type { QueueState } from "./queueState";
import { initialQueueState } from "./queueState";

function parseCreatedAt(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function parseOptionalDate(value: string | Date | undefined): Date | undefined {
  if (value === undefined) return undefined;
  return value instanceof Date ? value : new Date(value);
}

function computeDoneDurationSec(
  task: GenerationTask,
  now = Date.now(),
): number {
  if (task.startedAt) {
    return Math.max(1, Math.round((now - task.startedAt.getTime()) / 1000));
  }

  return Math.max(1, Math.round((task.credits ?? 10) / 2));
}

function withoutQueuePosition(task: GenerationTask): GenerationTask {
  if (task.queuePosition === undefined) return task;
  const { queuePosition: _removed, ...rest } = task;
  return rest;
}

function recomputeQueuePositions(tasks: GenerationTask[]): GenerationTask[] {
  const queuedIds = tasks
    .filter((task) => task.status === "queued")
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((task) => task.id);

  const positionById = new Map(queuedIds.map((id, index) => [id, index + 1]));

  return tasks.map((task) => {
    if (task.status !== "queued") {
      return withoutQueuePosition(task);
    }

    const queuePosition = positionById.get(task.id);
    return queuePosition === undefined ? task : { ...task, queuePosition };
  });
}

function updateTasks(
  tasks: GenerationTask[],
  taskId: string,
  updater: (task: GenerationTask) => GenerationTask | null,
): GenerationTask[] {
  let changed = false;

  const next = tasks.flatMap((task) => {
    if (task.id !== taskId) return [task];

    changed = true;
    const updated = updater(task);
    return updated ? [updated] : [];
  });

  return changed ? next : tasks;
}

function hydrateTasks(tasks: HydratedTask[]): GenerationTask[] {
  return tasks.map((task) => ({
    ...task,
    createdAt: parseCreatedAt(task.createdAt),
    startedAt: parseOptionalDate(task.startedAt),
  }));
}

export function queueReducer(
  state: QueueState = initialQueueState,
  action: QueueAction,
): QueueState {
  switch (action.type) {
    case "ADD_TASK": {
      const tasks = recomputeQueuePositions([...state.tasks, action.task]);
      return { ...state, tasks };
    }

    case "TICK_PROGRESS": {
      const progress = clampProgress(action.progress);
      const tasks = updateTasks(state.tasks, action.taskId, (task) => {
        if (task.status === "queued") {
          return withoutQueuePosition({
            ...task,
            status: "running",
            progress,
            error: undefined,
            startedAt: task.startedAt ?? new Date(),
          });
        }

        if (task.status !== "running") return task;

        return {
          ...task,
          progress,
          startedAt: task.startedAt ?? new Date(),
        };
      });

      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case "COMPLETE": {
      const tasks = updateTasks(state.tasks, action.taskId, (task) => {
        if (task.status !== "running") return task;

        return withoutQueuePosition({
          ...task,
          status: "done",
          progress: 100,
          error: undefined,
          eta: computeDoneDurationSec(task),
          startedAt: undefined,
        });
      });

      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case "FAIL": {
      const tasks = updateTasks(state.tasks, action.taskId, (task) => {
        if (task.status !== "running") return task;

        return withoutQueuePosition({
          ...task,
          status: "failed",
          error: action.error,
          eta: undefined,
          startedAt: undefined,
        });
      });

      return tasks === state.tasks ? state : { ...state, tasks };
    }

    case "CANCEL": {
      const tasks = updateTasks(state.tasks, action.taskId, (task) => {
        if (task.status !== "queued" && task.status !== "running") return task;

        return withoutQueuePosition({
          ...task,
          status: "canceled",
          eta: undefined,
          startedAt: undefined,
        });
      });

      if (tasks === state.tasks) return state;
      return { ...state, tasks: recomputeQueuePositions(tasks) };
    }

    case "RETRY": {
      const tasks = updateTasks(state.tasks, action.taskId, (task) => {
        if (task.status !== "failed" && task.status !== "canceled") return task;

        return {
          ...task,
          status: "queued",
          progress: 0,
          error: undefined,
          eta: undefined,
          startedAt: undefined,
        };
      });

      if (tasks === state.tasks) return state;
      return { ...state, tasks: recomputeQueuePositions(tasks) };
    }

    case "DELETE": {
      if (!state.tasks.some((task) => task.id === action.taskId)) return state;

      const tasks = recomputeQueuePositions(
        state.tasks.filter((task) => task.id !== action.taskId),
      );

      return { ...state, tasks };
    }

    case "CLEAR_DONE": {
      const tasks = recomputeQueuePositions(
        state.tasks.filter((task) => task.status !== "done"),
      );

      if (tasks.length === state.tasks.length) return state;
      return { ...state, tasks };
    }

    case "SET_FILTER":
      return state.filter === action.filter
        ? state
        : { ...state, filter: action.filter };

    case "SET_SORT":
      return state.sort === action.sort
        ? state
        : { ...state, sort: action.sort };

    case "SET_SEARCH":
      return state.search === action.search
        ? state
        : { ...state, search: action.search };

    case "HYDRATE": {
      const tasks = recomputeQueuePositions(hydrateTasks(action.payload.tasks));

      return {
        tasks,
        filter: action.payload.filter ?? state.filter,
        sort: action.payload.sort ?? state.sort,
        search: action.payload.search ?? state.search,
      };
    }

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export { initialQueueState } from "./queueState";
export type {
  QueueAction,
  QueueHydratePayload,
  HydratedTask,
} from "./queueActions";
export type { QueueState, QueueSort, QueueStatusFilter } from "./queueState";
