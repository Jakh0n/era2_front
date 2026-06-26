import { Chip } from "@/shared/ui/era";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { FILTER_OPTIONS } from "../lib/queueLabels";
import { queueTheme } from "../lib/queueTheme";
import {
  isQueueSort,
  type QueueSort,
  type QueueStatusFilter,
} from "../lib/queueTypes";

export interface QueueToolbarProps {
  filter: QueueStatusFilter;
  sort: QueueSort;
  onFilterChange: (filter: QueueStatusFilter) => void;
  onSortChange: (sort: QueueSort) => void;
  className?: string;
}

export function QueueToolbar({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  className,
}: QueueToolbarProps) {
  return (
    <div className={cn("-mx-1 overflow-x-auto px-1 pb-0.5 scrollbar-hide", className)}>
      <div className="flex w-max items-center gap-2">
        {FILTER_OPTIONS.map((option) => {
          const isActive = filter === option.value;

          return (
            <Chip
              key={option.value}
              active={isActive}
              onClick={() => onFilterChange(option.value)}
              className={cn(
                "h-7 shrink-0 px-3.5 shadow-none",
                isActive
                  ? queueTheme.filterChipActive
                  : queueTheme.filterChipIdle,
              )}
            >
              {option.label}
            </Chip>
          );
        })}

        <Select
          value={sort}
          onValueChange={(value) => {
            if (isQueueSort(value)) onSortChange(value);
          }}
        >
          <SelectTrigger className={cn(queueTheme.sortTrigger, "ml-6")}>
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent className={queueTheme.dropdownShell}>
            <SelectItem value="newest">Сначала новые</SelectItem>
            <SelectItem value="oldest">Сначала старые</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
