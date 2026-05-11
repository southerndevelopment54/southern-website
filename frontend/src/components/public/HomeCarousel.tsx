"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    description: "專業保安服務",
    title: "您的安全 我們的使命",
    button: "了解更多",
    link: "/about",
    image: "/images/hero/ICC_image.jpg",
  },
  {
    description: "加入我們的團隊",
    title: "精彩的事業發展機會",
    button: "查看職位空缺",
    link: "/vacancies",
    image: "/images/hero/security_guard_icc.png",
  },
  {
    description: "全天候支援",
    title: "您的安全 我們的承諾",
    button: "聯絡我們",
    link: "/contact",
    image: "/images/hero/security_guard_walkie_talkie.png",
  },
];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background image placeholder */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${slide.image}')`,
            }}
          />
          {/* Semi-transparent black mask */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Content */}
          <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4 md:px-8">
            <div className="max-w-2xl">
              <p
                className="text-sm md:text-base font-medium mb-3 tracking-wide uppercase"
                style={{ color: "#51db3d" }}
              >
                {slide.description}
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight whitespace-nowrap">
                {slide.title}
              </h2>
              <Link
                href={slide.link}
                className="inline-block px-8 py-3 text-white font-semibold rounded transition-colors hover:opacity-90"
                style={{ backgroundColor: "#51db3d" }}
              >
                {slide.button}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
