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

interface Client {
  id: number;
  name: string;
  logoKey: string;
  logoUrl: string;
  enterpriseTypeName: string;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { sortedItems, sortKey, direction, requestSort } = useSortable(clients);

  const fetchClients = () => {
    api.get("/admin/clients").then((res) => {
      setClients(res.data);
    });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/clients/${deleteId}`);
      toast({ title: "已刪除" });
      setDeleteId(null);
      fetchClients();
    } catch {
      toast({ title: "錯誤", description: "刪除失敗", variant: "destructive" });
    }
  };

  const pendingClient = clients.find((c) => c.id === deleteId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">合作客戶</h1>
        <Link href="/admin/clients/new">
          <Button>新增客戶</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <SortHeader label="編號" sortKey="id" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="名稱" sortKey="name" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="企業類型" sortKey="enterpriseTypeName" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="精選" sortKey="isFeatured" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="排序" sortKey="displayOrder" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="狀態" sortKey="isActive" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <th className="text-right px-4 py-3 font-medium w-32">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3">{c.id}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {c.logoUrl && <img src={c.logoUrl} alt="" className="w-8 h-8 object-contain" />}
                  {c.name}
                </td>
                <td className="px-4 py-3">{c.enterpriseTypeName || "-"}</td>
                <td className="px-4 py-3">
                  {c.isFeatured ? <Badge>精選</Badge> : <Badge variant="secondary">-</Badge>}
                </td>
                <td className="px-4 py-3">{c.displayOrder ?? "-"}</td>
                <td className="px-4 py-3">
                  {c.isActive ? <Badge>生效中</Badge> : <Badge variant="secondary">已停用</Badge>}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/admin/clients/${c.id}/edit`}>
                    <Button size="sm" variant="outline">編輯</Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(c.id)}>刪除</Button>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  暫無客戶。
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
            確定要刪除客戶「<span className="font-semibold text-gray-900">{pendingClient?.name}</span>」嗎？此操作無法復原。
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
