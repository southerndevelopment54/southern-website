"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

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

export default function AdminTierLimitsPage() {
  const [limits, setLimits] = useState<TierLimit[]>([]);
  const [editing, setEditing] = useState<Record<number, number>>({});

  const fetchLimits = () => {
    api.get("/admin/tier-limits").then((res) => {
      setLimits(res.data);
      const map: Record<number, number> = {};
      res.data.forEach((l: TierLimit) => { map[l.id] = l.maxCount; });
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">層級限制</h1>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium">類別</th>
              <th className="text-left px-4 py-3 font-medium">層級</th>
              <th className="text-left px-4 py-3 font-medium">最大數量</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {limits.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-3">{categoryLabel(l.category)}</td>
                <td className="px-4 py-3">{l.tier}</td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    className="w-24"
                    value={editing[l.id] ?? l.maxCount}
                    onChange={(e) => setEditing({ ...editing, [l.id]: Number(e.target.value) })}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" onClick={() => handleUpdate(l.id)}>儲存</Button>
                </td>
              </tr>
            ))}
            {limits.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  暫無層級限制設定。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
