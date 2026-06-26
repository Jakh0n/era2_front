import { useCallback, useContext, useMemo } from "react";
import { QueueContext } from "./QueueProvider";
import {
  selectActiveCount,
  selectAverageActiveProgress,
  selectFilteredSortedTasks,
  selectRunningTasks,
  selectStats,
  selectTaskCount,
  type QueueStats,
} from "./selectors";
import type { QueueSort, QueueStatusFilter } from "./queueState";

export function useQueue() {
  const context = useContext(QueueContext);

  if (!context) {
    throw new Error("useQueue must be used within QueueProvider");
  }

  const { state, dispatch, engineRef, isLoading, loadError, initialize } = context;

  const stats = useMemo(() => selectStats(state.tasks), [state.tasks]);
  const tasks = useMemo(() => selectFilteredSortedTasks(state), [state]);
  const activeCount = useMemo(() => selectActiveCount(state.tasks), [state.tasks]);
  const averageProgress = useMemo(
    () => selectAverageActiveProgress(state.tasks),
    [state.tasks],
  );
  const runningTasks = useMemo(() => selectRunningTasks(state.tasks), [state.tasks]);
  const taskCount = useMemo(() => selectTaskCount(state.tasks), [state.tasks]);

  const setFilter = useCallback(
    (filter: QueueStatusFilter) => dispatch({ type: "SET_FILTER", filter }),
    [dispatch],
  );

  const setSort = useCallback(
    (sort: QueueSort) => dispatch({ type: "SET_SORT", sort }),
    [dispatch],
  );

  const setSearch = useCallback(
    (search: string) => dispatch({ type: "SET_SEARCH", search }),
    [dispatch],
  );

  const cancel = useCallback(
    (taskId: string) => {
      engineRef.current?.abortTask(taskId);
      dispatch({ type: "CANCEL", taskId });
    },
    [dispatch, engineRef],
  );

  const retry = useCallback(
    (taskId: string) => dispatch({ type: "RETRY", taskId }),
    [dispatch],
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      engineRef.current?.abortTask(taskId);
      dispatch({ type: "DELETE", taskId });
    },
    [dispatch, engineRef],
  );

  const clearDone = useCallback(() => dispatch({ type: "CLEAR_DONE" }), [dispatch]);

  return {
    tasks,
    stats,
    activeCount,
    averageProgress,
    runningTasks,
    taskCount,
    filter: state.filter,
    sort: state.sort,
    search: state.search,
    isLoading,
    loadError,
    setFilter,
    setSort,
    setSearch,
    cancel,
    retry,
    deleteTask,
    clearDone,
    retryLoad: initialize,
  };
}

export type { QueueStats };
