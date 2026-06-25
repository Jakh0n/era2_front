import { cn } from "@/shared/lib/utils";

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
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-3 min-w-0", className)}>
      {showPercent && (
        <span
          className={cn(
            "shrink-0 font-mono text-[12px] tabular-nums text-[#8A7F78]",
            labelClassName,
          )}
        >
          {clamped}%
        </span>
      )}

      <div
        className={cn(
          "relative h-1 flex-1 overflow-hidden rounded-full bg-[#2A221E]",
          barClassName,
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      >
        <div
          className="h-full rounded-full bg-[#E85420] transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
