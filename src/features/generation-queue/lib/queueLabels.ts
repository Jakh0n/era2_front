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
  queued: "text-[#8A7F78]",
  running: "text-[#E85420]",
  done: "text-emerald-400",
  failed: "text-[#FF5F57]",
  canceled: "text-[#5A504A]",
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
  { key: "queued", label: STATUS_LABELS.queued, dotClass: "bg-[#8A7F78]" },
  { key: "running", label: STATUS_LABELS.running, dotClass: "bg-[#E85420]" },
  { key: "done", label: STATUS_LABELS.done, dotClass: "bg-emerald-400" },
  { key: "failed", label: STATUS_LABELS.failed, dotClass: "bg-[#FF5F57]" },
];
