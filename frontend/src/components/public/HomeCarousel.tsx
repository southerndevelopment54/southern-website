"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    description: "Professional Security Services",
    title: "Protecting What Matters Most",
    button: "Learn More",
    link: "/about",
  },
  {
    description: "Join Our Team",
    title: "Exciting Career Opportunities",
    button: "View Vacancies",
    link: "/vacancies",
  },
  {
    description: "24/7 Support",
    title: "Your Safety Is Our Priority",
    button: "Contact Us",
    link: "/contact",
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
              backgroundImage: `url('/images/hero/slide-${index + 1}.jpg')`,
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
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
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
