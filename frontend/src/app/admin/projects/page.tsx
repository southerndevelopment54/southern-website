"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSortable } from "@/hooks/useSortable";
import SortHeader from "@/components/SortHeader";

interface GuardingSite {
  id: number;
  name: string;
  imageKey: string;
  imageUrl: string;
  address: string;
  category: string;
  tier: number;
  displayOrder: number;
  isActive: boolean;
}

interface CategoryConfig {
  key: string;
  label: string;
  badgeColor: string;
}

const CATEGORIES: CategoryConfig[] = [
  { key: "key", label: "重點項目", badgeColor: "bg-amber-100 text-amber-700" },
  { key: "commercial", label: "商場大廈", badgeColor: "bg-blue-100 text-blue-700" },
  { key: "residential", label: "住宅", badgeColor: "bg-emerald-100 text-emerald-700" },
];

function CategorySection({
  cat,
  sites,
  onDelete,
}: {
  cat: CategoryConfig;
  sites: GuardingSite[];
  onDelete: (id: number) => void;
}) {
  const { sortedItems, sortKey, direction, requestSort } = useSortable(sites);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-lg font-bold text-slate-800">{cat.label}</h2>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cat.badgeColor}`}>
          {sites.length} 項
        </span>
      </div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <SortHeader label="編號" sortKey="id" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="名稱" sortKey="name" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="層級" sortKey="tier" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="排序" sortKey="displayOrder" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <SortHeader label="狀態" sortKey="isActive" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <th className="text-right px-4 py-3 font-medium w-32">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3">{s.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {s.imageUrl && (
                      <img src={s.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />
                    )}
                    <span className="font-medium text-slate-700">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                    {s.tier}
                  </span>
                </td>
                <td className="px-4 py-3">{s.displayOrder ?? "-"}</td>
                <td className="px-4 py-3">
                  {s.isActive ? <Badge>生效中</Badge> : <Badge variant="secondary">已停用</Badge>}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/admin/projects/${s.id}/edit`}>
                    <Button size="sm" variant="outline">編輯</Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(s.id)}>刪除</Button>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  暫無{cat.label}。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [sites, setSites] = useState<GuardingSite[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchSites = () => {
    api.get("/admin/projects").then((res) => {
      setSites(res.data);
    });
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/projects/${deleteId}`);
      toast({ title: "已刪除" });
      setDeleteId(null);
      fetchSites();
    } catch {
      toast({ title: "錯誤", description: "刪除失敗", variant: "destructive" });
    }
  };

  const pendingSite = sites.find((s) => s.id === deleteId);

  const sitesByCategory = (category: string) =>
    sites
      .filter((s) => s.category === category)
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">合作項目</h1>
        <Link href="/admin/projects/new">
          <Button>新增項目</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.key}
            cat={cat}
            sites={sitesByCategory(cat.key)}
            onDelete={setDeleteId}
          />
        ))}
      </div>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            確定要刪除項目「<span className="font-semibold text-gray-900">{pendingSite?.name}</span>」嗎？此操作無法復原。
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>確認刪除</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
