"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function WhyChooseUs() {
  const { t, locale } = useI18n();

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image Banner */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/images/professional_serving.png"
                alt={t.header.companyName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Green accent */}
            <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-primary/30 rounded-lg -z-10" />
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              {t.whyChooseUs.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 leading-tight">
              {t.whyChooseUs.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              {t.whyChooseUs.description}
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-8">
              {t.whyChooseUs.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded font-semibold transition-colors duration-200"
            >
              {t.header.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
