import { Image as ImageIcon, MessageSquare, Mic, Video } from "lucide-react";
import type { GenType, GenerationTask } from "@/entities/generation-task";
import { Placeholder } from "@/shared/ui/era";
import { cn } from "@/shared/lib/utils";
import {
  formatCredits,
  formatDoneDuration,
  formatEta,
  formatQueuePosition,
} from "../lib/formatEta";

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
        "border border-[rgba(232,84,32,0.18)] bg-[rgba(232,84,32,0.1)] text-[#E85420]",
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
        "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#C8BEB6]",
        className,
      )}
    >
      <span
        className="size-1.5 shrink-0 rounded-full bg-[#E85420]"
        aria-hidden
      />
      {model}
    </span>
  );
}

function MetaDot() {
  return (
    <span className="text-[#5A504A]" aria-hidden>
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
  const metaParts: string[] = [];

  if (task.status === "queued" && task.queuePosition !== undefined) {
    metaParts.push(formatQueuePosition(task.queuePosition));
  } else if (task.status === "running" && task.eta !== undefined) {
    metaParts.push(formatEta(task.eta));
  } else if (task.status === "done" && task.eta !== undefined) {
    metaParts.push(formatDoneDuration(task.eta));
  }

  if (task.credits !== undefined) {
    metaParts.push(formatCredits(task.credits));
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#8A7F78]",
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
        "truncate text-[15px] font-medium leading-snug text-[#F6EFE9]",
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
    <p className={cn("text-[13px] text-[#FF5F57]/90", className)}>
      {error.toLowerCase()}
    </p>
  );
}

export function TaskCanceledText({ className }: { className?: string }) {
  return (
    <p className={cn("text-[13px] text-[#5A504A]", className)}>
      отменено пользователем
    </p>
  );
}

export const taskItemShellClass =
  "rounded-2xl border border-[#2A221E] bg-[#141110] transition-colors hover:border-[#2D2420]";
