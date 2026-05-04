"use client";

import {
  Building2,
  Home,
  GraduationCap,
  Factory,
  ShoppingBag,
  Warehouse,
  HardHat,
} from "lucide-react";

const services = [
  { icon: Building2, label: "商業大廈" },
  { icon: Home, label: "屋苑" },
  { icon: GraduationCap, label: "學校" },
  { icon: Factory, label: "廠房" },
  { icon: ShoppingBag, label: "商場" },
  { icon: Warehouse, label: "物流倉庫" },
  { icon: HardHat, label: "建築地盤" },
];

export default function ServicesSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-purple mb-3">
            服務範圍
          </h2>
          <div className="w-16 h-1 bg-green mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.label}
                className="group flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 hover:border-purple/20 hover:shadow-lg hover:shadow-purple/5 transition-all duration-300 bg-white"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple/5 text-purple mb-4 group-hover:bg-purple group-hover:text-white transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {service.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
