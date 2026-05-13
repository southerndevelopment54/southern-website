"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactDetails = [
  {
    icon: Phone,
    label: "電話",
    value: "+852 2762 8128",
    href: "tel:+85227628128",
  },
  {
    icon: Mail,
    label: "電郵",
    value: "info@southern-security.hk",
    href: "mailto:info@southern-security.hk",
  },
  {
    icon: MapPin,
    label: "地址",
    value: "新蒲崗五芳街10號新寶中心19樓1907室",
    href: "#",
  },
  {
    icon: Clock,
    label: "辦公時間",
    value: "星期一至五 09:00 - 18:00",
    href: "#",
  },
];

export default function GetInTouch() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/images/phone_holding.png"
                alt="聯絡我們"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right - Contact Details */}
          <div>
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              聯絡我們
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              立即聯絡我們
            </h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              無論您有任何保安服務需求或疑問，我們的專業團隊隨時為您提供協助。歡迎透過以下方式與我們聯絡。
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
