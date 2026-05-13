"use client";

import { Building2, Home, PartyPopper, UserCheck, ShoppingBag, Factory } from "lucide-react";

const services = [
  {
    icon: Building2,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    title: "商業大廈保安",
    description: "為寫字樓、商業中心提供門禁管理、巡邏監察及訪客登記等全面保安服務，確保商業環境安全有序。",
  },
  {
    icon: Home,
    image: "/images/public_housing.png",
    title: "住宅保安服務",
    description: "為私人屋苑、豪宅提供住戶出入管理、訪客控制、停車場管理及緊急事故應變等專業保安服務。",
  },
  {
    icon: PartyPopper,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
    title: "活動保安管理",
    description: "為大型活動、展覽、演唱會提供人流控制、場地巡邏及緊急疏散等專業活動保安策劃及執行。",
  },
  {
    icon: UserCheck,
    image: "/images/personal_body_guard.png",
    title: "個人護衛服務",
    description: "為企業高管、名人及有特殊安全需要的個人提供專業貼身護衛，確保人身安全。",
  },
  {
    icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    title: "零售店舖保安",
    description: "為商場、零售店舖提供防盜監察、顧客服務及緊急應變，保障商戶財產及顧客安全。",
  },
  {
    icon: Factory,
    image: "/images/industrial_site_guard1.png",
    title: "工業設施保安",
    description: "為工廠、倉庫及物流設施提供出入管制、貨物監察及消防安全巡查等專業保安服務。",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
            服務範圍
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            全面保安解決方案
          </h2>
          <p className="text-gray-600 leading-relaxed">
            我們提供多元化的專業保安服務，滿足不同客戶的獨特需求，為您的財產及人員提供全方位保護。
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
