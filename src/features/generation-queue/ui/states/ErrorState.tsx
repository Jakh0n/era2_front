import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  className?: string;
}

export function ErrorState({
  message = "Не удалось загрузить очередь генераций",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border",
        "border-era-destructive/30 bg-era-bg-1 px-6 py-16 text-center",
        className,
      )}
      role="alert"
    >
      <span
        className={cn(
          "mb-4 inline-flex size-12 items-center justify-center rounded-2xl",
          "border border-era-destructive/30 bg-era-destructive/10 text-era-destructive",
        )}
      >
        <AlertCircle className="size-5" />
      </span>
      <h3 className="text-lg font-medium text-era-fg">Ошибка загрузки</h3>
      <p className="mt-2 max-w-sm text-[14px] text-era-fg-mute">{message}</p>
      <Button
        type="button"
        className="mt-6 rounded-full bg-era-accent hover:bg-era-accent-2"
        onClick={onRetry}
      >
        Повторить
      </Button>
    </div>
  );
}
