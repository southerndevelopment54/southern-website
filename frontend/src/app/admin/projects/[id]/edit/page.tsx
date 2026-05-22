"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import OrderSlider from "@/components/OrderSlider";
import { compressImage } from "@/lib/image";

interface SiteForm {
  name: string;
  nameEn: string;
  nameCn: string;
  imageKey: string;
  address: string;
  addressEn: string;
  addressCn: string;
  category: string;
  isFeatured: boolean;
  displayOrder: string;
  isActive: boolean;
}

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<SiteForm>({
    name: "",
    nameEn: "",
    nameCn: "",
    imageKey: "",
    address: "",
    addressEn: "",
    addressCn: "",
    category: "commercial",
    isFeatured: false,
    displayOrder: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/projects/${id}`).then((res) => {
      const s = res.data;
      setForm({
        name: s.name || "",
        nameEn: s.nameEn || "",
        nameCn: s.nameCn || "",
        imageKey: s.imageKey || "",
        address: s.address || "",
        addressEn: s.addressEn || "",
        addressCn: s.addressCn || "",
        category: s.category || "commercial",
        isFeatured: s.isFeatured ?? false,
        displayOrder: s.displayOrder != null ? String(s.displayOrder) : "",
        isActive: s.isActive != null ? s.isActive : true,
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
      formData.append("folder", "sites");
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
    if (!form.name || !form.category) {
      toast({ title: "錯誤", description: "請填寫所有必填欄位", variant: "destructive" });
      return;
    }
    try {
      await api.put(`/admin/projects/${id}`, {
        name: form.name,
        nameEn: form.nameEn || null,
        nameCn: form.nameCn || null,
        imageKey: form.imageKey || null,
        address: form.address || null,
        addressEn: form.addressEn || null,
        addressCn: form.addressCn || null,
        category: form.category,
        isFeatured: form.isFeatured,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : null,
        isActive: form.isActive,
      });
      toast({ title: "項目已更新" });
      router.push("/admin/projects");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({ title: "錯誤", description: e.response?.data?.message || "更新失敗", variant: "destructive" });
    }
  };

  if (loading) return <div className="text-center py-10">載入中...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/projects" className="text-sm text-primary">&larr; 返回</Link>
        <h1 className="text-2xl font-bold">編輯項目</h1>
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
          <Label>類別</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="commercial">商廈/商場</SelectItem>
              <SelectItem value="residential">住宅</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          <Label htmlFor="featured">精選項目</Label>
        </div>
        <div>
          <Label>地址（中文）</Label>
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <Label>地址（English）</Label>
          <Input value={form.addressEn} onChange={(e) => setForm({ ...form, addressEn: e.target.value })} />
        </div>
        <div>
          <Label>地址（简体中文）</Label>
          <Input value={form.addressCn} onChange={(e) => setForm({ ...form, addressCn: e.target.value })} />
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
          <Button type="submit">儲存</Button>
        </div>
      </form>
    </div>
  );
}
