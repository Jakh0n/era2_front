import type { GenType, TaskStatus } from "@/entities/generation-task";
import type { QueueStats, QueueStatusFilter } from "./queueTypes";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  queued: "В очереди",
  running: "Идёт",
  done: "Готово",
  failed: "Ошибка",
  canceled: "Отменено",
};

export const STATUS_STYLES: Record<TaskStatus, string> = {
  queued:
    "inline-flex items-center rounded-[8px] border border-era-line bg-era-bg-2 px-2.5 py-1 text-[13px] font-medium text-era-fg-mute",
  running:
    "inline-flex items-center rounded-[8px] bg-era-accent-soft px-2.5 py-1 text-[13px] font-medium text-era-accent-2",
  done:
    "inline-flex items-center rounded-[8px] border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[13px] font-medium text-emerald-400",
  failed:
    "inline-flex items-center rounded-[8px] border border-era-destructive/30 bg-era-destructive/10 px-2.5 py-1 text-[13px] font-medium text-era-destructive",
  canceled:
    "inline-flex items-center rounded-[8px] border border-era-line px-2.5 py-1 text-[13px] font-medium text-era-fg-low",
};

export const TYPE_LABELS: Record<GenType, string> = {
  text: "Текст",
  image: "Изображение",
  video: "Видео",
  audio: "Аудио",
};

export const FILTER_OPTIONS: Array<{
  value: QueueStatusFilter;
  label: string;
}> = [
  { value: "all", label: "Все" },
  { value: "queued", label: STATUS_LABELS.queued },
  { value: "running", label: STATUS_LABELS.running },
  { value: "done", label: STATUS_LABELS.done },
  { value: "failed", label: STATUS_LABELS.failed },
];

export const STAT_ITEMS: Array<{
  key: keyof QueueStats;
  label: string;
  dotClass: string;
}> = [
  { key: "queued", label: STATUS_LABELS.queued, dotClass: "bg-era-fg-mute" },
  { key: "running", label: STATUS_LABELS.running, dotClass: "bg-era-accent" },
  { key: "done", label: STATUS_LABELS.done, dotClass: "bg-emerald-400" },
  { key: "failed", label: STATUS_LABELS.failed, dotClass: "bg-era-destructive" },
];
