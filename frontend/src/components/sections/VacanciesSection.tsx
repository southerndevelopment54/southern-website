"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, DollarSign, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import { api } from "@/lib/api";
import VacancyApplyDialog from "@/components/VacancyApplyDialog";

interface Vacancy {
  id: number;
  title: string;
  salaryDisplay: string;
  jobType: string;
  district: { districtName: string } | null;
  locationDescription: string;
  requirements: string[];
  isUrgent: boolean;
  isFeatured: boolean;
}

export default function VacanciesSection() {
  const { t, locale } = useI18n();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyVacancy, setApplyVacancy] = useState<Vacancy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    api
      .get("/vacancies?size=100")
      .then((res) => {
        const list: Vacancy[] = res.data.content || [];
        // Sort: featured first, then urgent, then by id desc
        list.sort((a, b) => {
          if (a.isFeatured !== b.isFeatured) return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
          if (a.isUrgent !== b.isUrgent) return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
          return b.id - a.id;
        });
        setVacancies(list);
      })
      .catch(() => setVacancies([]))
      .finally(() => setLoading(false));
  }, []);

  const getLocation = (v: Vacancy) => {
    if (v.district) return v.district.districtName;
    if (v.locationDescription) return v.locationDescription;
    return "—";
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
            <ShieldCheck className="w-4 h-4" />
            {t.vacancies.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            {t.vacancies.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t.vacancies.description}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-gray-400">載入中...</div>
        )}

        {/* Vacancy Cards */}
        {!loading && vacancies.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {vacancies.map((job) => (
              <div
                key={job.id}
                className={`relative rounded-xl border p-6 md:p-8 transition-all duration-200 hover:shadow-lg ${
                  job.isUrgent
                    ? "border-primary bg-primary/5"
                    : "border-gray-100 bg-off-white hover:border-primary/30"
                }`}
              >
                {job.isUrgent && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t.vacancies.urgent}
                    </span>
                  </div>
                )}

                <div className="flex flex-col h-full">
                  {/* Title & Salary */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-xl font-bold text-dark">{job.title}</h3>
                    <div className="flex items-center gap-1 text-primary font-bold text-sm whitespace-nowrap">
                      <DollarSign className="w-4 h-4" />
                      {job.salaryDisplay || "面議"}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 mb-5 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {getLocation(job)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {job.jobType || "—"}
                    </div>
                  </div>

                  {/* Requirements */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-6 flex-grow">
                      <div className="text-sm font-semibold text-dark mb-2">{t.vacancies.requirements}</div>
                      <ul className="space-y-1.5">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Button */}
                  <button
                    onClick={() => {
                      setApplyVacancy(job);
                      setDialogOpen(true);
                    }}
                    className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      job.isUrgent
                        ? "bg-primary hover:bg-primary-light text-white"
                        : "bg-dark hover:bg-dark-gray text-white"
                    }`}
                  >
                    {t.vacancies.applyNow}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && vacancies.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            暫無職位空缺
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            {t.vacancies.noSuitable}
          </p>
          <Link
            href={`/${locale}/contact#contact`}
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            {t.vacancies.contactUs}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <VacancyApplyDialog
        vacancy={applyVacancy}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        translations={t.vacancies.applyForm}
      />
    </section>
  );
}
