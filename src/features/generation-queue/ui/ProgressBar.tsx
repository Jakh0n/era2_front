import { cn } from "@/shared/lib/utils";
import { clampProgress } from "../lib/clampProgress";

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  showPercent?: boolean;
  className?: string;
  barClassName?: string;
  labelClassName?: string;
}

export function ProgressBar({
  value,
  showPercent = true,
  className,
  barClassName,
  labelClassName,
}: ProgressBarProps) {
  const clamped = clampProgress(value);

  return (
    <div className={cn("flex w-full min-w-0 items-center gap-3", className)}>
      {showPercent && (
        <span
          className={cn(
            "shrink-0 font-mono text-[12px] tabular-nums text-era-fg-mute",
            labelClassName,
          )}
        >
          {clamped}%
        </span>
      )}

      <div
        className={cn(
          "relative h-1 flex-1 overflow-hidden rounded-full bg-era-line",
          barClassName,
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      >
        <div
          className="h-full rounded-full bg-era-accent transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
