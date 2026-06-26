import { Fragment } from "react";
import { Image as ImageIcon, MessageSquare, Mic, Video } from "lucide-react";
import type {
  GenType,
  GenerationTask,
  TaskStatus,
} from "@/entities/generation-task";
import { cn } from "@/shared/lib/utils";
import { getTaskMetaParts, getTaskStatusMetaMessage } from "../lib/taskRules";
import { queueTheme } from "../lib/queueTheme";
import { ProgressBar } from "./ProgressBar";
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

export function getTaskItemShellClass(status: TaskStatus, className?: string) {
  return cn(
    queueTheme.cardShell,
    status === "running" && queueTheme.cardShellActive,
    className,
  );
}

export const statusBarShellClass = queueTheme.statusBarShell;

export function TaskPreview({
  task,
  className,
}: {
  task: GenerationTask;
  className?: string;
}) {
  const Icon = TYPE_ICONS[task.type];

  return (
    <span
      className={cn(
        "relative inline-flex size-11 shrink-0 items-center justify-center",
        queueTheme.previewRadius,
        queueTheme.previewShell,
        "text-era-accent",
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
  const statusMessage = getTaskStatusMetaMessage(task);

  return (
    <div
      className={cn(
        "flex min-w-0 flex-nowrap items-center gap-x-1.5 overflow-hidden text-[13px] text-era-fg-mute",
        className,
      )}
    >
      <TaskModelPill model={task.model} className="shrink-0" />
      {metaParts.map((part) => (
        <Fragment key={part.text}>
          <MetaDot />
          <span
            className={cn(
              "shrink-0",
              part.mono && "font-mono tabular-nums",
              part.className,
            )}
          >
            {part.text}
          </span>
        </Fragment>
      ))}
      {statusMessage && (
        <>
          <MetaDot />
          <span className="shrink-0 text-[12px] text-era-fg-low">
            {statusMessage.text}
          </span>
        </>
      )}
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
        "inline-block min-w-[3rem] shrink-0 text-right font-mono text-[13px] tabular-nums text-era-accent",
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
      className={cn("w-full", className)}
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
