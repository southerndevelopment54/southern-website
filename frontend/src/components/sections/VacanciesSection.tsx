"use client";

import { MapPin, Clock, DollarSign, ChevronRight, ShieldCheck } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function VacanciesSection() {
  const { t } = useI18n();
  const vacancies = t.vacancies.jobs.map((job, index) => ({
    ...job,
    id: index + 1,
    highlight: index === 0,
  }));

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

        {/* Vacancy Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {vacancies.map((job) => (
            <div
              key={job.id}
              className={`relative rounded-xl border p-6 md:p-8 transition-all duration-200 hover:shadow-lg ${
                job.highlight
                  ? "border-primary bg-primary/5"
                  : "border-gray-100 bg-off-white hover:border-primary/30"
              }`}
            >
              {job.highlight && (
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
                    {job.salary}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 mb-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </div>
                </div>

                {/* Requirements */}
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

                {/* Button */}
                <a
                  href="#contact"
                  className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    job.highlight
                      ? "bg-primary hover:bg-primary-light text-white"
                      : "bg-dark hover:bg-dark-gray text-white"
                  }`}
                >
                  {t.vacancies.applyNow}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            {t.vacancies.noSuitable}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            {t.vacancies.contactUs}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
