"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

interface VacancyForm {
  guardTypeId: string;
  districtId: string;
  locationDescription: string;
  startDate: string;
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: string;
  employmentType: string;
  workingHours: string;
  requirements: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  isFeatured: boolean;
  expiresAt: string;
  imageKey: string;
}

export default function EditVacancyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [districts, setDistricts] = useState<{ id: number; districtName: string }[]>([]);
  const [guardTypes, setGuardTypes] = useState<{ id: number; typeName: string }[]>([]);
  const [form, setForm] = useState<VacancyForm>({
    guardTypeId: "",
    districtId: "",
    locationDescription: "",
    startDate: "",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "monthly",
    employmentType: "full-time",
    workingHours: "",
    requirements: "",
    description: "",
    contactPhone: "",
    contactEmail: "",
    isFeatured: false,
    expiresAt: "",
    imageKey: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/vacancies/districts").then((res) => setDistricts(res.data));
    api.get("/vacancies/guard-types").then((res) => setGuardTypes(res.data));
    api.get(`/vacancies/${id}`).then((res) => {
      const v = res.data;
      setForm({
        guardTypeId: String(v.guardType.id),
        districtId: String(v.district.id),
        locationDescription: v.locationDescription || "",
        startDate: v.startDate || "",
        salaryMin: v.salaryMin || "",
        salaryMax: v.salaryMax || "",
        salaryPeriod: v.salaryPeriod || "monthly",
        employmentType: v.employmentType || "full-time",
        workingHours: v.workingHours || "",
        requirements: v.requirements || "",
        description: v.description || "",
        contactPhone: v.contactPhone || "",
        contactEmail: v.contactEmail || "",
        isFeatured: v.isFeatured || false,
        expiresAt: v.expiresAt || "",
        imageKey: v.imageKey || "",
      });
      setLoading(false);
    });
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
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
    if (!form.guardTypeId || !form.districtId || !form.locationDescription || !form.startDate || !form.salaryMin || !form.salaryMax || !form.workingHours || !form.requirements || !form.contactPhone || !form.contactEmail || !form.expiresAt) {
      toast({ title: "錯誤", description: "請填寫所有必填欄位（職位描述除外）", variant: "destructive" });
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (form.startDate <= today) {
      toast({ title: "錯誤", description: "開始日期必須晚於今天", variant: "destructive" });
      return;
    }
    if (form.expiresAt <= today) {
      toast({ title: "錯誤", description: "截止日期必須晚於今天", variant: "destructive" });
      return;
    }
    if (form.expiresAt < form.startDate) {
      toast({ title: "錯誤", description: "截止日期必須等於或晚於開始日期", variant: "destructive" });
      return;
    }
    try {
      await api.put(`/admin/vacancies/${id}`, {
        ...form,
        guardTypeId: Number(form.guardTypeId),
        districtId: Number(form.districtId),
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
      });
      toast({ title: "職位空缺已更新" });
      router.push("/admin/vacancies");
    } catch {
      toast({ title: "錯誤", description: "更新失敗", variant: "destructive" });
    }
  };

  if (loading) return <div className="text-center py-10">載入中...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/vacancies" className="text-sm text-primary">&larr; 返回</Link>
        <h1 className="text-2xl font-bold">編輯職位空缺</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <Label>保安類型</Label>
          <Select value={form.guardTypeId} onValueChange={(v) => setForm({ ...form, guardTypeId: v })}>
            <SelectTrigger><SelectValue placeholder="選擇類型" /></SelectTrigger>
            <SelectContent>
              {guardTypes.map((g) => <SelectItem key={g.id} value={String(g.id)}>{g.typeName}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>地區</Label>
          <Select value={form.districtId} onValueChange={(v) => setForm({ ...form, districtId: v })}>
            <SelectTrigger><SelectValue placeholder="選擇地區" /></SelectTrigger>
            <SelectContent>
              {districts.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.districtName}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>地點描述</Label>
          <Input value={form.locationDescription} onChange={(e) => setForm({ ...form, locationDescription: e.target.value })} required />
        </div>
        <div>
          <Label>開始日期</Label>
          <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>最低薪金</Label>
            <Input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} required />
          </div>
          <div>
            <Label>最高薪金</Label>
            <Input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} required />
          </div>
        </div>
        <div>
          <Label>工作時間</Label>
          <Input value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} required />
        </div>
        <div>
          <Label>入職要求</Label>
          <Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} required />
        </div>
        <div>
          <Label>職位描述</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <Label>聯絡電話</Label>
          <Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} required />
        </div>
        <div>
          <Label>聯絡電郵</Label>
          <Input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} required />
        </div>
        <div>
          <Label>截止日期</Label>
          <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required />
        </div>
        <div>
          <Label>職位圖片</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.imageKey && <p className="text-sm text-muted-foreground mt-1">已上傳: {form.imageKey}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          <Label htmlFor="featured">精選職位</Label>
        </div>
        <div className="flex justify-end gap-2">
          <Link href="/admin/vacancies"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit">儲存</Button>
        </div>
      </form>
    </div>
  );
}
