"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSortable } from "@/hooks/useSortable";
import SortHeader from "@/components/SortHeader";

interface NotificationRecipient {
  id: number;
  email: string;
  name: string | null;
  isActive: boolean;
  createdAt: string;
}

interface FormData {
  email: string;
  name: string;
  isActive: boolean;
}

const emptyForm: FormData = {
  email: "",
  name: "",
  isActive: true,
};

export default function NotificationRecipientsPage() {
  const [recipients, setRecipients] = useState<NotificationRecipient[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { sortedItems, sortKey, direction, requestSort } = useSortable(recipients);

  const fetchRecipients = () => {
    api.get("/admin/notification-recipients").then((res) => {
      setRecipients(res.data);
    });
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) {
      toast({ title: "錯誤", description: "請輸入電郵地址", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/admin/notification-recipients", {
        email: form.email.trim(),
        name: form.name.trim() || null,
        isActive: form.isActive,
      });
      toast({ title: "已新增" });
      setForm(emptyForm);
      fetchRecipients();
    } catch (err: unknown) {
      toast({
        title: "新增失敗",
        description: isAxiosError(err) ? err.response?.data?.message || "請稍後再試" : "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (recipient: NotificationRecipient) => {
    setEditingId(recipient.id);
    setEditForm({
      email: recipient.email,
      name: recipient.name || "",
      isActive: recipient.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleUpdate = async (id: number) => {
    if (!editForm.email.trim()) {
      toast({ title: "錯誤", description: "請輸入電郵地址", variant: "destructive" });
      return;
    }
    try {
      await api.put(`/admin/notification-recipients/${id}`, {
        email: editForm.email.trim(),
        name: editForm.name.trim() || null,
        isActive: editForm.isActive,
      });
      toast({ title: "已更新" });
      setEditingId(null);
      fetchRecipients();
    } catch (err: unknown) {
      toast({
        title: "更新失敗",
        description: isAxiosError(err) ? err.response?.data?.message || "請稍後再試" : "請稍後再試",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/notification-recipients/${deleteId}`);
      toast({ title: "已刪除" });
      setDeleteId(null);
      fetchRecipients();
    } catch {
      toast({ title: "錯誤", description: "刪除失敗", variant: "destructive" });
    }
  };

  const pendingRecipient = recipients.find((r) => r.id === deleteId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">通知郵件設定</h1>
        <p className="text-sm text-slate-500 mt-1">
          當有職位申請、服務查詢或職位查詢提交時，系統會通知以下電郵地址。
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6 flex flex-col md:flex-row md:items-end gap-4"
      >
        <div className="flex-1">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
            電郵地址 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="notify@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="name" className="text-sm font-medium text-slate-700">
            名稱（可選）
          </Label>
          <Input
            id="name"
            placeholder="例如：人事部"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1"
          />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <input
            id="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <Label htmlFor="isActive" className="text-sm text-slate-700">
            啟用
          </Label>
        </div>
        <Button type="submit" disabled={isSubmitting} className="md:w-auto w-full">
          {isSubmitting ? "處理中..." : "新增收件人"}
        </Button>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader label="電郵地址" sortKey="email" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="名稱" sortKey="name" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="狀態" sortKey="isActive" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-24" />
              <SortHeader label="建立時間" sortKey="createdAt" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-32">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((recipient) => (
              <tr key={recipient.id} className="hover:bg-slate-50/60 transition-colors">
                {editingId === recipient.id ? (
                  <>
                    <td className="px-5 py-3">
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          id={`edit-isActive-${recipient.id}`}
                          type="checkbox"
                          checked={editForm.isActive}
                          onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <label htmlFor={`edit-isActive-${recipient.id}`} className="text-slate-600 text-xs">
                          啟用
                        </label>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {new Date(recipient.createdAt).toLocaleString("zh-HK")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleUpdate(recipient.id)}>
                          儲存
                        </Button>
                        <Button size="sm" variant="ghost" className="text-slate-500" onClick={cancelEdit}>
                          取消
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-4 font-medium text-slate-900">{recipient.email}</td>
                    <td className="px-5 py-4 text-slate-500">{recipient.name || "—"}</td>
                    <td className="px-5 py-4">
                      {recipient.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 whitespace-nowrap">啟用</Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-400 border-slate-200 whitespace-nowrap">已停用</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(recipient.createdAt).toLocaleString("zh-HK")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100" onClick={() => startEdit(recipient)}>
                          編輯
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(recipient.id)}>
                          刪除
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">
                  暫無通知收件人
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
            確定要刪除收件人「<span className="font-semibold text-slate-900">{pendingRecipient?.email}</span>」嗎？此操作無法復原。
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              確認刪除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
