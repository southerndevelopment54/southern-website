"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function HeroCarousel() {
  const { locale, t } = useI18n();
  const autoplayRef = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplayRef.current,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/images/ICC_image.jpg",
      title: t.hero.slide1.title,
      description: t.hero.slide1.description,
      buttonText: t.hero.slide1.button,
      buttonHref: "#services",
    },
    {
      id: 2,
      image: "/images/security_guard_in_event.png",
      title: t.hero.slide2.title,
      description: t.hero.slide2.description,
      buttonText: t.hero.slide2.button,
      buttonHref: `/${locale}/contact#inquiry`,
    },
    {
      id: 3,
      image: "/images/body_guard_banner.png",
      title: t.hero.slide3.title,
      description: t.hero.slide3.description,
      buttonText: t.hero.slide3.button,
      buttonHref: `/${locale}/contact#inquiry`,
    },
    {
      id: 4,
      image: "/images/cctv_camera_cut.png",
      title: t.hero.slide4.title,
      description: t.hero.slide4.description,
      buttonText: t.hero.slide4.button,
      buttonHref: `/${locale}/services#6`,
    },
  ];

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
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      autoplayRef.current?.reset();
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const resetAutoplay = () => autoplayRef.current?.reset();
    emblaApi.on("pointerDown", resetAutoplay);
    return () => {
      emblaApi.off("pointerDown", resetAutoplay);
    };
  }, [emblaApi]);

  return (
    <section className="relative mt-32">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div key={slide.id} className="embla__slide relative">
              <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
                {/* Background Image */}
                {slide.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-dark" />
                )}
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
