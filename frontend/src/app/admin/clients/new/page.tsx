"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import OrderSlider from "@/components/OrderSlider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { compressImage } from "@/lib/image";

interface ClientForm {
  name: string;
  nameEn: string;
  logoKey: string;
  isFeatured: boolean;
  displayOrder: string;
  isActive: boolean;
}

export default function NewClientPage() {
  const router = useRouter();
  const [featuredCount, setFeaturedCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [form, setForm] = useState<ClientForm>({
    name: "",
    nameEn: "",
    logoKey: "",
    isFeatured: false,
    displayOrder: "1",
    isActive: true,
  });

  useEffect(() => {
    api.get("/admin/clients").then((res) => {
      const list = res.data || [];
      setFeaturedCount(list.filter((c: { isFeatured: boolean }) => c.isFeatured).length);
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("folder", "clients");
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
      await api.post("/admin/clients", {
        name: form.name,
        nameEn: form.nameEn || null,
        logoKey: form.logoKey || null,
        isFeatured: form.isFeatured,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : null,
        isActive: form.isActive,
      });
      toast({ title: "客戶已建立" });
      router.push("/admin/clients");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast({ title: "錯誤", description: e.response?.data?.message || "建立失敗", variant: "destructive" });
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
          <Label>名稱（中文）</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <Label>名稱（English）</Label>
          <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
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
            <input
              type="checkbox"
              id="featured"
              checked={form.isFeatured}
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked && featuredCount >= 8) {
                  setShowWarning(true);
                } else {
                  setForm({ ...form, isFeatured: checked });
                }
              }}
            />
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

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>精選客戶數量警告</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            目前已有 <strong>{featuredCount}</strong> 個精選客戶，已達到上限（最多 8 個）。請先取消其他客戶的精選狀態，再將此客戶設為精選。
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowWarning(false)}>
              了解
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
