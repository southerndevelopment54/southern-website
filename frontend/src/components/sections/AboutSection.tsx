"use client";

import { Shield, Award, Users, Clock } from "lucide-react";

const stats = [
  { icon: Shield, value: "20+", label: "年保安經驗" },
  { icon: Award, value: "500+", label: "合作客戶" },
  { icon: Users, value: "1000+", label: "專業保安人員" },
  { icon: Clock, value: "24/7", label: "全天候服務" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/images/security_guard_icc.png"
                alt="南方保安團隊"
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
              關於南方保安
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 leading-tight">
              值得信賴的保安服務夥伴
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
              <p>
                南方(警衛及管業)有限公司成立多年，一直致力為客戶提供專業、可靠的保安服務。我們擁有經驗豐富的管理團隊及訓練有素的保安人員，為各類商業及住宅物業提供全面的保安解決方案。
              </p>
              <p>
                我們深信，優質的保安服務不僅是保護財產，更是守護人們的安全與安心。憑藉專業的態度及先進的管理系統，我們已成功為超過500位客戶提供滿意的保安服務，贏得業界的廣泛認可。
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-dark hover:bg-dark-gray text-white px-8 py-3.5 rounded font-semibold transition-colors duration-200"
            >
              聯絡我們
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
