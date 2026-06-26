import { Inbox, SearchX } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type EmptyStateVariant = "empty" | "filtered";

export interface EmptyStateProps {
  variant: EmptyStateVariant;
  className?: string;
}

const COPY: Record<
  EmptyStateVariant,
  { title: string; description: string; icon: typeof Inbox }
> = {
  empty: {
    title: "Очередь пуста",
    description: "Отправьте задачу на генерацию — она появится здесь.",
    icon: Inbox,
  },
  filtered: {
    title: "Ничего не найдено",
    description: "Попробуйте изменить фильтр или поисковый запрос.",
    icon: SearchX,
  },
};

export function EmptyState({ variant, className }: EmptyStateProps) {
  const { title, description, icon: Icon } = COPY[variant];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed",
        "border-era-line bg-era-bg-1/60 px-6 py-16 text-center",
        className,
      )}
    >
      <span
        className={cn(
          "mb-4 inline-flex size-12 items-center justify-center rounded-2xl",
          "border border-era-line bg-era-bg-2 text-era-fg-mute",
        )}
      >
        <Icon className="size-5" />
      </span>
      <h3 className="text-lg font-medium text-era-fg">{title}</h3>
      <p className="mt-2 max-w-sm text-[14px] text-era-fg-mute">{description}</p>
    </div>
  );
}
