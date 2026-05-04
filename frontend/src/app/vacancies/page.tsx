"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { api } from "@/lib/api";
import { Vacancy } from "@/types/vacancy";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold mb-8">Job Vacancies</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={districtId} onValueChange={setDistrictId}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Filter by district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.districtName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={guardTypeId} onValueChange={setGuardTypeId}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Filter by guard type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {guardTypes.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.typeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {vacancies.map((v) => (
            <Card key={v.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{v.guardType.typeName}</CardTitle>
                  {v.isFeatured && <Badge>Featured</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {v.district.districtName} &middot; {v.locationDescription}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  Salary: ${v.salaryMin?.toLocaleString()} - ${v.salaryMax?.toLocaleString()} / {v.salaryPeriod === 'monthly' ? 'monthly' : v.salaryPeriod}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">{v.description}</p>
                <Link href={`/vacancies/${v.id}`} className="text-primary text-sm font-medium mt-4 inline-block">
                  View Details & Apply
                </Link>
              </CardContent>
            </Card>
          ))}
          {vacancies.length === 0 && (
            <p className="text-muted-foreground col-span-2 text-center py-10">No vacancies available.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
