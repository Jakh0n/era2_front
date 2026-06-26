import { ArrowDownToLine, MoreHorizontal, RotateCw, X } from "lucide-react";
import type { TaskStatus } from "@/entities/generation-task";
import { Button } from "@/shared/ui/button";
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

const iconButtonClass = queueTheme.iconButton;

const accentActionButtonClass = queueTheme.accentIconButton;

export function TaskActions({
  status,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
  className,
}: TaskActionsProps) {
  const { showCancel, showRetry, showDownload } = getTaskActionVisibility(status);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {showCancel && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={iconButtonClass}
          aria-label="Отменить"
          onClick={onCancel}
        >
          <X className="size-4" />
        </Button>
      )}

      {showRetry && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={accentActionButtonClass}
          aria-label="Повторить"
          onClick={onRetry}
        >
          <RotateCw className="size-4" strokeWidth={1.75} />
        </Button>
      )}

      {showDownload && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={accentActionButtonClass}
          aria-label="Скачать"
          onClick={onDownload}
        >
          <ArrowDownToLine className="size-4" strokeWidth={1.75} />
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={iconButtonClass}
            aria-label="Ещё"
          >
            <MoreHorizontal className="size-4" />
          </Button>
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
