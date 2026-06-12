"use client";

import { Shield, Award, Users, Clock } from "lucide-react";
import Link from "next/link";
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
              {locale !== "en" ? "關於南方" : "About Southern"}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 leading-tight">
              {t.about.title}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
              <p>
                {locale !== "en"
                  ? "南方(警衛及管業)有限公司自1997年創立以來，一直為香港各界提供專業可靠的綜合保安服務。現有逾500名持牌保安人員，服務網絡遍及商業大廈、住宅屋苑、零售商場、工業設施、物流倉庫、學校、建築地盤及大型活動場地，涵蓋門禁管理、巡邏監察、活動保安及個人護衛等多元化服務。"
                  : "Established in 1997, Southern is a leading provider of professional security and property management solutions across Hong Kong. With over 500 licensed security professionals, we protect commercial buildings, residential estates, retail malls, industrial facilities, logistics warehouses, schools, construction sites, and major events — delivering integrated services from access control and patrol operations to event security and close protection."}
              </p>
              <p>
                {locale !== "en"
                  ? "我們的團隊均接受政府認可機構的專業培訓，並設有24小時中央監控中心實時監察各崗位運作。憑藉逾二十年的行業經驗，南方以專業態度、創新思維及客戶為本的服務理念，持續為香港企業及社區締造更安全、更值得信賴的環境。"
                  : "Our personnel undergo rigorous training at government-recognised institutions, supported by a 24/7 Central Monitoring Centre that oversees all operations in real time. Combining decades of expertise with innovative solutions and an unwavering client-focused philosophy, Southern continues to set the benchmark for security excellence in Hong Kong."}
              </p>
            </div>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-dark hover:bg-dark-gray text-white px-8 py-3.5 rounded font-semibold transition-colors duration-200"
            >
              {t.header.nav.contact}
            </Link>
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
