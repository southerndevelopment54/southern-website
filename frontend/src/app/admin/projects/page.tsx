"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const categoryLabel = (c: string) => {
  switch (c) {
    case "key": return "重點項目";
    case "commercial": return "商場大廈";
    case "residential": return "住宅";
    default: return c;
  }
};

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">合作項目</h1>
        <Link href="/admin/projects/new">
          <Button>新增項目</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium">編號</th>
              <th className="text-left px-4 py-3 font-medium">名稱</th>
              <th className="text-left px-4 py-3 font-medium">類別</th>
              <th className="text-left px-4 py-3 font-medium">層級</th>
              <th className="text-left px-4 py-3 font-medium">排序</th>
              <th className="text-left px-4 py-3 font-medium">狀態</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3">{s.id}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {s.imageUrl && <img src={s.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />}
                  {s.name}
                </td>
                <td className="px-4 py-3">{categoryLabel(s.category)}</td>
                <td className="px-4 py-3">{s.tier}</td>
                <td className="px-4 py-3">{s.displayOrder ?? "-"}</td>
                <td className="px-4 py-3">
                  {s.isActive ? <Badge>生效中</Badge> : <Badge variant="secondary">已停用</Badge>}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/admin/projects/${s.id}/edit`}>
                    <Button size="sm" variant="outline">編輯</Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(s.id)}>刪除</Button>
                </td>
              </tr>
            ))}
            {sites.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  暫無合作項目。
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
