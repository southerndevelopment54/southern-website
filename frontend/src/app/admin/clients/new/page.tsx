"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import OrderSlider from "@/components/OrderSlider";

interface EnterpriseType {
  id: number;
  typeName: string;
}

interface ClientForm {
  name: string;
  logoKey: string;
  enterpriseTypeId: string;
  isFeatured: boolean;
  displayOrder: string;
  isActive: boolean;
}

export default function NewClientPage() {
  const router = useRouter();
  const [types, setTypes] = useState<EnterpriseType[]>([]);
  const [form, setForm] = useState<ClientForm>({
    name: "",
    logoKey: "",
    enterpriseTypeId: "",
    isFeatured: false,
    displayOrder: "1",
    isActive: true,
  });

  useEffect(() => {
    api.get("/enterprise-types").then((res) => setTypes(res.data));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "clients");
    try {
      const res = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, logoKey: res.data.imageKey });
      toast({ title: "圖片上傳成功" });
    } catch {
      toast({ title: "圖片上傳失敗", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast({ title: "錯誤", description: "請填寫名稱", variant: "destructive" });
      return;
    }
    try {
      await api.post("/admin/clients", {
        name: form.name,
        logoKey: form.logoKey || null,
        enterpriseTypeId: form.enterpriseTypeId ? Number(form.enterpriseTypeId) : null,
        isFeatured: form.isFeatured,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : null,
        isActive: form.isActive,
      });
      toast({ title: "客戶已建立" });
      router.push("/admin/clients");
    } catch (err: any) {
      toast({ title: "錯誤", description: err.response?.data?.message || "建立失敗", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/clients" className="text-sm text-primary">&larr; 返回</Link>
        <h1 className="text-2xl font-bold">新增客戶</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <Label>名稱</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <Label>企業類型</Label>
          <Select value={form.enterpriseTypeId} onValueChange={(v) => setForm({ ...form, enterpriseTypeId: v })}>
            <SelectTrigger><SelectValue placeholder="選擇類型（可選）" /></SelectTrigger>
            <SelectContent>
              {types.map((t) => <SelectItem key={t.id} value={String(t.id)}>{t.typeName}</SelectItem>)}
            </SelectContent>
          </Select>
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            <Label htmlFor="featured">精選客戶（首頁展示）</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <Label htmlFor="active">生效中</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Link href="/admin/clients"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit">建立</Button>
        </div>
      </form>
    </div>
  );
}
