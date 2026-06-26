import { cn } from "@/shared/lib/utils";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import {
  TaskItemProps,
  TaskMetaLine,
  TaskPreview,
  TaskPrompt,
  TaskProgressPercent,
  TaskRunningProgress,
  TaskItemActions,
  getTaskItemShellClass,
} from "./taskItemShared";

export type TaskRowProps = TaskItemProps;

export function TaskRow({
  task,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
  className,
}: TaskRowProps) {
  const callbacks = { onCancel, onRetry, onDownload, onDelete };
  const isRunning = task.status === "running";

  return (
    <article
      className={cn(
        getTaskItemShellClass(task.status),
        "hidden items-start gap-4 px-4 py-3.5 min-[1024px]:flex",
        className,
      )}
    >
      <TaskPreview task={task} className="mt-0.5" />

      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <TaskPrompt prompt={task.prompt} />
          <TaskMetaLine task={task} />
          {isRunning && <TaskRunningProgress task={task} />}
        </div>

        <div className="flex shrink-0 items-center gap-3 pt-0.5">
          <div className="flex items-center gap-1">
            {isRunning && <TaskProgressPercent progress={task.progress} />}
            <StatusBadge status={task.status} />
          </div>
          <TaskItemActions task={task} callbacks={callbacks} />
        </div>
      </div>
    </article>
  );
}
