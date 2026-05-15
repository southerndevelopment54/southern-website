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
  tier: number;
  maxCount: number;
}

const categoryLabel = (c: string) => {
  switch (c) {
    case "key": return "重點項目";
    case "commercial": return "商場大廈";
    case "residential": return "住宅";
    default: return c;
  }
};

function TierTable({
  tier,
  limits,
  editing,
  setEditing,
  onSave,
  headerColor,
}: {
  tier: number;
  limits: TierLimit[];
  editing: Record<number, number>;
  setEditing: (map: Record<number, number>) => void;
  onSave: (id: number) => void;
  headerColor: string;
}) {
  const { sortedItems, sortKey, direction, requestSort } = useSortable(limits);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
      <div className={`${headerColor} text-white px-5 py-3 text-sm font-semibold`}>
        層級 {tier}
      </div>
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
                <Button size="sm" className="h-8" onClick={() => onSave(l.id)}>儲存</Button>
              </td>
            </tr>
          ))}
          {sortedItems.length === 0 && (
            <tr>
              <td colSpan={3} className="px-5 py-12 text-center text-slate-400 text-sm">
                暫無層級 {tier} 設定
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminTierLimitsPage() {
  const [limits, setLimits] = useState<TierLimit[]>([]);
  const [editing, setEditing] = useState<Record<number, number>>({});

  const fetchLimits = () => {
    api.get("/admin/tier-limits").then((res) => {
      const sorted = (res.data as TierLimit[]).sort((a, b) => a.tier - b.tier);
      setLimits(sorted);
      const map: Record<number, number> = {};
      sorted.forEach((l) => { map[l.id] = l.maxCount; });
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
        tier: limit.tier,
        maxCount: editing[id],
      });
      toast({ title: "已更新" });
      fetchLimits();
    } catch {
      toast({ title: "錯誤", description: "更新失敗", variant: "destructive" });
    }
  };

  const tier1 = limits.filter((l) => l.tier === 1);
  const tier2 = limits.filter((l) => l.tier === 2);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">層級限制</h1>

      <div className="space-y-6">
        <TierTable
          tier={1}
          limits={tier1}
          editing={editing}
          setEditing={setEditing}
          onSave={handleUpdate}
          headerColor="bg-slate-800"
        />
        <TierTable
          tier={2}
          limits={tier2}
          editing={editing}
          setEditing={setEditing}
          onSave={handleUpdate}
          headerColor="bg-slate-600"
        />
      </div>
    </div>
  );
}
