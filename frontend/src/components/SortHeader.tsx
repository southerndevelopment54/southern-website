"use client";

import { SortDirection } from "@/hooks/useSortable";

interface SortHeaderProps {
  label: string;
  sortKey: string;
  currentKey: string;
  direction: SortDirection;
  onSort: (key: string) => void;
  className?: string;
}

export default function SortHeader({
  label,
  sortKey,
  currentKey,
  direction,
  onSort,
  className = "",
}: SortHeaderProps) {
  const isActive = currentKey === sortKey;
  return (
    <th
      className={`text-left px-4 py-3 font-medium cursor-pointer select-none hover:bg-slate-200/50 transition-colors ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="text-xs text-slate-400 w-3 inline-block text-center">
          {isActive && direction === "asc" && "↑"}
          {isActive && direction === "desc" && "↓"}
        </span>
      </span>
    </th>
  );
}
