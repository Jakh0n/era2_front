import { useEffect } from "react";
import { writePersistedState } from "../lib/queuePersistence";
import {
  bindQueueEngine,
  syncQueueEngine,
} from "./queueEngineBinding";
import { createQueueEngine } from "./queueEngine";
import { initializeQueueFromSeed, useQueueStore } from "./queueStore";

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
      (state) => state.tasks,
      () => {
        const { isLoading, loadError } = useQueueStore.getState();
        if (isLoading || loadError) return;
        syncQueueEngine();
      },
    );
  }, []);

  useEffect(() => {
    return useQueueStore.subscribe((state) => {
      if (state.isLoading || state.loadError) return;
      writePersistedState({
        tasks: state.tasks,
        filter: state.filter,
        sort: state.sort,
        search: state.search,
      });
    });
  }, []);
}
