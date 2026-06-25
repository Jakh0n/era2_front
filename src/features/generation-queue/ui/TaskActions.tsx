import { Download, MoreHorizontal, RotateCw, X } from "lucide-react";
import type { TaskStatus } from "@/entities/generation-task";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

export interface TaskActionsProps {
  status: TaskStatus;
  onCancel?: () => void;
  onRetry?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  className?: string;
}

const iconButtonClass =
  "size-8 shrink-0 rounded-lg border border-[#2A221E] bg-[#141110] text-[#C8BEB6] hover:text-[#F6EFE9] hover:border-[#2D2420] hover:bg-[#1A1614]";

export function TaskActions({
  status,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
  className,
}: TaskActionsProps) {
  const showCancel = status === "queued" || status === "running";
  const showRetry = status === "failed" || status === "canceled";
  const showDownload = status === "done";

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
          className={iconButtonClass}
          aria-label="Повторить"
          onClick={onRetry}
        >
          <RotateCw className="size-4" />
        </Button>
      )}

      {showDownload && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={iconButtonClass}
          aria-label="Скачать"
          onClick={onDownload}
        >
          <Download className="size-4" />
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
          className="min-w-[10rem] border-[#2D2420] bg-[#141110] text-[#F6EFE9]"
        >
          <DropdownMenuItem
            className="cursor-pointer text-[#FF5F57] focus:bg-[#39180A] focus:text-[#FF5F57]"
            onClick={onDelete}
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
