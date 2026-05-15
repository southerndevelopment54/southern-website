import { useState, useMemo } from "react";

export type SortDirection = "asc" | "desc" | null;

function getValue<T>(obj: T, key: string): unknown {
  const keys = key.split(".");
  let value: unknown = obj;
  for (const k of keys) {
    if (value == null) return null;
    value = (value as Record<string, unknown>)[k];
  }
  return value;
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean")
    return a === b ? 0 : a ? -1 : 1;

  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();
  return aStr.localeCompare(bStr);
}

export function useSortable<T>(items: T[]) {
  const [sortKey, setSortKey] = useState<string>("");
  const [direction, setDirection] = useState<SortDirection>(null);

  const requestSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setDirection("asc");
    } else if (direction === "asc") {
      setDirection("desc");
    } else {
      setSortKey("");
      setDirection(null);
    }
  };

  const sortedItems = useMemo(() => {
    if (!sortKey || !direction) return items;
    return [...items].sort((a, b) => {
      const result = compareValues(getValue(a, sortKey), getValue(b, sortKey));
      return direction === "asc" ? result : -result;
    });
  }, [items, sortKey, direction]);

  return { sortedItems, sortKey, direction, requestSort };
}
