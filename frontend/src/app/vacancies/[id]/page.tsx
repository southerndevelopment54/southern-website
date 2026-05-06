"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PublicLayout from "@/components/public/PublicLayout";
import PageBanner from "@/components/public/PageBanner";
import { api } from "@/lib/api";
import { Vacancy } from "@/types/vacancy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { MapPin, Calendar, DollarSign, Clock, Phone, Mail, ArrowLeft } from "lucide-react";

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
      toast({ title: "提交失敗", description: "請稍後再試。", variant: "destructive" });
    }
  };

  if (!vacancy) {
    return (
      <PublicLayout>
        <div className="flex-grow flex items-center justify-center py-20">
          <p className="text-gray-500 text-lg">載入中...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <PageBanner title={vacancy.guardType.typeName} subtitle={`${vacancy.district.districtName} - ${vacancy.locationDescription}`} />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Link href="/vacancies" className="inline-flex items-center text-sm font-medium mb-8 hover:underline" style={{ color: "#1a2447" }}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回職位列表
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="lg:col-span-2">
              {vacancy.imageUrl && (
                <div className="rounded-lg overflow-hidden mb-8">
                  <img
                    src={vacancy.imageUrl}
                    alt={vacancy.guardType.typeName}
                    className="w-full h-80 object-cover"
                  />
                </div>
              )}

              <h2 className="text-2xl font-bold mb-6" style={{ color: "#1a2447" }}>職位詳情</h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100">
                  <Calendar className="h-5 w-5" style={{ color: "#51db3d" }} />
                  <div>
                    <p className="text-xs text-gray-500">開始日期</p>
                    <p className="font-medium" style={{ color: "#1a2447" }}>{vacancy.startDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100">
                  <DollarSign className="h-5 w-5" style={{ color: "#51db3d" }} />
                  <div>
                    <p className="text-xs text-gray-500">薪金</p>
                    <p className="font-medium" style={{ color: "#1a2447" }}>
                      ${vacancy.salaryMin?.toLocaleString()} - ${vacancy.salaryMax?.toLocaleString()} / {vacancy.salaryPeriod}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100">
                  <Clock className="h-5 w-5" style={{ color: "#51db3d" }} />
                  <div>
                    <p className="text-xs text-gray-500">僱傭類型</p>
                    <p className="font-medium" style={{ color: "#1a2447" }}>{vacancy.employmentType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100">
                  <MapPin className="h-5 w-5" style={{ color: "#51db3d" }} />
                  <div>
                    <p className="text-xs text-gray-500">工作地點</p>
                    <p className="font-medium" style={{ color: "#1a2447" }}>{vacancy.district.districtName}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#1a2447" }}>職位描述</h3>
                  <p className="text-gray-600 leading-relaxed">{vacancy.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#1a2447" }}>入職要求</h3>
                  <p className="text-gray-600 leading-relaxed">{vacancy.requirements}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#1a2447" }}>工作時間</h3>
                  <p className="text-gray-600 leading-relaxed">{vacancy.workingHours}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#1a2447" }}>聯絡方式</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" style={{ color: "#51db3d" }} />
                      <span>{vacancy.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" style={{ color: "#51db3d" }} />
                      <span>{vacancy.contactEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div>
              <div className="p-6 rounded-lg border border-gray-100 shadow-sm sticky top-32">
                <h3 className="text-xl font-bold mb-6" style={{ color: "#1a2447" }}>立即申請</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  <Button
                    type="submit"
                    className="w-full text-white font-semibold hover:opacity-90"
                    style={{ backgroundColor: "#51db3d" }}
                  >
                    提交申請
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
