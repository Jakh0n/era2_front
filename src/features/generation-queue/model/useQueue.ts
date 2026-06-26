import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
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
import { useQueueStore, initializeQueueFromSeed } from "./queueStore";

export function useQueue() {
  const {
    filter,
    sort,
    search,
    isLoading,
    loadError,
    tasks: allTasks,
    setFilter,
    setSort,
    setSearch,
    cancel,
    retry,
    deleteTask,
    clearDone,
  } = useQueueStore(
    useShallow((state) => ({
      filter: state.filter,
      sort: state.sort,
      search: state.search,
      isLoading: state.isLoading,
      loadError: state.loadError,
      tasks: state.tasks,
      setFilter: state.setFilter,
      setSort: state.setSort,
      setSearch: state.setSearch,
      cancel: state.cancel,
      retry: state.retry,
      deleteTask: state.deleteTask,
      clearDone: state.clearDone,
    })),
  );

  const queueView = useMemo(
    () => ({ tasks: allTasks, filter, sort, search }),
    [allTasks, filter, sort, search],
  );

  const stats = useMemo(() => selectStats(allTasks), [allTasks]);
  const tasks = useMemo(
    () => selectFilteredSortedTasks(queueView),
    [queueView],
  );
  const activeCount = useMemo(() => selectActiveCount(allTasks), [allTasks]);
  const activeTasks = useMemo(() => selectActiveTasks(allTasks), [allTasks]);
  const averageProgress = useMemo(
    () => selectAverageActiveProgress(allTasks),
    [allTasks],
  );
  const runningTasks = useMemo(() => selectRunningTasks(allTasks), [allTasks]);
  const taskCount = useMemo(() => selectTaskCount(allTasks), [allTasks]);
  const statusBarMode = useMemo(
    () => selectStatusBarMode(activeCount, isLoading),
    [activeCount, isLoading],
  );
  const statusBarPreviewTasks = useMemo(
    () => selectStatusBarPreviewTasks(activeTasks),
    [activeTasks],
  );

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
    filter,
    sort,
    search,
    isLoading,
    loadError,
    setFilter,
    setSort,
    setSearch,
    cancel,
    retry,
    deleteTask,
    clearDone,
    retryLoad: initializeQueueFromSeed,
  };
}

/** Status bar reads task progress; derived values computed in useMemo. */
export function useQueueStatusBar() {
  const tasks = useQueueStore((state) => state.tasks);
  const isLoading = useQueueStore((state) => state.isLoading);

  return useMemo(() => {
    const activeCount = selectActiveCount(tasks);
    const activeTasks = selectActiveTasks(tasks);

    return {
      activeCount,
      activeTasks,
      averageProgress: selectAverageActiveProgress(tasks),
      statusBarMode: selectStatusBarMode(activeCount, isLoading),
      statusBarPreviewTasks: selectStatusBarPreviewTasks(activeTasks),
    };
  }, [tasks, isLoading]);
}

export { initializeQueueFromSeed } from "./queueStore";

export type { QueueStats, StatusBarMode };