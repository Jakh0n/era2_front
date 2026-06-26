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
        "border-[#2A221E] bg-[#141110]/60 px-6 py-16 text-center",
        className,
      )}
    >
      <span
        className={cn(
          "mb-4 inline-flex size-12 items-center justify-center rounded-2xl",
          "border border-[#2A221E] bg-[#1A1614] text-[#8A7F78]",
        )}
      >
        <Icon className="size-5" />
      </span>
      <h3 className="text-lg font-medium text-[#F6EFE9]">{title}</h3>
      <p className="mt-2 max-w-sm text-[14px] text-[#8A7F78]">{description}</p>
    </div>
  );
}
