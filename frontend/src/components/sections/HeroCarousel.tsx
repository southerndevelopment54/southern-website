"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/ICC_image.jpg",
    title: "專業保安服務",
    description: "我們提供頂級的商業及住宅保安解決方案，確保您的財產和人員安全無虞。",
    buttonText: "了解更多",
    buttonHref: "#services",
  },
  {
    id: 2,
    image: "/images/Event.png",
    title: "活動安全保障",
    description: "為各類大型活動提供全面的安全規劃及執行，讓活動順利進行。",
    buttonText: "查詢服務",
    buttonHref: "#contact",
  },
  {
    id: 3,
    image: "/images/body_guard_banner.png",
    title: "個人安全護衛",
    description: "專業護衛團隊為您提供貼身保護，確保您在任何場合都能安心無憂。",
    buttonText: "立即預約",
    buttonHref: "#contact",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="relative mt-20">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div key={slide.id} className="embla__slide relative">
              <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="relative h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-xl">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                        {slide.description}
                      </p>
                      <a
                        href={slide.buttonHref}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded font-semibold transition-all duration-200 hover:gap-3"
                      >
                        {slide.buttonText}
                        <ChevronRight size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Dots - Bottom Right */}
      <div className="absolute bottom-6 right-4 sm:right-6 lg:right-8 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-primary w-8"
                : "bg-white/60 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
