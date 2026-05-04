"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Submission } from "@/types/submission";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);

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
      await api.put(`/admin/submissions/${id}/status?status=${status}`);
      toast({ title: "狀態已更新" });
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">申請紀錄</h1>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium">編號</th>
              <th className="text-left px-4 py-3 font-medium">姓名</th>
              <th className="text-left px-4 py-3 font-medium">職位</th>
              <th className="text-left px-4 py-3 font-medium">電話</th>
              <th className="text-left px-4 py-3 font-medium">狀態</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3">{s.id}</td>
                <td className="px-4 py-3">{s.firstName} {s.lastName}</td>
                <td className="px-4 py-3">{s.vacancyTitle}</td>
                <td className="px-4 py-3">{s.phoneNumber}</td>
                <td className="px-4 py-3">
                  <Badge variant={s.status === "new" ? "default" : "secondary"}>{s.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setSelected(s)}>查看</Button>
                  <Button size="sm" variant="outline" onClick={() => handleStatus(s.id, "reviewed")}>標記已審閱</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id)}>刪除</Button>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  暫無申請紀錄。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>申請詳情</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p><strong>姓名:</strong> {selected.firstName} {selected.lastName}</p>
              <p><strong>電話:</strong> {selected.phoneNumber}</p>
              <p><strong>電郵:</strong> {selected.email || "-"}</p>
              <p><strong>職位:</strong> {selected.vacancyTitle}</p>
              <p><strong>經驗:</strong> {selected.yearsOfExperience ?? 0} 年</p>
              <p><strong>保安牌照:</strong> {selected.hasSecurityLicense ? "有" : "無"} {selected.licenseNumber ? `(${selected.licenseNumber})` : ""}</p>
              <p><strong>學歷:</strong> {selected.educationLevel || "-"}</p>
              <p><strong>訊息:</strong> {selected.message || "-"}</p>
              <p><strong>狀態:</strong> {selected.status}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
