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

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "新申請", className: "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 whitespace-nowrap" },
  reviewed: { label: "已審閱", className: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200 whitespace-nowrap" },
  contacted: { label: "已聯絡", className: "bg-violet-50 text-violet-700 hover:bg-violet-50 border-violet-200 whitespace-nowrap" },
  hired: { label: "已聘用", className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 whitespace-nowrap" },
  rejected: { label: "已拒絕", className: "bg-red-50 text-red-700 hover:bg-red-50 border-red-200 whitespace-nowrap" },
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/submissions/${deleteId}`);
      toast({ title: "已刪除" });
      setDeleteId(null);
      fetchSubmissions();
    } catch {
      toast({ title: "錯誤", description: "刪除失敗", variant: "destructive" });
    }
  };

  const pendingSubmission = submissions.find((s) => s.id === deleteId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">申請紀錄</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader label="編號" sortKey="id" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="姓名" sortKey="firstName" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="職位" sortKey="vacancyTitle" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="電話" sortKey="phoneNumber" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="狀態" sortKey="status" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-24" />
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-28">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((s) => {
              const statusCfg = statusConfig[s.status] || { label: s.status, className: "" };
              return (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-4 text-slate-400 tabular-nums">{s.id}</td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-900">{s.firstName} {s.lastName}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{s.vacancyTitle}</td>
                  <td className="px-5 py-4 text-slate-500">{s.phoneNumber}</td>
                  <td className="px-5 py-4">
                    <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100" onClick={() => { setSelected(s); setAdminNotes(s.adminNotes || ""); }}>
                        查看
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(s.id)}>
                        刪除
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">
                  暫無申請紀錄
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
              <p><strong>狀態:</strong> {(statusConfig[selected.status] || { label: selected.status }).label}</p>
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
                <Button size="sm" variant="destructive" onClick={() => { setDeleteId(selected.id); setSelected(null); }}>刪除</Button>
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
            確定要刪除申請「<span className="font-semibold text-slate-900">{pendingSubmission?.firstName} {pendingSubmission?.lastName}</span>」嗎？此操作無法復原。
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
