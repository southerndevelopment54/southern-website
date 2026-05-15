"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import OrderSlider from "@/components/OrderSlider";

interface SiteForm {
  name: string;
  imageKey: string;
  address: string;
  category: string;
  tier: string;
  displayOrder: string;
  isActive: boolean;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState<SiteForm>({
    name: "",
    imageKey: "",
    address: "",
    category: "key",
    tier: "1",
    displayOrder: "1",
    isActive: true,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "sites");
    try {
      const res = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, imageKey: res.data.imageKey });
      toast({ title: "圖片上傳成功" });
    } catch {
      toast({ title: "圖片上傳失敗", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.tier) {
      toast({ title: "錯誤", description: "請填寫所有必填欄位", variant: "destructive" });
      return;
    }
    try {
      await api.post("/admin/projects", {
        name: form.name,
        imageKey: form.imageKey || null,
        address: form.address || null,
        category: form.category,
        tier: Number(form.tier),
        displayOrder: form.displayOrder ? Number(form.displayOrder) : null,
        isActive: form.isActive,
      });
      toast({ title: "項目已建立" });
      router.push("/admin/projects");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({ title: "錯誤", description: e.response?.data?.message || "建立失敗", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/projects" className="text-sm text-primary">&larr; 返回</Link>
        <h1 className="text-2xl font-bold">新增項目</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <Label>名稱</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <Label>類別</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="key">重點項目</SelectItem>
              <SelectItem value="commercial">商場大廈</SelectItem>
              <SelectItem value="residential">住宅</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>層級</Label>
          <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>地址</Label>
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <Label>項目圖片</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.imageKey && <p className="text-sm text-muted-foreground mt-1">已上傳: {form.imageKey}</p>}
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
          <Link href="/admin/projects"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit">建立</Button>
        </div>
      </form>
    </div>
  );
}
