import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { canClearDoneTasks } from "../lib/taskRules";
import { queueTheme } from "../lib/queueTheme";

export interface QueueHeaderProps {
  doneCount: number;
  onClearDone: () => void;
  className?: string;
}

export function QueueHeader({ doneCount, onClearDone, className }: QueueHeaderProps) {
  const canClear = canClearDoneTasks(doneCount);

  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-era-fg md:text-[28px]">
          Очередь генераций
        </h1>
        <p className="text-[14px] text-era-fg-mute">
          Все ваши задачи в реальном времени
        </p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={!canClear}
            className={cn(
              "shrink-0 cursor-pointer rounded-full border-era-form-border bg-transparent px-4",
              "text-era-fg-dim hover:bg-era-bg-2 hover:text-era-fg",
              "disabled:cursor-not-allowed",
            )}
          >
            Очистить готовые
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className={queueTheme.dropdownShell}>
          <AlertDialogHeader>
            <AlertDialogTitle>Очистить готовые задачи?</AlertDialogTitle>
            <AlertDialogDescription className="text-era-fg-mute">
              Будет удалено {doneCount} завершённых задач. Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-era-form-border bg-transparent hover:bg-era-bg-2">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-era-accent hover:bg-era-accent-2"
              onClick={onClearDone}
            >
              Очистить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
