"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSortable } from "@/hooks/useSortable";
import SortHeader from "@/components/SortHeader";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  serviceType?: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { sortedItems, sortKey, direction, requestSort } = useSortable(inquiries);

  const fetchInquiries = () => {
    api.get("/admin/inquiries?size=100").then((res) => {
      const list: Inquiry[] = res.data.content || [];
      list.sort((a, b) => {
        if (a.isRead !== b.isRead) return (a.isRead ? 1 : 0) - (b.isRead ? 1 : 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setInquiries(list);
    });
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await api.put(`/admin/inquiries/${id}/read`);
      toast({ title: "已標記為已讀" });
      fetchInquiries();
    } catch {
      toast({ title: "錯誤", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/inquiries/${deleteId}`);
      toast({ title: "已刪除" });
      setDeleteId(null);
      fetchInquiries();
    } catch {
      toast({ title: "錯誤", description: "刪除失敗", variant: "destructive" });
    }
  };

  const pendingInquiry = inquiries.find((q) => q.id === deleteId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">服務查詢</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader label="狀態" sortKey="isRead" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="姓名" sortKey="name" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="公司" sortKey="company" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="電話" sortKey="phone" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="服務類型" sortKey="serviceType" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="時間" sortKey="createdAt" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-36">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((q) => (
              <tr key={q.id} className={`hover:bg-slate-50/60 transition-colors group ${!q.isRead ? "bg-blue-50/40" : ""}`}>
                <td className="px-5 py-4">
                  {q.isRead ? (
                    <Badge variant="outline" className="text-slate-400 border-slate-200 whitespace-nowrap">已讀</Badge>
                  ) : (
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 whitespace-nowrap">未讀</Badge>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`font-medium ${q.isRead ? "text-slate-900" : "text-slate-900"}`}>{q.name}</span>
                </td>
                <td className="px-5 py-4 text-slate-500">{q.company || "—"}</td>
                <td className="px-5 py-4 text-slate-500">{q.phone || "—"}</td>
                <td className="px-5 py-4 text-slate-500">{q.serviceType || "—"}</td>
                <td className="px-5 py-4 text-slate-400 text-xs">
                  {new Date(q.createdAt).toLocaleString("zh-HK")}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100" onClick={() => setSelected(q)}>
                      查看
                    </Button>
                    {!q.isRead && (
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleMarkRead(q.id)}>
                        標記已讀
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-8 px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(q.id)}>
                      刪除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">
                  暫無服務查詢
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>查詢詳情 #{selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p><strong>姓名:</strong> {selected.name}</p>
                <p><strong>電郵:</strong> {selected.email}</p>
                <p><strong>公司:</strong> {selected.company || "—"}</p>
                <p><strong>電話:</strong> {selected.phone || "—"}</p>
                <p><strong>服務類型:</strong> {selected.serviceType || "—"}</p>
                <p><strong>時間:</strong> {new Date(selected.createdAt).toLocaleString("zh-HK")}</p>
              </div>
              <div className="pt-2 border-t">
                <Label>訊息內容</Label>
                <div className="mt-1 p-3 bg-slate-50 rounded text-sm whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>IP:</strong> {selected.ipAddress || "—"}
              </p>
              <p className="text-xs text-muted-foreground break-all">
                <strong>User-Agent:</strong> {selected.userAgent || "—"}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {!selected.isRead && (
                  <Button size="sm" onClick={() => { handleMarkRead(selected.id); setSelected(null); }}>
                    標記已讀
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => { setDeleteId(selected.id); setSelected(null); }}>
                  刪除
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            確定要刪除查詢「<span className="font-semibold text-slate-900">{pendingInquiry?.name}</span>」嗎？此操作無法復原。
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
