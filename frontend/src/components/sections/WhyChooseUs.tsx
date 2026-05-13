"use client";

import { Check } from "lucide-react";

const features = [
  "所有保安人員均持有效保安人員許可證",
  "定期專業培訓及技能提升課程",
  "24小時控制中心即時支援",
  "量身定制保安方案滿足客戶需求",
  "先進科技配合傳統保安策略",
  "完善的緊急應變及事故處理機制",
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image Banner */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/images/guard_with_dog1.png"
                alt="專業保安團隊"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Green accent */}
            <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-primary/30 rounded-lg -z-10" />
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              為何選擇我們
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 leading-tight">
              專業、可靠、值得信賴
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              南方(警衛及管業)有限公司以客戶安全為首要使命。我們結合專業人才、先進科技及嚴謹管理，為每一位客戶提供超越期望的保安服務。選擇我們，就是選擇安心。
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded font-semibold transition-colors duration-200"
            >
              立即諮詢
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
