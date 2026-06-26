import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";

export interface LoadingStateProps {
  className?: string;
}

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2A221E] bg-[#141110] px-4 py-4 space-y-3">
      <Skeleton className="h-4 w-24 rounded-full bg-[#2A221E]" />
      <Skeleton className="h-8 w-12 rounded-md bg-[#2A221E]" />
    </div>
  );
}

function TaskRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#2A221E] bg-[#141110] px-4 py-3.5">
      <Skeleton className="size-11 shrink-0 rounded-xl bg-[#2A221E]" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 max-w-md rounded-md bg-[#2A221E]" />
        <Skeleton className="h-3 w-1/2 max-w-xs rounded-md bg-[#2A221E]" />
      </div>
      <Skeleton className="hidden h-8 w-24 rounded-lg bg-[#2A221E] lg:block" />
    </div>
  );
}

export function LoadingState({ className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-6 animate-pulse", className)} aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 rounded-md bg-[#2A221E]" />
        <Skeleton className="h-4 w-72 rounded-md bg-[#2A221E]" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>

      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-24 shrink-0 rounded-full bg-[#2A221E]" />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <TaskRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
