import { useEffect } from "react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  QueueHeader,
  QueueStatsCards,
  QueueToolbar,
  TaskListItem,
  queueTheme,
  useQueue,
} from "@/features/generation-queue";

function GenerationQueueContent() {
  const {
    stats,
    tasks,
    taskCount,
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
    retryLoad,
  } = useQueue();

  useEffect(() => {
    document.title = "ERA2 — Очередь генераций";
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (loadError) {
    return (
      <div className={queueTheme.pageShell}>
        <ErrorState message={loadError} onRetry={retryLoad} />
      </div>
    );
  }

  return (
    <div className={queueTheme.pageShell}>
      <QueueHeader doneCount={stats.done} onClearDone={clearDone} />
      <QueueStatsCards stats={stats} />
      <QueueToolbar
        filter={filter}
        sort={sort}
        search={search}
        onFilterChange={setFilter}
        onSortChange={setSort}
        onSearchChange={setSearch}
      />

      {tasks.length === 0 ? (
        <EmptyState variant={taskCount === 0 ? "empty" : "filtered"} />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onCancel={() => cancel(task.id)}
              onRetry={() => retry(task.id)}
              onDelete={() => deleteTask(task.id)}
              onDownload={() => undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GenerationQueue() {
  return <GenerationQueueContent />;
}
