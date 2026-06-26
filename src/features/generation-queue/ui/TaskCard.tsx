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

export type TaskCardProps = TaskItemProps;

export function TaskCard({
  task,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
  className,
}: TaskCardProps) {
  const isRunning = task.status === "running";

  return (
    <article
      className={cn(
        taskItemShellClass,
        "flex flex-col gap-3 p-4 lg:hidden",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <TaskPreview task={task} />
        <div className="min-w-0 flex-1 space-y-2">
          <TaskPrompt prompt={task.prompt} className="whitespace-normal line-clamp-2 lg:truncate" />
          <TaskMetaLine task={task} />
        </div>
      </div>

      {task.status === "failed" && <TaskErrorText error={task.error} />}
      {task.status === "canceled" && <TaskCanceledText />}

      {isRunning && (
        <div className="space-y-2">
          <ProgressBar value={task.progress} showPercent={false} />
          <div className="flex items-center justify-between text-[13px]">
            <StatusBadge status="running" />
            <span className="font-mono tabular-nums text-[#E85420]">{task.progress}%</span>
          </div>
        </div>
      )}

      {!isRunning && (
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={task.status} />
          <TaskActions
            status={task.status}
            onCancel={onCancel}
            onRetry={onRetry}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        </div>
      )}

      {isRunning && (
        <div className="flex justify-end">
          <TaskActions
            status={task.status}
            onCancel={onCancel}
            onRetry={onRetry}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        </div>
      )}
    </article>
  );
}
