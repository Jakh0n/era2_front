import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import {
  flushPersistedState,
  schedulePersistedState,
} from "../lib/queuePersistScheduler";
import type { QueueState } from "../lib/queueTypes";
import {
  bindQueueEngine,
  syncQueueEngine,
} from "./queueEngineBinding";
import { createQueueEngine } from "./queueEngine";
import { initializeQueueFromSeed, useQueueStore } from "./queueStore";

type PersistSlice = Pick<
  QueueState,
  "tasks" | "filter" | "sort" | "search"
> & {
  isLoading: boolean;
  loadError: string | null;
};

function hasStructuralTaskChange(
  prevTasks: QueueState["tasks"],
  nextTasks: QueueState["tasks"],
): boolean {
  if (prevTasks.length !== nextTasks.length) return true;

  for (let i = 0; i < nextTasks.length; i++) {
    if (prevTasks[i].id !== nextTasks[i].id) return true;
    if (prevTasks[i].status !== nextTasks[i].status) return true;
  }

  return false;
}

function toPersistPayload(slice: PersistSlice) {
  return {
    tasks: slice.tasks,
    filter: slice.filter,
    sort: slice.sort,
    search: slice.search,
  };
}

export function useQueueRuntime(): void {
  useEffect(() => {
    initializeQueueFromSeed();
  }, []);

  useEffect(() => {
    const engine = createQueueEngine({
      dispatch: (action) => useQueueStore.getState().dispatch(action),
      getTasks: () => useQueueStore.getState().tasks,
    });

    bindQueueEngine(engine);
    engine.start();

    return () => {
      engine.stop();
      bindQueueEngine(null);
    };
  }, []);

  useEffect(() => {
    return useQueueStore.subscribe(
      (state) => ({
        tasks: state.tasks,
        isLoading: state.isLoading,
        loadError: state.loadError,
      }),
      (snapshot) => {
        if (snapshot.isLoading || snapshot.loadError) return;
        syncQueueEngine();
      },
    );
  }, []);

  useEffect(() => {
    const unsubscribe = useQueueStore.subscribe(
      (state): PersistSlice => ({
        tasks: state.tasks,
        filter: state.filter,
        sort: state.sort,
        search: state.search,
        isLoading: state.isLoading,
        loadError: state.loadError,
      }),
      (snapshot, previous) => {
        if (snapshot.isLoading || snapshot.loadError) return;

        const payload = toPersistPayload(snapshot);
        const uiChanged =
          !previous ||
          snapshot.filter !== previous.filter ||
          snapshot.sort !== previous.sort ||
          snapshot.search !== previous.search;
        const structureChanged =
          !previous ||
          hasStructuralTaskChange(previous.tasks, snapshot.tasks);

        if (uiChanged || structureChanged) {
          flushPersistedState(payload);
          return;
        }

        schedulePersistedState(payload);
      },
      { equalityFn: shallow },
    );

    const flushOnExit = () => {
      const state = useQueueStore.getState();
      if (state.isLoading || state.loadError) return;
      flushPersistedState(toPersistPayload(state));
    };

    window.addEventListener("pagehide", flushOnExit);

    return () => {
      unsubscribe();
      window.removeEventListener("pagehide", flushOnExit);
      flushOnExit();
    };
  }, []);
}
