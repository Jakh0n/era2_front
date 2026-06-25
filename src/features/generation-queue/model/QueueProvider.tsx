import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { GENERATION_TASK_SEED } from "@/entities/generation-task";
import type { QueueAction } from "./queueActions";
import { createQueueEngine, type QueueEngine } from "./queueEngine";
import { queueReducer } from "./queueReducer";
import { initialQueueState, type QueueState } from "./queueState";

const STORAGE_KEY = "era2_generation_queue";
const INIT_DELAY_MS = 600;

interface PersistedQueueState {
  tasks: Array<
    Omit<QueueState["tasks"][number], "createdAt"> & { createdAt: string }
  >;
  filter?: QueueState["filter"];
  sort?: QueueState["sort"];
  search?: QueueState["search"];
}

export interface QueueContextValue {
  state: QueueState;
  dispatch: React.Dispatch<QueueAction>;
  engineRef: React.RefObject<QueueEngine | null>;
  isLoading: boolean;
  loadError: string | null;
  initialize: () => void;
}

export const QueueContext = createContext<QueueContextValue | null>(null);

function cloneSeedTasks() {
  return GENERATION_TASK_SEED.map((task) => ({
    ...task,
    createdAt: new Date(task.createdAt),
  }));
}

function normalizeRestoredTasks(
  tasks: PersistedQueueState["tasks"],
): PersistedQueueState["tasks"] {
  return tasks.map((task) => {
    if (task.status !== "running") return task;

    return {
      ...task,
      status: "queued",
      progress: 0,
      eta: task.eta,
      queuePosition: task.queuePosition,
    };
  });
}

function readPersistedState(): PersistedQueueState | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  return JSON.parse(raw) as PersistedQueueState;
}

function writePersistedState(state: QueueState): void {
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

function buildHydratePayload(source: PersistedQueueState | null) {
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

export function QueueProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(queueReducer, initialQueueState);
  const stateRef = useRef(state);
  const engineRef = useRef<QueueEngine | null>(null);
  const initAttemptRef = useRef(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  stateRef.current = state;

  const initialize = useCallback(() => {
    initAttemptRef.current += 1;
    const attemptId = initAttemptRef.current;

    setIsLoading(true);
    setLoadError(null);

    window.setTimeout(() => {
      if (attemptId !== initAttemptRef.current) return;

      try {
        const persisted = readPersistedState();
        dispatch({ type: "HYDRATE", payload: buildHydratePayload(persisted) });
        setLoadError(null);
      } catch {
        setLoadError("Не удалось загрузить очередь генераций");
      } finally {
        if (attemptId === initAttemptRef.current) {
          setIsLoading(false);
        }
      }
    }, INIT_DELAY_MS);
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading || loadError) return;
    writePersistedState(state);
  }, [state, isLoading, loadError]);

  useEffect(() => {
    const engine = createQueueEngine({
      dispatch,
      getTasks: () => stateRef.current.tasks,
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, [dispatch]);

  useEffect(() => {
    if (isLoading || loadError) return;
    engineRef.current?.sync();
  }, [state.tasks, isLoading, loadError]);

  const value = useMemo<QueueContextValue>(
    () => ({
      state,
      dispatch,
      engineRef,
      isLoading,
      loadError,
      initialize,
    }),
    [state, isLoading, loadError, initialize],
  );

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
}
