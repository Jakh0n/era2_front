import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  EmptyState,
  ErrorState,
  QueueHeader,
  QueueStatsCards,
  QueueToolbar,
  TaskListItem,
  queueTheme,
  useQueue,
} from "@/features/generation-queue";

const listStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function GenerationQueueContent() {
  const {
    stats,
    tasks,
    taskCount,
    filter,
    sort,
    search,
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
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="show"
          variants={listStagger}
        >
          {tasks.map((task) => (
            <motion.div key={task.id} variants={itemFadeUp}>
              <TaskListItem
                task={task}
                onCancel={() => cancel(task.id)}
                onRetry={() => retry(task.id)}
                onDelete={() => deleteTask(task.id)}
                onDownload={() => undefined}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function GenerationQueue() {
  return <GenerationQueueContent />;
}
