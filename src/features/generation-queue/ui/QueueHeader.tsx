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
        <h1 className="text-2xl font-semibold tracking-tight text-[#F6EFE9] md:text-[28px]">
          Очередь генераций
        </h1>
        <p className="text-[14px] text-[#8A7F78]">
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
              "shrink-0 rounded-full border-[#2D2420] bg-transparent px-4",
              "text-[#C8BEB6] hover:bg-[#1A1614] hover:text-[#F6EFE9]",
            )}
          >
            Очистить готовые
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="border-[#2D2420] bg-[#141110] text-[#F6EFE9]">
          <AlertDialogHeader>
            <AlertDialogTitle>Очистить готовые задачи?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8A7F78]">
              Будет удалено {doneCount} завершённых задач. Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-[#2D2420] bg-transparent hover:bg-[#1A1614]">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-[#E85420] hover:bg-[#FF7A3D]"
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
