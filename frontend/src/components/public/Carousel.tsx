"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
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

  const slides = [
    {
      image: "/images/hero/banner-1.jpg",
      title: "專業保安服務",
      subtitle: "為您的物業提供全天候專業守護，讓您安心無憂",
      cta: "聯絡我們",
      ctaHref: "#",
    },
  ];

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative h-[400px] md:h-[500px] lg:h-[600px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-purple/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-3xl">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 text-white/90">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.ctaHref}>
                    <Button
                      size="lg"
                      className="bg-green hover:bg-green/90 text-white font-semibold px-8 py-6 text-lg"
                    >
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
