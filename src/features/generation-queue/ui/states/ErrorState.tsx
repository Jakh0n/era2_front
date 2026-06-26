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
        "border-[#FF5F57]/30 bg-[#141110] px-6 py-16 text-center",
        className,
      )}
      role="alert"
    >
      <span
        className={cn(
          "mb-4 inline-flex size-12 items-center justify-center rounded-2xl",
          "border border-[#FF5F57]/30 bg-[#FF5F57]/10 text-[#FF5F57]",
        )}
      >
        <AlertCircle className="size-5" />
      </span>
      <h3 className="text-lg font-medium text-[#F6EFE9]">Ошибка загрузки</h3>
      <p className="mt-2 max-w-sm text-[14px] text-[#8A7F78]">{message}</p>
      <Button
        type="button"
        className="mt-6 rounded-full bg-[#E85420] hover:bg-[#FF7A3D]"
        onClick={onRetry}
      >
        Повторить
      </Button>
    </div>
  );
}
