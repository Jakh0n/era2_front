import { useEffect, useState } from "react";
import { Search } from "lucide-react";
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
import { isQueueSort, type QueueSort, type QueueStatusFilter } from "../lib/queueTypes";

export interface QueueToolbarProps {
  filter: QueueStatusFilter;
  sort: QueueSort;
  search: string;
  onFilterChange: (filter: QueueStatusFilter) => void;
  onSortChange: (sort: QueueSort) => void;
  onSearchChange: (search: string) => void;
  className?: string;
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
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput !== search) {
        onSearchChange(searchInput);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput, search, onSearchChange]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex w-max min-w-full items-center gap-2">
          {FILTER_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              active={filter === option.value}
              onClick={() => onFilterChange(option.value)}
              className={cn(
                filter === option.value &&
                  "bg-[#39180A] border-[#E85420] text-[#FF7A3D]",
              )}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8A7F78]" />
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Поиск по промпту"
            className={cn(
              "h-9 rounded-full border-[#2D2420] bg-[#141110] pl-9",
              "text-[#F6EFE9] placeholder:text-[#8A7F78]",
            )}
          />
        </div>

        <Select
          value={sort}
          onValueChange={(value) => {
            if (isQueueSort(value)) onSortChange(value);
          }}
        >
          <SelectTrigger
            className={cn(
              "h-9 w-full rounded-full border-[#2D2420] bg-[#141110] sm:w-[200px]",
              "text-[#F6EFE9]",
            )}
          >
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent className="border-[#2D2420] bg-[#141110] text-[#F6EFE9]">
            <SelectItem value="newest">Сначала новые</SelectItem>
            <SelectItem value="oldest">Сначала старые</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
