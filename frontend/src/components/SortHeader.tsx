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
      scope="col"
      className={`px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 transition-colors whitespace-nowrap ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="inline-flex flex-col leading-[0.5] text-[10px] text-slate-400">
          <span className={isActive && direction === "asc" ? "text-slate-700" : "text-slate-300"}>▲</span>
          <span className={isActive && direction === "desc" ? "text-slate-700" : "text-slate-300"}>▼</span>
        </span>
      </span>
    </th>
  );
}
