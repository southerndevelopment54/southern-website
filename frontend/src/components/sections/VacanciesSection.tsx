"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, ChevronRight, ShieldCheck, Gift } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { api } from "@/lib/api";
import VacancyApplyDialog from "@/components/VacancyApplyDialog";
import VacancyInquiryDialog from "@/components/VacancyInquiryDialog";

interface Vacancy {
  id: number;
  title: string;
  salaryDisplay: string;
  showSalary: boolean;
  jobType: string;
  workingHours: string;
  district: { districtName: string } | null;
  locationDescription: string;
  description: string;
  welfare: string[];
  requirements: string[];
  isUrgent: boolean;
  isFeatured: boolean;
}

export default function VacanciesSection() {
  const { t } = useI18n();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyVacancy, setApplyVacancy] = useState<Vacancy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

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
    <section id="vacancies" className="py-20 md:py-28 bg-white">
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
                className={`relative rounded-2xl border bg-white p-6 md:p-8 transition-all duration-200 hover:shadow-lg flex flex-col h-full ${
                  job.isUrgent
                    ? "border-primary/40"
                    : "border-gray-200 hover:border-primary/30"
                }`}
              >
                {/* Status badges */}
                {job.isUrgent && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                      {t.vacancies.urgent}
                    </span>
                  </div>
                )}

                {/* Title & Salary */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-dark leading-tight">
                    {job.title}
                  </h3>
                  {job.showSalary && (
                    <div className="shrink-0 inline-flex items-center text-primary text-base font-bold whitespace-nowrap">
                      {job.salaryDisplay || "面議"}
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-base text-gray-600">
                  <div className="inline-flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{job.jobType || "—"}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-primary text-white text-base font-semibold">
                    <MapPin className="w-4 h-4" />
                    <span>{getLocation(job)}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-grow flex flex-col sm:flex-row gap-6 items-start">
                  {/* Left column */}
                  <div className="flex-1 space-y-6">
                    {job.description && (
                      <div>
                        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          {t.vacancies.jobDescription}
                        </div>
                        <div className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
                          {job.description}
                        </div>
                      </div>
                    )}

                    {job.workingHours && (
                      <div>
                        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          {t.vacancies.workingHours}
                        </div>
                        <div className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
                          {job.workingHours}
                        </div>
                      </div>
                    )}

                    {job.requirements && job.requirements.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          {t.vacancies.requirements}
                        </div>
                        <ul className="space-y-2">
                          {job.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-base text-gray-600">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right column - Welfare */}
                  {job.welfare?.length > 0 && (
                    <div className="shrink-0 w-fit bg-primary/10 border border-primary/20 rounded-xl p-4 md:p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                        <Gift className="w-4 h-4" />
                        {t.vacancies.welfare}
                      </div>
                      <ul className="space-y-2">
                        {job.welfare.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-base text-gray-700">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setApplyVacancy(job);
                      setDialogOpen(true);
                    }}
                    className={`inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                      job.isUrgent
                        ? "bg-primary hover:bg-primary-light text-white"
                        : "bg-dark hover:bg-dark-gray text-white"
                    }`}
                  >
                    {t.vacancies.applyNow}
                    <ChevronRight className="w-5 h-5" />
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
          <button
            type="button"
            onClick={() => setInquiryOpen(true)}
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            {t.vacancies.contactUs}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <VacancyApplyDialog
        vacancy={applyVacancy}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        translations={t.vacancies.applyForm}
      />
      <VacancyInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        translations={t.vacancies.contactUsInquiry}
      />
    </section>
  );
}
