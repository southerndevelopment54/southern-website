"use client";

import { Shield, Award, Users, Clock } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function AboutSection() {
  const { t, locale } = useI18n();

  const stats = [
    { icon: Shield, value: "20+", label: t.about.stats.experience },
    { icon: Award, value: "1997", label: t.about.stats.established },
    { icon: Users, value: "500+", label: t.about.stats.personnel },
    { icon: Clock, value: "24/7", label: t.about.stats.service },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/images/security_guard_icc.png"
                alt={t.header.companyName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-lg -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/20 rounded-lg -z-10" />
          </div>

          {/* Right - Content */}
          <div>
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              {locale === "zh" ? "關於南方" : "About Southern"}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 leading-tight">
              {t.about.title}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
              <p>
                {locale === "zh"
                  ? "本公司於一九九七年成立迄今已逾二十載，所有管理階層均為資深保安從業員。現僱用約500名保安人員，為尊貴客戶在商業大廈、屋苑、學校、廠房、商場、物流倉庫、建築地盤及展覽盛事場地提供專業警衛服務。"
                  : "Southern was established in 1997 in Hong Kong, with its Headquarters at New Treasure Centre, Sanpokong, Kowloon. We specialize in professional security services including guarding, Gurkha guarding, key holding, mobile patrolling, close protection, body guard, and car pick-up & transit. At present, we have about 500 personnel posted at various locations including high-class residential buildings, commercial complexes, schools, factories, shopping malls, logistics warehouses, construction sites, and event venues."}
              </p>
              <p>
                {locale === "zh"
                  ? "本公司所聘用之保安人員均已接受政府認可機構之培訓，持有有效培訓證書及保安人員許可證，並設有24小時中央監控中心，由高級主管監察所有崗位運作。我們一直以最專業的服務、最合理的價格，成為客戶最信賴的長期合作夥伴。"
                  : "All security personnel employed receive stringent trainings from government-recognized institutions and hold valid training certificates and security permits. Our Control Room operates 24 hours daily with senior officers monitoring all posts. We are committed to being our clients' most trusted long-term partner through the most professional service at the most reasonable prices."}
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-dark hover:bg-dark-gray text-white px-8 py-3.5 rounded font-semibold transition-colors duration-200"
            >
              {t.header.nav.contact}
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-off-white rounded-lg"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-dark mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
