import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { INIT_DELAY_MS } from "../lib/queueConstants";
import {
  initializeQueueState,
  QUEUE_LOAD_ERROR_MESSAGE,
} from "../lib/queueInit";
import { abortQueueTask } from "./queueEngineBinding";
import type { QueueAction } from "./queueActions";
import { queueReducer } from "./queueReducer";
import {
  initialQueueState,
  type QueueSort,
  type QueueState,
  type QueueStatusFilter,
} from "./queueState";

export interface QueueStore extends QueueState {
  isLoading: boolean;
  loadError: string | null;
  dispatch: (action: QueueAction) => void;
  setFilter: (filter: QueueStatusFilter) => void;
  setSort: (sort: QueueSort) => void;
  setSearch: (search: string) => void;
  cancel: (taskId: string) => void;
  retry: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  clearDone: () => void;
}

function toReducerState(state: QueueStore): QueueState {
  return {
    tasks: state.tasks,
    filter: state.filter,
    sort: state.sort,
    search: state.search,
  };
}

let initAttempt = 0;

export function initializeQueueFromSeed(): void {
  initAttempt += 1;
  const attemptId = initAttempt;

  useQueueStore.setState({ isLoading: true, loadError: null });

  window.setTimeout(() => {
    if (attemptId !== initAttempt) return;

    try {
      const payload = initializeQueueState();
      useQueueStore.getState().dispatch({ type: "HYDRATE", payload });
      useQueueStore.setState({ loadError: null });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : QUEUE_LOAD_ERROR_MESSAGE;
      useQueueStore.setState({ loadError: message });
    } finally {
      if (attemptId === initAttempt) {
        useQueueStore.setState({ isLoading: false });
      }
    }
  }, INIT_DELAY_MS);
}

export const useQueueStore = create<QueueStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialQueueState,
    isLoading: true,
    loadError: null,

    dispatch: (action) => {
      set((state) => ({
        ...queueReducer(toReducerState(state), action),
      }));
    },

    setFilter: (filter) => get().dispatch({ type: "SET_FILTER", filter }),
    setSort: (sort) => get().dispatch({ type: "SET_SORT", sort }),
    setSearch: (search) => get().dispatch({ type: "SET_SEARCH", search }),

    cancel: (taskId) => {
      abortQueueTask(taskId);
      get().dispatch({ type: "CANCEL", taskId });
    },

    retry: (taskId) => get().dispatch({ type: "RETRY", taskId }),

    deleteTask: (taskId) => {
      abortQueueTask(taskId);
      get().dispatch({ type: "DELETE", taskId });
    },

    clearDone: () => get().dispatch({ type: "CLEAR_DONE" }),
  })),
);
