import { Image as ImageIcon, MessageSquare, Mic, Video } from "lucide-react";
import type { GenType, GenerationTask } from "@/entities/generation-task";
import { Placeholder } from "@/shared/ui/era";
import { cn } from "@/shared/lib/utils";
import { getTaskMetaParts, formatTaskError } from "../lib/taskRules";
import { queueTheme } from "../lib/queueTheme";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { TaskActions } from "./TaskActions";

export interface TaskItemCallbacks {
  onCancel?: () => void;
  onRetry?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export interface TaskItemProps extends TaskItemCallbacks {
  task: GenerationTask;
  className?: string;
}

const TYPE_ICONS: Record<GenType, typeof MessageSquare> = {
  text: MessageSquare,
  image: ImageIcon,
  video: Video,
  audio: Mic,
};

export const taskItemShellClass = queueTheme.cardShell;

export const statusBarShellClass = queueTheme.statusBarShell;

export function TaskPreview({
  task,
  className,
}: {
  task: GenerationTask;
  className?: string;
}) {
  if (task.type === "image" || task.type === "video") {
    return (
      <Placeholder
        aspect="1/1"
        tone="rust"
        className={cn("size-11 shrink-0 rounded-xl", className)}
      />
    );
  }

  const Icon = TYPE_ICONS[task.type];

  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
        queueTheme.typeIconShell,
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}

export function TaskModelPill({
  model,
  className,
}: {
  model: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-era-fg-dim",
        className,
      )}
    >
      <span
        className="size-1.5 shrink-0 rounded-full bg-era-accent"
        aria-hidden
      />
      {model}
    </span>
  );
}

function MetaDot() {
  return (
    <span className="text-era-fg-low" aria-hidden>
      ·
    </span>
  );
}

export function TaskMetaLine({
  task,
  className,
}: {
  task: GenerationTask;
  className?: string;
}) {
  const metaParts = getTaskMetaParts(task);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-era-fg-mute",
        className,
      )}
    >
      <TaskModelPill model={task.model} />
      {metaParts.map((part) => (
        <span key={part} className="inline-flex items-center gap-2">
          <MetaDot />
          <span className="font-mono tabular-nums">{part}</span>
        </span>
      ))}
    </div>
  );
}

export function TaskPrompt({
  prompt,
  className,
}: {
  prompt: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "truncate text-[15px] font-medium leading-snug text-era-fg",
        className,
      )}
      title={prompt}
    >
      {prompt}
    </p>
  );
}

export function TaskErrorText({
  error,
  className,
}: {
  error?: string;
  className?: string;
}) {
  if (!error) return null;

  return (
    <p className={cn("text-[13px] text-era-destructive/90", className)}>
      {formatTaskError(error)}
    </p>
  );
}

export function TaskCanceledText({ className }: { className?: string }) {
  return (
    <p className={cn("text-[13px] text-era-fg-low", className)}>
      отменено пользователем
    </p>
  );
}

export function TaskStatusMessages({ task }: { task: GenerationTask }) {
  if (task.status === "failed") {
    return <TaskErrorText error={task.error} />;
  }
  if (task.status === "canceled") {
    return <TaskCanceledText />;
  }
  return null;
}

export function TaskProgressPercent({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[13px] tabular-nums text-era-accent",
        className,
      )}
    >
      {progress}%
    </span>
  );
}

export function TaskRunningProgress({
  task,
  className,
  barClassName,
}: {
  task: GenerationTask;
  className?: string;
  barClassName?: string;
}) {
  if (task.status !== "running") return null;

  return (
    <ProgressBar
      value={task.progress}
      showPercent={false}
      className={className}
      barClassName={barClassName}
    />
  );
}

export function TaskItemActions({
  task,
  callbacks,
  className,
}: {
  task: GenerationTask;
  callbacks: TaskItemCallbacks;
  className?: string;
}) {
  return (
    <TaskActions
      status={task.status}
      onCancel={callbacks.onCancel}
      onRetry={callbacks.onRetry}
      onDownload={callbacks.onDownload}
      onDelete={callbacks.onDelete}
      className={className}
    />
  );
}
