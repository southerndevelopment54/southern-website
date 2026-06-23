"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { api } from "@/lib/api";

const serviceImages = [
  "/images/commercial_guard_description.png",
  "/images/security_guard_in_residential_building.png",
  "/images/event_indoor.png",
  "/images/hotel_renaissance.png",
  "/images/airport_warehouse.png",
  "/images/personal_security_guard.png",
  "/images/CNT_services.png",
  "/images/ssl_fleet3.png",
  "/images/security_report_with_logo.png",
];

interface SecuritySystemClient {
  id: number;
  name: string;
  nameEn?: string;
  nameCn?: string;
  logoKey: string;
  logoUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function ServicesTabs() {
  const { t, locale } = useI18n();
  const services = t.services.items;
  const [activeIndex, setActiveIndex] = useState(0);
  const [securityClients, setSecurityClients] = useState<SecuritySystemClient[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const index = parseInt(hash, 10);
      if (!isNaN(index) && index >= 0 && index < services.length) {
        setActiveIndex(index);
        setTimeout(() => {
          const section = document.getElementById("service-tabs");
          if (section) {
            section.scrollIntoView({ behavior: "instant", block: "start" });
          }
        }, 0);
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [services.length]);

  useEffect(() => {
    if (activeIndex === 6) {
      api.get("/security-system-clients")
        .then((res) => setSecurityClients(res.data))
        .catch(() => setSecurityClients([]));
    }
  }, [activeIndex]);

  return (
    <section id="service-tabs" className="pt-36 md:pt-36 pb-20 bg-off-white scroll-mt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
            {t.services.badge}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            {t.services.title}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {t.services.description}
          </p>
        </div>

        {/* Tabs Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tab List — Left */}
          <div className="lg:w-[28%]">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {services.map((service, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left px-5 py-4 text-sm font-medium transition-all duration-200 border-b border-gray-100 last:border-0 ${
                    activeIndex === index
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content — Right (no card styling) */}
          <div className="lg:w-[72%]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Description */}
              <div className="md:w-[70%]">
                <h2 className="text-2xl font-bold text-dark mb-4">
                  {services[activeIndex].title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
                  {(services[activeIndex] as unknown as { detail: string }).detail}
                </p>
                {[0, 1, 2].includes(activeIndex) && (
                  <a
                    href={
                      activeIndex === 0
                        ? `/${locale}/clients?tab=sites&filter=commercial`
                        : activeIndex === 1
                        ? `/${locale}/clients?tab=sites&filter=residential`
                        : `/${locale}/clients?tab=sites&filter=other&subFilter=large_event`
                    }
                    className="inline-flex items-center gap-2 mt-6 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:gap-3"
                  >
                    {t.services.relatedProjects}
                    <ChevronRight size={18} />
                  </a>
                )}
              </div>
              {/* Image */}
              <div className="md:w-[30%]">
                <img
                  src={serviceImages[activeIndex]}
                  alt={services[activeIndex].title}
                  className="w-full rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Reference Experience — only for Security System Services */}
            {activeIndex === 6 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-dark mb-6">
                  {t.services.referenceExperience}
                </h3>
                {securityClients.length > 0 ? (
                  <div className="flex flex-wrap justify-start items-center gap-3 md:gap-4">
                    {[...securityClients]
                      .map((client) => ({
                        ...client,
                        displayName:
                          locale === "en" && client.nameEn
                            ? client.nameEn
                            : locale === "cn" && client.nameCn
                            ? client.nameCn
                            : client.name,
                      }))
                      .sort((a, b) =>
                        a.displayName.localeCompare(b.displayName, locale === "en" ? "en" : "zh-HK")
                      )
                      .map((client) => (
                        <div
                          key={client.id}
                          title={client.displayName}
                          className="inline-flex items-center justify-center px-5 py-2.5 md:px-7 md:py-3 rounded-full bg-white border border-gray-200 text-sm md:text-base font-medium text-dark text-center leading-snug shadow-sm hover:bg-primary hover:border-primary hover:text-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none max-w-[260px] md:max-w-[340px] break-words"
                        >
                          {client.displayName}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-400 text-base">暫無客戶 / No clients yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
