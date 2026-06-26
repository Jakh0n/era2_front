import type { GenerationTask, TaskStatus } from "@/entities/generation-task";
import {
  formatCredits,
  formatDoneDuration,
  formatEta,
  formatQueuePosition,
} from "./formatEta";

export interface TaskActionVisibility {
  showCancel: boolean;
  showRetry: boolean;
  showDownload: boolean;
}

export function getTaskActionVisibility(status: TaskStatus): TaskActionVisibility {
  return {
    showCancel: status === "queued" || status === "running",
    showRetry: status === "failed" || status === "canceled",
    showDownload: status === "done",
  };
}

export type TaskMetaPart = {
  text: string;
  className?: string;
  mono?: boolean;
};

export function getTaskMetaParts(task: GenerationTask): TaskMetaPart[] {
  const parts: TaskMetaPart[] = [];

  if (task.status === "queued" && task.queuePosition !== undefined) {
    parts.push({ text: formatQueuePosition(task.queuePosition) });
  } else if (task.status === "running" && task.eta !== undefined) {
    parts.push({ text: formatEta(task.eta), mono: true });
  } else if (task.status === "done" && task.eta !== undefined) {
    parts.push({
      text: formatDoneDuration(task.eta),
      className: "text-[12px] text-era-fg-mute",
    });
  }

  if (task.credits !== undefined) {
    parts.push({ text: formatCredits(task.credits), mono: true });
  }

  return parts;
}

export function formatTaskError(error: string): string {
  return error;
}

export function getTaskStatusMetaMessage(
  task: GenerationTask,
): { text: string } | null {
  if (task.status === "failed" && task.error) {
    return { text: formatTaskError(task.error) };
  }

  if (task.status === "canceled") {
    return { text: "отменено пользователем" };
  }

  return null;
}

export function canClearDoneTasks(doneCount: number): boolean {
  return doneCount > 0;
}
