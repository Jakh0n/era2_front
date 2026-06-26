import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { queueTheme } from "../../lib/queueTheme";

export interface LoadingStateProps {
  className?: string;
}

function HeaderSkeleton() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1.5">
        <Skeleton
          className={cn("h-8 w-56 rounded-md md:h-9", queueTheme.skeleton)}
        />
        <Skeleton
          className={cn("h-4 w-72 max-w-full rounded-md", queueTheme.skeleton)}
        />
      </div>
      <Skeleton
        className={cn(
          "h-9 w-36 shrink-0 rounded-full sm:mt-0.5",
          queueTheme.skeleton,
        )}
      />
    </header>
  );
}

function StatSkeleton() {
  return (
    <div
      className={cn(
        queueTheme.cardShell,
        "flex min-h-[88px] flex-col gap-3 px-4 py-4",
      )}
    >
      <div className="flex items-center gap-2">
        <Skeleton
          className={cn("size-2 shrink-0 rounded-full", queueTheme.skeleton)}
        />
        <Skeleton className={cn("h-4 w-20 rounded-md", queueTheme.skeleton)} />
      </div>
      <Skeleton className={cn("h-8 w-10 rounded-md", queueTheme.skeleton)} />
    </div>
  );
}

function ToolbarSkeleton() {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-0.5 scrollbar-hide md:mx-0 md:px-0">
      <div className="flex w-max items-center gap-2">
        {["w-12", "w-24", "w-14", "w-16", "w-16"].map((width, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-7 shrink-0 rounded-full",
              width,
              queueTheme.skeleton,
            )}
          />
        ))}
        <Skeleton
          className={cn(
            "ml-6 h-7 w-36 shrink-0 rounded-full",
            queueTheme.skeleton,
          )}
        />
      </div>
    </div>
  );
}

function TaskRowSkeleton() {
  return (
    <div
      className={cn(
        queueTheme.cardShell,
        "hidden items-start gap-4 px-4 py-3.5 min-[1024px]:flex",
      )}
    >
      <Skeleton
        className={cn(
          "mt-0.5 size-11 shrink-0",
          queueTheme.previewRadius,
          queueTheme.skeleton,
        )}
      />

      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton
            className={cn(
              "h-[15px] w-full max-w-lg rounded-md",
              queueTheme.skeleton,
            )}
          />
          <Skeleton
            className={cn(
              "h-3 w-full max-w-xs rounded-md",
              queueTheme.skeleton,
            )}
          />
        </div>

        <div className="flex shrink-0 items-center gap-3 pt-0.5">
          <Skeleton
            className={cn("h-7 w-[4.5rem] rounded-[8px]", queueTheme.skeleton)}
          />
          <div className="flex items-center gap-1.5">
            <Skeleton
              className={cn("size-8 rounded-[8px]", queueTheme.skeleton)}
            />
            <Skeleton
              className={cn("size-8 rounded-[8px]", queueTheme.skeleton)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCardSkeleton() {
  return (
    <div
      className={cn(
        queueTheme.cardShell,
        "flex flex-col gap-3 p-4 min-[1024px]:hidden",
      )}
    >
      <div className="flex items-start gap-3">
        <Skeleton
          className={cn(
            "size-11 shrink-0",
            queueTheme.previewRadius,
            queueTheme.skeleton,
          )}
        />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton
            className={cn("h-[15px] w-full rounded-md", queueTheme.skeleton)}
          />
          <Skeleton
            className={cn("h-[15px] w-4/5 rounded-md", queueTheme.skeleton)}
          />
          <Skeleton
            className={cn("h-3 w-2/3 rounded-md", queueTheme.skeleton)}
          />
        </div>
      </div>

      <Skeleton
        className={cn("h-1 w-full rounded-full", queueTheme.skeleton)}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Skeleton
            className={cn("h-7 w-[4.5rem] rounded-[8px]", queueTheme.skeleton)}
          />
          <Skeleton
            className={cn("h-4 w-10 rounded-md", queueTheme.skeleton)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton
            className={cn("size-8 rounded-[8px]", queueTheme.skeleton)}
          />
          <Skeleton
            className={cn("size-8 rounded-[8px]", queueTheme.skeleton)}
          />
        </div>
      </div>
    </div>
  );
}

function TaskListItemSkeleton() {
  return (
    <>
      <TaskRowSkeleton />
      <TaskCardSkeleton />
    </>
  );
}

export function LoadingState({ className }: LoadingStateProps) {
  return (
    <div
      className={cn(queueTheme.pageShell, className)}
      aria-busy="true"
      aria-live="polite"
    >
      <HeaderSkeleton />

      <div className="grid grid-cols-2 gap-3 min-[1024px]:grid-cols-4 min-[1024px]:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>

      <ToolbarSkeleton />

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <TaskListItemSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
