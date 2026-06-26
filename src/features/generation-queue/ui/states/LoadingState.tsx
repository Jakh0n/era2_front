import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { queueTheme } from "../../lib/queueTheme";

export interface LoadingStateProps {
  className?: string;
}

function StatSkeleton() {
  return (
    <div className={cn(queueTheme.cardShell, "px-4 py-4 space-y-3")}>
      <Skeleton className={cn("h-4 w-24 rounded-full", queueTheme.skeleton)} />
      <Skeleton className={cn("h-8 w-12 rounded-md", queueTheme.skeleton)} />
    </div>
  );
}

function TaskRowSkeleton() {
  return (
    <div className={cn(queueTheme.cardShell, "flex items-center gap-4 px-4 py-3.5")}>
      <Skeleton className={cn("size-11 shrink-0 rounded-xl", queueTheme.skeleton)} />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className={cn("h-4 w-3/4 max-w-md rounded-md", queueTheme.skeleton)} />
        <Skeleton className={cn("h-3 w-1/2 max-w-xs rounded-md", queueTheme.skeleton)} />
      </div>
      <Skeleton className={cn("hidden h-8 w-24 rounded-lg lg:block", queueTheme.skeleton)} />
    </div>
  );
}

export function LoadingState({ className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-6 animate-pulse", className)} aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <Skeleton className={cn("h-8 w-56 rounded-md", queueTheme.skeleton)} />
        <Skeleton className={cn("h-4 w-72 rounded-md", queueTheme.skeleton)} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>

      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className={cn("h-7 w-24 shrink-0 rounded-full", queueTheme.skeleton)} />
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
