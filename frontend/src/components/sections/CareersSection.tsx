"use client";

import { Briefcase, ArrowRight } from "lucide-react";

const benefits = [
  "具競爭力的薪酬待遇",
  "完善在職培訓及晉升機會",
  "醫療保險及強積金供款",
  "有薪年假及法定假期",
];

export default function CareersSection() {
  return (
    <section id="careers" className="py-20 md:py-28 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left - Content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-6">
                <Briefcase className="w-4 h-4" />
                加入我們的團隊
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                與我們一起成長
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                南方(警衛及管業)有限公司誠邀有志於保安行業發展的專業人才加入我們的團隊。我們重視每一位員工的發展，提供完善的培訓及晉升機會，與您共同成長。
              </p>

              {/* Benefits */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded font-semibold transition-colors duration-200 w-fit"
              >
                查看職位空缺
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right - Image */}
            <div className="hidden lg:block relative">
              <img
                src="/images/guard_chatting_fixed.png"
                alt="團隊合作"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
