"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Submission } from "@/types/submission";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSortable } from "@/hooks/useSortable";
import SortHeader from "@/components/SortHeader";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { sortedItems, sortKey, direction, requestSort } = useSortable(submissions);

  const fetchSubmissions = () => {
    api.get("/admin/submissions").then((res) => {
      setSubmissions(res.data.content || res.data);
    });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleStatus = async (id: number, status: string) => {
    try {
      await api.put(`/admin/submissions/${id}/status?status=${status}&adminNotes=${encodeURIComponent(adminNotes)}`);
      toast({ title: "狀態已更新" });
      setAdminNotes("");
      setSelected(null);
      fetchSubmissions();
    } catch {
      toast({ title: "錯誤", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此申請？")) return;
    try {
      await api.delete(`/admin/submissions/${id}`);
      toast({ title: "已刪除" });
      fetchSubmissions();
    } catch {
      toast({ title: "錯誤", variant: "destructive" });
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "new": return "新申請";
      case "reviewed": return "已審閱";
      case "contacted": return "已聯絡";
      case "hired": return "已聘用";
      case "rejected": return "已拒絕";
      default: return status;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">申請紀錄</h1>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <SortHeader label="編號" sortKey="id" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="姓名" sortKey="firstName" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="職位" sortKey="vacancyTitle" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="電話" sortKey="phoneNumber" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="狀態" sortKey="status" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <th className="text-right px-4 py-3 font-medium w-32">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3">{s.id}</td>
                <td className="px-4 py-3">{s.firstName} {s.lastName}</td>
                <td className="px-4 py-3">{s.vacancyTitle}</td>
                <td className="px-4 py-3">{s.phoneNumber}</td>
                <td className="px-4 py-3">
                  <Badge variant={s.status === "new" ? "default" : "secondary"}>{statusLabel(s.status)}</Badge>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => { setSelected(s); setAdminNotes(s.adminNotes || ""); }}>查看</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}>刪除</Button>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  暫無申請紀錄。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setAdminNotes(""); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>申請詳情 #{selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p><strong>姓名:</strong> {selected.firstName} {selected.lastName}</p>
                <p><strong>電話:</strong> {selected.phoneNumber}</p>
                <p><strong>電郵:</strong> {selected.email || "-"}</p>
                <p><strong>職位:</strong> {selected.vacancyTitle}</p>
                <p><strong>經驗:</strong> {selected.yearsOfExperience ?? 0} 年</p>
                <p><strong>學歷:</strong> {selected.educationLevel || "-"}</p>
              </div>
              <p><strong>保安牌照:</strong> {selected.hasSecurityLicense ? "有" : "無"} {selected.licenseNumber ? `(${selected.licenseNumber})` : ""}</p>
              <p><strong>訊息:</strong> {selected.message || "-"}</p>
              <p><strong>狀態:</strong> {statusLabel(selected.status)}</p>
              <p><strong>IP 地址:</strong> {selected.ipAddress || "-"}</p>
              <p><strong>User-Agent:</strong> <span className="text-xs text-muted-foreground break-all">{selected.userAgent || "-"}</span></p>
              {selected.reviewedAt && (
                <p><strong>審閱時間:</strong> {selected.reviewedAt}</p>
              )}

              <div className="pt-2 border-t">
                <Label htmlFor="adminNotes">管理員備註</Label>
                <Textarea
                  id="adminNotes"
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="輸入備註..."
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" onClick={() => handleStatus(selected.id, "reviewed")}>標記已審閱</Button>
                <Button size="sm" variant="outline" onClick={() => handleStatus(selected.id, "contacted")}>標記已聯絡</Button>
                <Button size="sm" variant="outline" onClick={() => handleStatus(selected.id, "hired")}>標記已聘用</Button>
                <Button size="sm" variant="outline" onClick={() => handleStatus(selected.id, "rejected")}>標記已拒絕</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
