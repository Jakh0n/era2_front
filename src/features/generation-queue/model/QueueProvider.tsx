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
import {
  buildHydratePayload,
  readPersistedState,
  writePersistedState,
} from "../lib/queuePersistence";
import type { QueueAction } from "./queueActions";
import { createQueueEngine, type QueueEngine } from "./queueEngine";
import { queueReducer } from "./queueReducer";
import { initialQueueState, type QueueState } from "./queueState";

const INIT_DELAY_MS = 600;

export interface QueueContextValue {
  state: QueueState;
  dispatch: React.Dispatch<QueueAction>;
  engineRef: React.RefObject<QueueEngine | null>;
  isLoading: boolean;
  loadError: string | null;
  initialize: () => void;
}

export const QueueContext = createContext<QueueContextValue | null>(null);

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
        dispatch({ type: "HYDRATE", payload: buildHydratePayload(null) });
        setLoadError(null);
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
