import type { GenerationTask } from "@/entities/generation-task";
import { TaskCard } from "./TaskCard";
import { TaskRow } from "./TaskRow";
import type { TaskItemCallbacks } from "./taskItemShared";

export interface TaskListItemProps extends TaskItemCallbacks {
  task: GenerationTask;
  className?: string;
}

/** Renders TaskRow (lg+) and TaskCard (<lg) for the same task. */
export function TaskListItem({
  task,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
  className,
}: TaskListItemProps) {
  const callbacks = { onCancel, onRetry, onDownload, onDelete };

  return (
    <>
      <TaskRow task={task} className={className} {...callbacks} />
      <TaskCard task={task} className={className} {...callbacks} />
    </>
  );
}

export { TaskRow } from "./TaskRow";
export type { TaskRowProps } from "./TaskRow";
export { TaskCard } from "./TaskCard";
export type { TaskCardProps } from "./TaskCard";
