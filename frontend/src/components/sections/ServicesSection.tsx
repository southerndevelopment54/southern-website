"use client";

import { Building2, Home, PartyPopper, UserCheck, ShoppingBag, Factory, Car, Phone, Hotel } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

const icons = [Building2, Home, PartyPopper, UserCheck, ShoppingBag, Factory, Car, Phone, Hotel];
const images = [
  "/images/skyscarpper.png",
  "/images/residetial_building_hk.png",
  "/images/event.png",
  "/images/personal_body_guard.png",
  "/images/retails_store.png",
  "/images/warehouse.png",
  "/images/car_patrol1.png",
  "/images/security_report.png",
  "/images/hotel_renaissance.png",
];

export default function ServicesSection() {
  const { t } = useI18n();
  const services = t.services.items.map((item, index) => ({
    ...item,
    icon: icons[index],
    image: images[index],
  }));

  return (
    <section id="services" className="py-20 md:py-28 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
            {t.services.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            {t.services.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t.services.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group"
            >
              {/* Image */}
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-dark">{service.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
