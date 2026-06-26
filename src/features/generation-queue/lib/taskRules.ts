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

export function getTaskMetaParts(task: GenerationTask): string[] {
  const parts: string[] = [];

  if (task.status === "queued" && task.queuePosition !== undefined) {
    parts.push(formatQueuePosition(task.queuePosition));
  } else if (task.status === "running" && task.eta !== undefined) {
    parts.push(formatEta(task.eta));
  } else if (task.status === "done" && task.eta !== undefined) {
    parts.push(formatDoneDuration(task.eta));
  }

  if (task.credits !== undefined) {
    parts.push(formatCredits(task.credits));
  }

  return parts;
}

export function formatTaskError(error: string): string {
  return error.toLowerCase();
}

export function canClearDoneTasks(doneCount: number): boolean {
  return doneCount > 0;
}
