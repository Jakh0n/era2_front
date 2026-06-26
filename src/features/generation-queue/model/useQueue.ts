import { useCallback, useContext, useMemo } from "react";
import { QueueContext } from "./QueueProvider";
import {
  selectActiveCount,
  selectActiveTasks,
  selectAverageActiveProgress,
  selectFilteredSortedTasks,
  selectRunningTasks,
  selectStats,
  selectStatusBarMode,
  selectStatusBarPreviewTasks,
  selectTaskCount,
  type QueueStats,
  type StatusBarMode,
} from "./selectors";
import type { QueueSort, QueueStatusFilter } from "../lib/queueTypes";

export function useQueue() {
  const context = useContext(QueueContext);

  if (!context) {
    throw new Error("useQueue must be used within QueueProvider");
  }

  const { state, dispatch, engineRef, isLoading, loadError, initialize } = context;

  const stats = useMemo(() => selectStats(state.tasks), [state.tasks]);
  const tasks = useMemo(() => selectFilteredSortedTasks(state), [state]);
  const activeCount = useMemo(() => selectActiveCount(state.tasks), [state.tasks]);
  const activeTasks = useMemo(() => selectActiveTasks(state.tasks), [state.tasks]);
  const averageProgress = useMemo(
    () => selectAverageActiveProgress(state.tasks),
    [state.tasks],
  );
  const runningTasks = useMemo(() => selectRunningTasks(state.tasks), [state.tasks]);
  const taskCount = useMemo(() => selectTaskCount(state.tasks), [state.tasks]);
  const statusBarMode = useMemo(
    () => selectStatusBarMode(activeCount, isLoading),
    [activeCount, isLoading],
  );
  const statusBarPreviewTasks = useMemo(
    () => selectStatusBarPreviewTasks(activeTasks),
    [activeTasks],
  );

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
    activeTasks,
    averageProgress,
    runningTasks,
    taskCount,
    statusBarMode,
    statusBarPreviewTasks,
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

export type { QueueStats, StatusBarMode };
