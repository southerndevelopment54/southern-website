"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useSortable } from "@/hooks/useSortable";
import SortHeader from "@/components/SortHeader";

interface TierLimit {
  id: number;
  category: string;
  maxCount: number;
}

const categoryLabel = (c: string) => {
  switch (c) {
    case "commercial": return "商場大廈";
    case "residential": return "住宅";
    case "other": return "其他";
    default: return c;
  }
};

export default function AdminTierLimitsPage() {
  const [limits, setLimits] = useState<TierLimit[]>([]);
  const [editing, setEditing] = useState<Record<number, number>>({});

  const { sortedItems, sortKey, direction, requestSort } = useSortable(limits);

  const fetchLimits = () => {
    api.get("/admin/tier-limits").then((res) => {
      const data = res.data as TierLimit[];
      setLimits(data);
      const map: Record<number, number> = {};
      data.forEach((l) => { map[l.id] = l.maxCount; });
      setEditing(map);
    });
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  const handleUpdate = async (id: number) => {
    const limit = limits.find((l) => l.id === id);
    if (!limit) return;
    try {
      await api.put(`/admin/tier-limits/${id}`, {
        category: limit.category,
        maxCount: editing[id],
      });
      toast({ title: "已更新" });
      fetchLimits();
    } catch {
      toast({ title: "錯誤", description: "更新失敗", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">精選項目上限</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader label="類別" sortKey="category" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="最大數量" sortKey="maxCount" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-24">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-4 font-medium text-slate-900">{categoryLabel(l.category)}</td>
                <td className="px-5 py-4">
                  <Input
                    type="number"
                    className="w-24 h-9 text-sm"
                    value={editing[l.id] ?? l.maxCount}
                    onChange={(e) => setEditing({ ...editing, [l.id]: Number(e.target.value) })}
                  />
                </td>
                <td className="px-5 py-4 text-right">
                  <Button size="sm" className="h-8" onClick={() => handleUpdate(l.id)}>儲存</Button>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-slate-400 text-sm">
                  暫無設定
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
