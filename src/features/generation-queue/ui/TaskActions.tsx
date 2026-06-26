import { ArrowDownToLine, MoreHorizontal, RotateCw, X } from "lucide-react";
import type { TaskStatus } from "@/entities/generation-task";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { getTaskActionVisibility } from "../lib/taskRules";
import { queueTheme } from "../lib/queueTheme";

export interface TaskActionsProps {
  status: TaskStatus;
  onCancel?: () => void;
  onRetry?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  className?: string;
}

const iconButtonClass = cn(
  queueTheme.iconButton,
  "inline-flex items-center justify-center transition-colors",
);

const accentActionButtonClass = cn(
  queueTheme.accentIconButton,
  "inline-flex items-center justify-center transition-colors",
);

export function TaskActions({
  status,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
  className,
}: TaskActionsProps) {
  const { showCancel, showRetry, showDownload } =
    getTaskActionVisibility(status);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {showCancel && (
        <button
          type="button"
          className={cn(iconButtonClass, "text-era-fg-mute hover:text-era-fg-dim")}
          aria-label="Отменить"
          onClick={onCancel}
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      )}

      {showRetry && (
        <button
          type="button"
          className={accentActionButtonClass}
          aria-label="Повторить"
          onClick={onRetry}
        >
          <RotateCw className="size-4" strokeWidth={1.75} />
        </button>
      )}

      {showDownload && (
        <button
          type="button"
          className={accentActionButtonClass}
          aria-label="Скачать"
          onClick={onDownload}
        >
          <ArrowDownToLine className="size-4" strokeWidth={1.75} />
        </button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(iconButtonClass, "text-era-fg-mute hover:text-era-fg-dim")}
            aria-label="Ещё"
          >
            <MoreHorizontal className="size-4" strokeWidth={1.75} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className={cn("min-w-[10rem]", queueTheme.dropdownShell)}
        >
          <DropdownMenuItem
            className="cursor-pointer text-era-destructive focus:bg-era-accent-soft focus:text-era-destructive"
            onClick={onDelete}
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
