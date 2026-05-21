"use client";

import { Briefcase, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function CareersSection() {
  const { locale, t } = useI18n();

  return (
    <section id="careers" className="py-20 md:py-28 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left - Content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-6">
                <Briefcase className="w-4 h-4" />
                {t.careers.badge}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t.careers.title}
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                {t.careers.description}
              </p>

              {/* Benefits */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {t.careers.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("vacancies");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded font-semibold transition-colors duration-200 w-fit"
              >
                {t.careers.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right - Image */}
            <div className="hidden lg:block relative">
              <img
                src="/images/guard_chatting_fixed.png"
                alt={t.careers.badge}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
