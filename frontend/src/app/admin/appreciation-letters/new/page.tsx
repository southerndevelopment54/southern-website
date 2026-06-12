"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewAppreciationLetterPage() {
  const router = useRouter();
  const [form, setForm] = useState<LetterForm>({
    date: new Date().toISOString().split("T")[0],
    imageKey: "",
    displayOrder: "1",
    isActive: true,
  });

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
      await api.post("/admin/appreciation-letters", {
        date: form.date,
        imageKey: form.imageKey || null,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : null,
        isActive: form.isActive,
      });
      toast({ title: "嘉許信已建立" });
      router.push("/admin/appreciation-letters");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({ title: "錯誤", description: e.response?.data?.message || "建立失敗", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/appreciation-letters" className="text-sm text-primary">&larr; 返回</Link>
        <h1 className="text-2xl font-bold">新增嘉許信</h1>
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
          <Button type="submit">建立</Button>
        </div>
      </form>
    </div>
  );
}
