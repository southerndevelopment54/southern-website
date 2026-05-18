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
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
}

interface CategoryConfig {
  key: string;
  label: string;
  badgeColor: string;
  dotColor: string;
}

const CATEGORIES: CategoryConfig[] = [
  { key: "commercial", label: "商場大廈", badgeColor: "bg-blue-50 text-blue-700 border-blue-200", dotColor: "bg-blue-500" },
  { key: "residential", label: "住宅", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200", dotColor: "bg-emerald-500" },
  { key: "other", label: "其他", badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200", dotColor: "bg-indigo-500" },
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
        <span className={`w-2.5 h-2.5 rounded-full ${cat.dotColor}`} />
        <h2 className="text-base font-bold text-slate-800">{cat.label}</h2>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
          {sites.length}
        </span>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader label="編號" sortKey="id" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="名稱" sortKey="name" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="排序" sortKey="displayOrder" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <SortHeader label="狀態" sortKey="isActive" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-28">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-4 text-slate-400 tabular-nums">{s.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {s.imageUrl ? (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                        <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-slate-400">{s.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-medium text-slate-900">{s.name}</span>
                      {s.isFeatured && (
                        <Badge className="ml-2 bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200 whitespace-nowrap">精選</Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-400 tabular-nums">{s.displayOrder ?? "—"}</td>
                <td className="px-5 py-4">
                  {s.isActive ? (
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 whitespace-nowrap">生效中</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-200 whitespace-nowrap">已停用</Badge>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/projects/${s.id}/edit`}>
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                        編輯
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="h-8 px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(s.id)}>
                      刪除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">
                  暫無{cat.label}
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

  const sitesByCategory = (category: string) => {
    const list = sites
      .filter((s) => s.category === category)
      .sort((a, b) => {
        // Featured first, then by displayOrder
        if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1;
        return (a.displayOrder ?? 999) - (b.displayOrder ?? 999);
      });
    return list;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">合作項目</h1>
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
          <p className="text-sm text-slate-600">
            確定要刪除項目「<span className="font-semibold text-slate-900">{pendingSite?.name}</span>」嗎？此操作無法復原。
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
