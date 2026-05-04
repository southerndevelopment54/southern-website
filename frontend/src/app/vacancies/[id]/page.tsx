"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { api } from "@/lib/api";
import { Vacancy } from "@/types/vacancy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function VacancyDetailPage() {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    api.get(`/vacancies/${id}`).then((res) => setVacancy(res.data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/submissions", {
        vacancyId: Number(id),
        ...form,
      });
      toast({ title: "申請已成功提交！" });
      setForm({ firstName: "", lastName: "", phoneNumber: "", email: "", message: "" });
    } catch {
      toast({ title: "提交失敗", description: "請再試一次。", variant: "destructive" });
    }
  };

  if (!vacancy) return <div className="text-center py-20">載入中...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
        <Link href="/vacancies" className="text-primary text-sm mb-4 inline-block">
          &larr; 返回職位空缺
        </Link>
        <h1 className="text-3xl font-bold mb-2">{vacancy.guardType.typeName}</h1>
        <p className="text-muted-foreground mb-6">
          {vacancy.district.districtName} &middot; {vacancy.locationDescription}
        </p>

        <Card className="mb-8">
          <CardContent className="p-6 space-y-2">
            <p><strong>開始日期:</strong> {vacancy.startDate}</p>
            <p><strong>薪金:</strong> ${vacancy.salaryMin?.toLocaleString()} - ${vacancy.salaryMax?.toLocaleString()} / {vacancy.salaryPeriod === 'monthly' ? '每月' : vacancy.salaryPeriod}</p>
            <p><strong>僱傭類型:</strong> {vacancy.employmentType === 'full-time' ? '全職' : vacancy.employmentType}</p>
            <p><strong>工作時間:</strong> {vacancy.workingHours}</p>
            <p><strong>入職要求:</strong> {vacancy.requirements}</p>
            <p><strong>職位描述:</strong> {vacancy.description}</p>
            <p><strong>聯絡:</strong> {vacancy.contactPhone} / {vacancy.contactEmail}</p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">申請此職位</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">名字</Label>
              <Input id="firstName" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lastName">姓氏</Label>
              <Input id="lastName" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">電話號碼</Label>
            <Input id="phone" required value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="email">電郵</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="message">訊息</Label>
            <Textarea id="message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <Button type="submit">提交申請</Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
