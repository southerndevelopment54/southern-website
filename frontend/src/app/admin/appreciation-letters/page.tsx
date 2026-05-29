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

interface AppreciationLetter {
  id: number;
  date: string;
  imageKey: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminAppreciationLettersPage() {
  const [letters, setLetters] = useState<AppreciationLetter[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { sortedItems, sortKey, direction, requestSort } = useSortable(letters);

  const fetchLetters = () => {
    api.get("/admin/appreciation-letters").then((res) => {
      setLetters(res.data);
    });
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/appreciation-letters/${deleteId}`);
      toast({ title: "已刪除" });
      setDeleteId(null);
      fetchLetters();
    } catch {
      toast({ title: "錯誤", description: "刪除失敗", variant: "destructive" });
    }
  };

  const pendingLetter = letters.find((l) => l.id === deleteId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">客戶嘉許信</h1>
        <Link href="/admin/appreciation-letters/new">
          <Button>新增嘉許信</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader label="編號" sortKey="id" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="日期" sortKey="date" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="排序" sortKey="displayOrder" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="狀態" sortKey="isActive" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-28">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-4 text-slate-400 tabular-nums">{l.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {l.imageUrl ? (
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                        <img src={l.imageUrl} alt="" className="w-full h-full object-contain p-0.5" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-slate-400">{l.date?.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-medium text-slate-900">{l.date}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-400 tabular-nums">{l.displayOrder ?? "—"}</td>
                <td className="px-5 py-4">
                  {l.isActive ? (
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 whitespace-nowrap">生效中</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-200 whitespace-nowrap">已停用</Badge>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/appreciation-letters/${l.id}/edit`}>
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                        編輯
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="h-8 px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(l.id)}>
                      刪除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">
                  暫無嘉許信
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            確定要刪除嘉許信「<span className="font-semibold text-slate-900">{pendingLetter?.date}</span>」嗎？此操作無法復原。
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
