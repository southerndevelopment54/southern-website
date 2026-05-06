"use client";

import { useEffect, useState } from "react";
import PublicLayout from "@/components/public/PublicLayout";
import PageBanner from "@/components/public/PageBanner";
import { api } from "@/lib/api";
import { Vacancy } from "@/types/vacancy";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, DollarSign, ArrowRight } from "lucide-react";

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [districts, setDistricts] = useState<{ id: number; districtName: string }[]>([]);
  const [guardTypes, setGuardTypes] = useState<{ id: number; typeName: string }[]>([]);
  const [districtId, setDistrictId] = useState<string>("all");
  const [guardTypeId, setGuardTypeId] = useState<string>("all");

  useEffect(() => {
    api.get("/vacancies/districts").then((res) => setDistricts(res.data));
    api.get("/vacancies/guard-types").then((res) => setGuardTypes(res.data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (districtId && districtId !== "all") params.append("districtId", districtId);
    if (guardTypeId && guardTypeId !== "all") params.append("guardTypeId", guardTypeId);
    api.get(`/vacancies?${params.toString()}`).then((res) => {
      setVacancies(res.data.content || res.data);
    });
  }, [districtId, guardTypeId]);

  return (
    <PublicLayout>
      <PageBanner title="職位空缺" subtitle="與我們一起尋找您的下一個事業機會" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select value={districtId} onValueChange={setDistrictId}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="按地區篩選" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有地區</SelectItem>
                {districts.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.districtName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={guardTypeId} onValueChange={setGuardTypeId}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="按職位類型篩選" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有類型</SelectItem>
                {guardTypes.map((g) => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    {g.typeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vacancies.map((v) => (
              <Link key={v.id} href={`/vacancies/${v.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                  {v.imageUrl ? (
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={v.imageUrl}
                        alt={v.guardType.typeName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center" style={{ backgroundColor: "#1a2447" }}>
                      <span className="text-white/50 text-sm">暫無圖片</span>
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg" style={{ color: "#1a2447" }}>{v.guardType.typeName}</h3>
                      {v.isFeatured && <Badge style={{ backgroundColor: "#51db3d" }}>精選</Badge>}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: "#51db3d" }} />
                        <span>{v.district.districtName} &middot; {v.locationDescription}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" style={{ color: "#51db3d" }} />
                        <span>${v.salaryMin?.toLocaleString()} - ${v.salaryMax?.toLocaleString()} / {v.salaryPeriod}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" style={{ color: "#51db3d" }} />
                        <span>開始日期：{v.startDate}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium" style={{ color: "#1a2447" }}>
                      查看詳情
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {vacancies.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500 text-lg">暫無職位空缺。</p>
                <p className="text-gray-400 text-sm mt-2">請稍後再查看新的機會。</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
