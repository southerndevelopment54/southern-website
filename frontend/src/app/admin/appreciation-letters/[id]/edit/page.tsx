"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import OrderSlider from "@/components/OrderSlider";
import { compressImage } from "@/lib/image";

interface LetterForm {
  date: string;
  imageKey: string;
  displayOrder: string;
  isActive: boolean;
}

export default function EditAppreciationLetterPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<LetterForm>({
    date: "",
    imageKey: "",
    displayOrder: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/appreciation-letters/${id}`).then((res) => {
      const l = res.data;
      setForm({
        date: l.date || "",
        imageKey: l.imageKey || "",
        displayOrder: l.displayOrder != null ? String(l.displayOrder) : "",
        isActive: l.isActive != null ? l.isActive : true,
      });
      setLoading(false);
    });
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("folder", "appreciation-letters");
      const res = await api.post("/admin/upload", formData);
      setForm({ ...form, imageKey: res.data.imageKey });
      toast({ title: "圖片上傳成功" });
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast({ title: "圖片上傳失敗", description: e.response?.data?.error || "請稍後再試", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) {
      toast({ title: "錯誤", description: "請選擇日期", variant: "destructive" });
      return;
    }
    if (!form.imageKey) {
      toast({ title: "錯誤", description: "請上傳圖片", variant: "destructive" });
      return;
    }
    try {
      await api.put(`/admin/appreciation-letters/${id}`, {
        date: form.date,
        imageKey: form.imageKey || null,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : null,
        isActive: form.isActive,
      });
      toast({ title: "嘉許信已更新" });
      router.push("/admin/appreciation-letters");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({ title: "錯誤", description: e.response?.data?.message || "更新失敗", variant: "destructive" });
    }
  };

  if (loading) return <div className="text-center py-10">載入中...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/appreciation-letters" className="text-sm text-primary">&larr; 返回</Link>
        <h1 className="text-2xl font-bold">編輯客戶嘉許信</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <Label>日期</Label>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </div>
        <div>
          <Label>圖片</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.imageKey && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">已上傳: {form.imageKey}</p>
              <img src={`/api/files/${form.imageKey}`} alt="Preview" className="mt-2 max-h-40 rounded border object-contain" />
            </div>
          )}
        </div>
        <div>
          <Label>顯示排序</Label>
          <OrderSlider
            value={form.displayOrder ? Number(form.displayOrder) : 1}
            onChange={(v) => setForm({ ...form, displayOrder: String(v) })}
          />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          <Label htmlFor="active">生效中</Label>
        </div>
        <div className="flex justify-end gap-2">
          <Link href="/admin/appreciation-letters"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit">儲存</Button>
        </div>
      </form>
    </div>
  );
}
