"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/components/I18nProvider";

const serviceImages = [
  "/images/commercial_guard_description.png",
  "/images/security_guard_in_residential_building.png",
  "/images/event_indoor.png",
  "/images/hotel_renaissance.png",
  "/images/airport_warehouse.png",
  "/images/personal_security_guard.png",
  "/images/CNT_alert_image.png",
  "/images/ssl_fleet.png",
  "/images/security_report.png",
];

export default function ServicesTabs() {
  const { t } = useI18n();
  const services = t.services.items;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const index = parseInt(hash, 10);
    if (!isNaN(index) && index >= 0 && index < services.length) {
      setActiveIndex(index);
    }
  }, [services.length]);

  return (
    <section className="pt-28 md:pt-36 pb-20 bg-off-white">
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
          <div className="lg:w-1/3">
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
          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Description */}
              <div className="md:w-3/5">
                <h2 className="text-2xl font-bold text-dark mb-4">
                  {services[activeIndex].title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
                  {(services[activeIndex] as unknown as { detail: string }).detail}
                </p>
              </div>
              {/* Image */}
              <div className="md:w-2/5">
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg aspect-[4/3]"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
