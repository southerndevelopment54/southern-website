"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";


interface VacancyForm {
  title: string;
  guardTypeId: string;
  districtId: string;
  locationDescription: string;
  startDate: string;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: string;
  showSalary: boolean;
  employmentType: string;
  workingHours: string;
  requirements: string[];
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  isUrgent: boolean;
  expiresAt: string;
}

function getSalaryConfig(period: string) {
  switch (period) {
    case "hourly":
      return { max: 500, step: 5, defaultMin: 50, defaultMax: 80 };
    case "daily":
      return { max: 5000, step: 10, defaultMin: 500, defaultMax: 800 };
    case "yearly":
      return { max: 1500000, step: 10000, defaultMin: 180000, defaultMax: 300000 };
    case "monthly":
    default:
      return { max: 100000, step: 100, defaultMin: 15000, defaultMax: 25000 };
  }
}

function formatSalary(n: number) {
  return "$" + n.toLocaleString();
}

export default function NewVacancyPage() {
  const router = useRouter();
  const [districts, setDistricts] = useState<{ id: number; districtName: string }[]>([]);
  const [guardTypes, setGuardTypes] = useState<{ id: number; typeName: string }[]>([]);
  const [form, setForm] = useState<VacancyForm>({
    title: "",
    guardTypeId: "",
    districtId: "",
    locationDescription: "",
    startDate: "",
    salaryMin: 15000,
    salaryMax: 25000,
    salaryPeriod: "monthly",
    showSalary: true,
    employmentType: "full-time",
    workingHours: "",
    requirements: [""],
    description: "",
    isActive: true,
    isFeatured: false,
    isUrgent: false,
    expiresAt: "",
  });

  useEffect(() => {
    api.get("/vacancies/districts").then((res) => setDistricts(res.data));
    api.get("/vacancies/guard-types").then((res) => setGuardTypes(res.data));
  }, []);

  // Adjust salary range when period changes
  useEffect(() => {
    const cfg = getSalaryConfig(form.salaryPeriod);
    setForm((f) => ({
      ...f,
      salaryMin: Math.min(Math.max(f.salaryMin, 0), cfg.max),
      salaryMax: Math.min(Math.max(f.salaryMax, 0), cfg.max),
    }));
  }, [form.salaryPeriod]);

  const addRequirement = () => {
    setForm({ ...form, requirements: [...form.requirements, ""] });
  };

  const removeRequirement = (index: number) => {
    setForm({ ...form, requirements: form.requirements.filter((_, i) => i !== index) });
  };

  const updateRequirement = (index: number, value: string) => {
    const next = [...form.requirements];
    next[index] = value;
    setForm({ ...form, requirements: next });
  };

  const setSalaryMin = (v: number) => {
    setForm((f) => ({ ...f, salaryMin: v, salaryMax: Math.max(v, f.salaryMax) }));
  };
  const setSalaryMax = (v: number) => {
    setForm((f) => ({ ...f, salaryMax: v, salaryMin: Math.min(v, f.salaryMin) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Vacancy New] handleSubmit called", form);
    if (!form.title || !form.guardTypeId || !form.districtId || !form.startDate || !form.expiresAt) {
      console.log("[Vacancy New] validation failed: missing required fields");
      toast({ title: "錯誤", description: "請填寫所有必填欄位", variant: "destructive" });
      return;
    }
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Hong_Kong" });
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

    const requirementsArray = form.requirements.map((s) => s.trim()).filter((s) => s.length > 0);

    const payload = {
      title: form.title,
      guardTypeId: Number(form.guardTypeId),
      districtId: form.districtId === "0" ? null : Number(form.districtId),
      locationDescription: form.locationDescription,
      startDate: form.startDate,
      salaryMin: form.salaryMin || null,
      salaryMax: form.salaryMax || null,
      salaryPeriod: form.salaryPeriod,
      showSalary: form.showSalary,
      employmentType: form.employmentType,
      workingHours: form.workingHours,
      requirements: requirementsArray,
      description: form.description,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isUrgent: form.isUrgent,
      expiresAt: form.expiresAt,
    };
    console.log("[Vacancy New] submitting payload:", payload);

    try {
      const res = await api.post("/admin/vacancies", payload);
      console.log("[Vacancy New] success:", res.data);
      toast({ title: "職位空缺已建立" });
      router.push("/admin/vacancies");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      console.error("[Vacancy New] error:", err);
      toast({ title: "錯誤", description: e.response?.data?.message || "建立失敗", variant: "destructive" });
    }
  };

  const districtsWithOther = [...districts, { id: 0, districtName: "其他" }];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/vacancies" className="text-sm text-primary">&larr; 返回</Link>
        <h1 className="text-2xl font-bold">新增職位空缺</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        {/* 職位資料 */}
        <div className="border-b pb-4 mb-2">
          <h2 className="text-sm font-semibold text-slate-500 mb-3">職位資料</h2>
          <div className="space-y-3">
            <div>
              <Label>職位名稱 <span className="text-red-500">*</span></Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. 住宅保安員" required />
            </div>
            <div>
              <Label>保安類型 <span className="text-red-500">*</span></Label>
              <Select value={form.guardTypeId} onValueChange={(v) => setForm({ ...form, guardTypeId: v })}>
                <SelectTrigger><SelectValue placeholder="選擇類型" /></SelectTrigger>
                <SelectContent>
                  {guardTypes.map((g) => <SelectItem key={g.id} value={String(g.id)}>{g.typeName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>地區 <span className="text-red-500">*</span></Label>
              <Select value={form.districtId} onValueChange={(v) => setForm({ ...form, districtId: v, locationDescription: v === "0" ? form.locationDescription : "" })}>
                <SelectTrigger><SelectValue placeholder="選擇地區" /></SelectTrigger>
                <SelectContent>
                  {districtsWithOther.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.districtName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {form.districtId === "0" && (
              <div>
                <Label>地點描述</Label>
                <Input value={form.locationDescription} onChange={(e) => setForm({ ...form, locationDescription: e.target.value })} placeholder="請輸入具體地點" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>開始日期 <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className="pr-10" />
                </div>
              </div>
              <div>
                <Label>截止日期 <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required className="pr-10" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="showSalary" checked={form.showSalary} onChange={(e) => setForm({ ...form, showSalary: e.target.checked })} />
              <Label htmlFor="showSalary" className="text-sm">顯示薪金</Label>
            </div>
            <div className={`space-y-3 pt-1 ${form.showSalary ? "" : "opacity-50"}`}>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm">最低薪金</Label>
                  <span className="text-sm font-medium text-slate-700">{formatSalary(form.salaryMin)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={getSalaryConfig(form.salaryPeriod).max}
                  step={getSalaryConfig(form.salaryPeriod).step}
                  value={form.salaryMin}
                  onChange={(e) => setSalaryMin(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm">最高薪金</Label>
                  <span className="text-sm font-medium text-slate-700">{formatSalary(form.salaryMax)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={getSalaryConfig(form.salaryPeriod).max}
                  step={getSalaryConfig(form.salaryPeriod).step}
                  value={form.salaryMax}
                  onChange={(e) => setSalaryMax(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>薪金週期</Label>
                <Select value={form.salaryPeriod} onValueChange={(v) => setForm({ ...form, salaryPeriod: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">每月</SelectItem>
                    <SelectItem value="daily">每日</SelectItem>
                    <SelectItem value="hourly">每小時</SelectItem>
                    <SelectItem value="yearly">每年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>僱傭類型</Label>
                <Select value={form.employmentType} onValueChange={(v) => setForm({ ...form, employmentType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">全職</SelectItem>
                    <SelectItem value="part-time">兼職</SelectItem>
                    <SelectItem value="contract">合約</SelectItem>
                    <SelectItem value="temporary">臨時</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>工作時間</Label>
              <Textarea
                value={form.workingHours}
                onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                placeholder="例如：星期一至六：19:00至07:00 或 星期一至六：07:00至19:00"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="border-b pb-4 mb-2">
          <h2 className="text-sm font-semibold text-slate-500 mb-3">入職要求</h2>
          <div className="space-y-2">
            {form.requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={req}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  placeholder={`要求 ${index + 1}`}
                />
                {form.requirements.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" className="text-red-500 shrink-0" onClick={() => removeRequirement(index)}>
                    刪除
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
              + 新增要求
            </Button>
          </div>

          <div className="mt-4">
            <Label>職位描述</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 mb-3">設定</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                <Label htmlFor="active">生效中</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                <Label htmlFor="featured">精選職位</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="urgent" checked={form.isUrgent} onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })} />
                <Label htmlFor="urgent">急聘</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link href="/admin/vacancies"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit">建立</Button>
        </div>
      </form>

    </div>
  );
}
