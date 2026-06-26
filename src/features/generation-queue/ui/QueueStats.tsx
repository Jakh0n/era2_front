import { cn } from "@/shared/lib/utils";
import { STAT_ITEMS } from "../lib/queueLabels";
import { queueTheme } from "../lib/queueTheme";
import type { QueueStats as QueueStatsData } from "../lib/queueTypes";

export interface QueueStatsProps {
  stats: QueueStatsData;
  className?: string;
}

export function QueueStats({ stats, className }: QueueStatsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 min-[1024px]:grid-cols-4 min-[1024px]:gap-4",
        className,
      )}
    >
      {STAT_ITEMS.map(({ key, label, dotClass }) => (
        <div
          key={key}
          className={cn(
            queueTheme.cardShell,
            "px-4 py-4 flex flex-col gap-3 min-h-[88px]",
          )}
        >
          <span className="inline-flex items-center gap-2 text-[13px] text-era-fg-mute">
            <span className={cn("size-2 shrink-0 rounded-full", dotClass)} aria-hidden />
            {label}
          </span>
          <span className="font-mono text-[32px] leading-none tabular-nums text-era-fg">
            {stats[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
