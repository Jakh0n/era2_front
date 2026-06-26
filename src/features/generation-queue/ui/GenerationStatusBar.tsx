import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { GenerationTask } from "@/entities/generation-task";
import { Link, useNavigate } from "@/shared/routing";
import { cn } from "@/shared/lib/utils";
import { TYPE_LABELS } from "../lib/queueLabels";
import { useQueue } from "../model/useQueue";
import { ProgressBar } from "./ProgressBar";
import { statusBarShellClass, TaskPreview } from "./taskItemShared";

function StatusBarSpinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("size-4 shrink-0 animate-spin text-[#E85420]", className)}
      aria-hidden
    />
  );
}

function MiniTaskRow({ task }: { task: GenerationTask }) {
  return (
    <div className="flex items-center gap-2.5 min-h-[40px]">
      <TaskPreview task={task} className="size-8 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="truncate text-[13px] font-medium text-[#F6EFE9]">{task.prompt}</p>
        <ProgressBar
          value={task.progress}
          showPercent={false}
          className="gap-0"
          barClassName="h-0.5"
        />
      </div>
      <span className="w-9 shrink-0 text-right font-mono text-[12px] tabular-nums text-[#8A7F78]">
        {task.progress}%
      </span>
    </div>
  );
}

function SingleTaskCard({ task, onOpenQueue }: { task: GenerationTask; onOpenQueue: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpenQueue}
      className={cn(statusBarShellClass, "w-full p-4 text-left hover:border-[#2D2420]")}
    >
      <div className="flex items-start gap-3">
        <StatusBarSpinner />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-[14px] font-medium text-[#F6EFE9]">
            {TYPE_LABELS[task.type]} · {task.model}
          </p>
          <ProgressBar value={task.progress} barClassName="h-1" />
        </div>
      </div>
    </button>
  );
}

function MultiTaskPanel({
  activeCount,
  averageProgress,
  tasks,
  collapsed,
  onToggleCollapse,
  onOpenQueue,
}: {
  activeCount: number;
  averageProgress: number;
  tasks: GenerationTask[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenQueue: () => void;
}) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggleCollapse}
        className={cn(
          statusBarShellClass,
          "inline-flex items-center gap-2 px-4 py-2.5",
          "font-mono text-[13px] tabular-nums text-[#F6EFE9]",
          "hover:border-[#2D2420]",
        )}
      >
        <StatusBarSpinner className="size-3.5" />
        {activeCount} генераций · {averageProgress}%
        <ChevronUp className="size-4 text-[#8A7F78]" />
      </button>
    );
  }

  return (
    <div className={cn(statusBarShellClass, "w-full overflow-hidden lg:w-[360px]")}>
      <div className="flex items-start justify-between gap-3 border-b border-[#2A221E] px-4 py-3">
        <button
          type="button"
          onClick={onOpenQueue}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-[14px] font-medium leading-snug text-[#F6EFE9]">
            Генерации идут · {activeCount} активны · {averageProgress}%
          </p>
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="shrink-0 rounded-[8px] p-1 text-[#8A7F78] hover:bg-[#1A1614] hover:text-[#F6EFE9]"
          aria-label="Свернуть"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="space-y-3 px-4 py-3">
        {tasks.map((task) => (
          <MiniTaskRow key={task.id} task={task} />
        ))}
      </div>

      <div className="border-t border-[#2A221E] px-4 py-3">
        <Link
          to="/queue"
          onClick={(event) => {
            event.preventDefault();
            onOpenQueue();
          }}
          className="inline-flex text-[13px] font-medium text-[#FF7A3D] hover:text-[#FFB27A]"
        >
          Открыть очередь →
        </Link>
      </div>
    </div>
  );
}

export function GenerationStatusBar() {
  const {
    activeCount,
    activeTasks,
    averageProgress,
    statusBarMode,
    statusBarPreviewTasks,
  } = useQueue();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const visible = statusBarMode !== "hidden";
  const openQueue = () => navigate("/queue");

  return (
    <div
      aria-live="polite"
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none fixed z-40",
        "inset-x-0 bottom-0 lg:inset-x-auto lg:right-6 lg:bottom-6",
        "px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-0 lg:pb-0",
        "transition-[opacity,transform] duration-300 ease-out",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "translate-y-3 opacity-0",
      )}
    >
      <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none lg:w-auto">
        {statusBarMode === "single" && activeTasks[0] ? (
          <SingleTaskCard task={activeTasks[0]} onOpenQueue={openQueue} />
        ) : statusBarMode === "multi" ? (
          <MultiTaskPanel
            activeCount={activeCount}
            averageProgress={averageProgress}
            tasks={statusBarPreviewTasks}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((value) => !value)}
            onOpenQueue={openQueue}
          />
        ) : null}
      </div>
    </div>
  );
}
