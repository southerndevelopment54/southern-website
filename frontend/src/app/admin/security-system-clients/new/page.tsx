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

interface ClientForm {
  name: string;
  nameEn: string;
  nameCn: string;
  logoKey: string;
  displayOrder: string;
  isActive: boolean;
}

export default function NewSecuritySystemClientPage() {
  const router = useRouter();
  const [form, setForm] = useState<ClientForm>({
    name: "",
    nameEn: "",
    nameCn: "",
    logoKey: "",
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
      formData.append("folder", "security-system-clients");
      const res = await api.post("/admin/upload", formData);
      setForm({ ...form, logoKey: res.data.imageKey });
      toast({ title: "圖片上傳成功" });
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      toast({ title: "圖片上傳失敗", description: e.response?.data?.error || "請稍後再試", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast({ title: "錯誤", description: "請填寫名稱", variant: "destructive" });
      return;
    }
    try {
      await api.post("/admin/security-system-clients", {
        name: form.name,
        nameEn: form.nameEn || null,
        nameCn: form.nameCn || null,
        logoKey: form.logoKey || null,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : null,
        isActive: form.isActive,
      });
      toast({ title: "客戶已建立" });
      router.push("/admin/security-system-clients");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({ title: "錯誤", description: e.response?.data?.message || "建立失敗", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/security-system-clients" className="text-sm text-primary">&larr; 返回</Link>
        <h1 className="text-2xl font-bold">新增 CNT 合作客戶</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <Label>名稱（中文）</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <Label>名稱（English）</Label>
          <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
        </div>
        <div>
          <Label>名稱（简体中文）</Label>
          <Input value={form.nameCn} onChange={(e) => setForm({ ...form, nameCn: e.target.value })} />
        </div>
        <div>
          <Label>客戶商標</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.logoKey && <p className="text-sm text-muted-foreground mt-1">已上傳: {form.logoKey}</p>}
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
          <Link href="/admin/security-system-clients"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit">建立</Button>
        </div>
      </form>
    </div>
  );
}
