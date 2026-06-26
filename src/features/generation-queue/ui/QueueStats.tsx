import type { QueueStats as QueueStatsData } from "../model/selectors";
import { cn } from "@/shared/lib/utils";

export interface QueueStatsProps {
  stats: QueueStatsData;
  className?: string;
}

const STAT_ITEMS: Array<{
  key: keyof QueueStatsData;
  label: string;
  dotClass: string;
}> = [
  { key: "queued", label: "В очереди", dotClass: "bg-[#8A7F78]" },
  { key: "running", label: "Идёт", dotClass: "bg-[#E85420]" },
  { key: "done", label: "Готово", dotClass: "bg-emerald-400" },
  { key: "failed", label: "Ошибка", dotClass: "bg-[#FF5F57]" },
];

export function QueueStats({ stats, className }: QueueStatsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4",
        className,
      )}
    >
      {STAT_ITEMS.map(({ key, label, dotClass }) => (
        <div
          key={key}
          className={cn(
            "rounded-2xl border border-[#2A221E] bg-[#141110] px-4 py-4",
            "flex flex-col gap-3 min-h-[88px]",
          )}
        >
          <span className="inline-flex items-center gap-2 text-[13px] text-[#8A7F78]">
            <span className={cn("size-2 shrink-0 rounded-full", dotClass)} aria-hidden />
            {label}
          </span>
          <span className="font-mono text-[32px] leading-none tabular-nums text-[#F6EFE9]">
            {stats[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
