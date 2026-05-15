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

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此查詢？")) return;
    try {
      await api.delete(`/admin/inquiries/${id}`);
      toast({ title: "已刪除" });
      fetchInquiries();
    } catch {
      toast({ title: "錯誤", variant: "destructive" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">服務查詢</h1>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <SortHeader label="狀態" sortKey="isRead" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="姓名" sortKey="name" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="公司" sortKey="company" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="電話" sortKey="phone" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="服務類型" sortKey="serviceType" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="時間" sortKey="createdAt" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <th className="text-right px-4 py-3 font-medium w-40">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((q) => (
              <tr key={q.id} className={`border-t ${!q.isRead ? "bg-blue-50/50" : ""}`}>
                <td className="px-4 py-3">
                  <Badge variant={q.isRead ? "secondary" : "default"}>
                    {q.isRead ? "已讀" : "未讀"}
                  </Badge>
                </td>
                <td className="px-4 py-3">{q.name}</td>
                <td className="px-4 py-3">{q.company || "—"}</td>
                <td className="px-4 py-3">{q.phone || "—"}</td>
                <td className="px-4 py-3">{q.serviceType || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(q.createdAt).toLocaleString("zh-HK")}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setSelected(q)}>
                    查看
                  </Button>
                  {!q.isRead && (
                    <Button size="sm" variant="ghost" onClick={() => handleMarkRead(q.id)}>
                      標記已讀
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}>
                    刪除
                  </Button>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  暫無服務查詢。
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
                <Button size="sm" variant="destructive" onClick={() => { handleDelete(selected.id); setSelected(null); }}>
                  刪除
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
