import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Chip } from "@/shared/ui/era";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { SEARCH_DEBOUNCE_MS } from "../lib/queueConstants";
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
  search: string;
  onFilterChange: (filter: QueueStatusFilter) => void;
  onSortChange: (sort: QueueSort) => void;
  onSearchChange: (search: string) => void;
  className?: string;
}

function QueueSearchInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-era-fg-mute"
        aria-hidden
      />
      <Input
        type="text"
        inputMode="search"
        role="searchbox"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Поиск по промпту"
        aria-label="Поиск по промпту"
        className={cn(
          queueTheme.inputShell,
          "h-7 w-full border py-0 pl-8 pr-8 text-[13px] shadow-none focus-visible:ring-1 focus-visible:ring-era-accent/40",
        )}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Очистить поиск"
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0.5 text-era-fg-mute hover:text-era-fg"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export function QueueToolbar({
  filter,
  sort,
  search,
  onFilterChange,
  onSortChange,
  onSearchChange,
  className,
}: QueueToolbarProps) {
  const [draft, setDraft] = useState(search);

  useEffect(() => {
    setDraft(search);
  }, [search]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (draft !== search) onSearchChange(draft);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [draft, search, onSearchChange]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:gap-4",
        className,
      )}
    >
      <div className="-mx-1 min-w-0 flex-1 overflow-x-auto px-1 pb-0.5 scrollbar-hide min-[1024px]:mx-0 min-[1024px]:px-0">
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
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 min-[1024px]:ml-auto">
        <QueueSearchInput
          value={draft}
          onChange={setDraft}
          className="min-w-0 flex-1 min-[1024px]:w-52 min-[1024px]:flex-none min-[1280px]:w-60"
        />

        <Select
          value={sort}
          onValueChange={(value) => {
            if (isQueueSort(value)) onSortChange(value);
          }}
        >
          <SelectTrigger className={cn(queueTheme.sortTrigger, "shrink-0")}>
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
