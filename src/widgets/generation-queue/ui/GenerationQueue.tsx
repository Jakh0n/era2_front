import { useEffect } from "react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  QueueHeader,
  QueueStatsCards,
  QueueToolbar,
  TaskListItem,
  useQueue,
} from "@/features/generation-queue";
import { cn } from "@/shared/lib/utils";

function GenerationQueueContent() {
  const {
    stats,
    tasks,
    taskCount,
    filter,
    sort,
    isLoading,
    loadError,
    setFilter,
    setSort,
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
    return <ErrorState message={loadError} onRetry={retryLoad} />;
  }

  return (
    <div className={cn("mx-auto w-full max-w-6xl space-y-6")}>
      <QueueHeader doneCount={stats.done} onClearDone={clearDone} />
      <QueueStatsCards stats={stats} />
      <QueueToolbar
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
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
