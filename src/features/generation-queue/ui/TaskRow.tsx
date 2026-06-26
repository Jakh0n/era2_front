import { cn } from "@/shared/lib/utils";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { TaskActions } from "./TaskActions";
import {
  TaskCanceledText,
  TaskErrorText,
  TaskItemProps,
  TaskMetaLine,
  TaskPreview,
  TaskPrompt,
  taskItemShellClass,
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
  const isRunning = task.status === "running";

  return (
    <article
      className={cn(
        taskItemShellClass,
        "hidden items-center gap-4 px-4 py-3.5 lg:flex",
        className,
      )}
    >
      <TaskPreview task={task} />

      <div className="min-w-0 flex-1 space-y-2">
        <TaskPrompt prompt={task.prompt} />
        <TaskMetaLine task={task} />
        {task.status === "failed" && <TaskErrorText error={task.error} />}
        {task.status === "canceled" && <TaskCanceledText />}
        {isRunning && (
          <ProgressBar value={task.progress} showPercent={false} className="max-w-md" />
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="flex min-w-[5.5rem] flex-col items-end gap-1">
          {isRunning && (
            <span className="font-mono text-[13px] tabular-nums text-[#E85420]">
              {task.progress}%
            </span>
          )}
          <StatusBadge status={task.status} />
        </div>

        <TaskActions
          status={task.status}
          onCancel={onCancel}
          onRetry={onRetry}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}
