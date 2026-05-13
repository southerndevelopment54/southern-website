"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function GetInTouch() {
  const { t } = useI18n();

  const contactDetails = [
    {
      icon: Phone,
      label: t.contact.phone,
      value: "+852 2762 8128",
      href: "tel:+85227628128",
    },
    {
      icon: Mail,
      label: t.contact.email,
      value: "info@southern-security.hk",
      href: "mailto:info@southern-security.hk",
    },
    {
      icon: MapPin,
      label: t.contact.address,
      value: "新蒲崗五芳街10號新寶中心19樓1907室",
      href: "#",
    },
    {
      icon: Clock,
      label: t.contact.hours,
      value: t.contact.officeHours,
      href: "#",
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/images/phone_holding.png"
                alt={t.contact.badge}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right - Contact Details */}
          <div>
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              {t.contact.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              {t.contact.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              {t.contact.description}
            </p>

            <div className="space-y-6">
              {contactDetails.map((detail, index) => (
                <a
                  key={index}
                  href={detail.href}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white text-primary transition-colors duration-200">
                    <detail.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">{detail.label}</div>
                    <div className="text-dark font-semibold group-hover:text-primary transition-colors">
                      <span>{detail.value}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
