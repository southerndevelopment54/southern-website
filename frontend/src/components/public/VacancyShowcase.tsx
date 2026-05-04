"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Vacancy } from "@/types/vacancy";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

export default function VacancyShowcase() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/vacancies")
      .then((res) => {
        const items = res.data.content || res.data;
        setVacancies((items as Vacancy[]).slice(0, 6));
      })
      .catch(() => setVacancies([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (vacancies.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Latest Vacancies</h2>
            <p className="text-muted-foreground">Explore our current job openings.</p>
          </div>
          <Link href="/vacancies" className="text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((v) => (
            <Link key={v.id} href={`/vacancies/${v.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                {v.imageUrl ? (
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={v.imageUrl}
                      alt={v.guardType.typeName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-full bg-slate-200 flex items-center justify-center">
                    <span className="text-slate-400 text-sm">No image</span>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{v.guardType.typeName}</h3>
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {v.district.districtName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {v.startDate}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{v.locationDescription}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
