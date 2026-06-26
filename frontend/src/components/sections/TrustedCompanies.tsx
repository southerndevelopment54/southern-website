"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useI18n } from "@/components/I18nProvider";
import type { Locale, Translations } from "@/lib/i18n";

interface GuardingSite {
  id: number;
  name: string;
  nameEn?: string;
  nameCn?: string;
  imageUrl: string;
  address: string;
  addressEn?: string;
  addressCn?: string;
  category: string;
  subCategory?: string;
}

function getSiteTypeLabel(site: GuardingSite, t: Translations) {
  const key =
    site.category === "other" && site.subCategory ? site.subCategory : site.category;
  return (
    (t.featuredProjects.categories as Record<string, string>)[key] ||
    t.featuredProjects.badge
  );
}

function getDisplayName(site: GuardingSite, locale: Locale) {
  if (locale === "en" && site.nameEn) return site.nameEn;
  if (locale === "cn" && site.nameCn) return site.nameCn;
  return site.name;
}

function getDisplayAddress(site: GuardingSite, locale: Locale) {
  if (locale === "en" && site.addressEn) return site.addressEn;
  if (locale === "cn" && site.addressCn) return site.addressCn;
  return site.address;
}

export default function TrustedCompanies() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [sites, setSites] = useState<GuardingSite[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const offsetsRef = useRef<Record<number, number>>({});

  const computeOffsets = (centerIndex: number, list: GuardingSite[]) => {
    const n = list.length;
    const offsets: Record<number, number> = {};
    list.forEach((site, i) => {
      let offset = i - centerIndex;
      while (offset > 2) offset -= n;
      while (offset < -2) offset += n;
      offsets[site.id] = offset;
    });
    return offsets;
  };

  useEffect(() => {
    api
      .get("/projects?featured=true")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setSites(data);
        setCurrentIndex(0);
        offsetsRef.current = computeOffsets(0, data);
      })
      .catch(() => setSites([]));
  }, []);

  const moveOffsets = (direction: "next" | "prev") => {
    const n = sites.length;
    if (n === 0) return;
    const nextOffsets: Record<number, number> = {};
    sites.forEach((site) => {
      const offset = offsetsRef.current[site.id] ?? 0;
      const newOffset = direction === "next" ? offset - 1 : offset + 1;
      nextOffsets[site.id] =
        direction === "next"
          ? newOffset < -2
            ? newOffset + n
            : newOffset
          : newOffset > 2
          ? newOffset - n
          : newOffset;
    });
    offsetsRef.current = nextOffsets;
  };

  const goTo = (targetIndex: number) => {
    const n = sites.length;
    if (n === 0) return;
    const normalizedTarget = (targetIndex + n) % n;
    const forward = (normalizedTarget - currentIndex + n) % n;
    const backward = (currentIndex - normalizedTarget + n) % n;
    const direction = forward <= backward ? "next" : "prev";
    const steps = direction === "next" ? forward : backward;

    for (let i = 0; i < steps; i++) {
      moveOffsets(direction);
    }
    setCurrentIndex(normalizedTarget);
  };

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  const handleProjectClick = (site: GuardingSite) => {
    const params = new URLSearchParams({ tab: "sites", filter: site.category });
    if (site.category === "other" && site.subCategory) {
      params.set("subFilter", site.subCategory);
    }
    router.push(`/${locale}/clients?${params.toString()}`);
  };

  const goNextRef = useRef(goNext);
  goNextRef.current = goNext;

  useEffect(() => {
    if (sites.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      goNextRef.current();
    }, 5000);
    return () => clearInterval(interval);
  }, [sites.length, isPaused]);

  if (sites.length === 0) return null;

  const getTransform = (offset: number) => {
    const gap = 320;
    const x = offset * gap;
    const scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.78 : 0.65;
    return `translateX(calc(-50% + ${x}px)) scale(${scale})`;
  };

  const getOpacityClass = (offset: number) => {
    if (offset === 0) return "opacity-100";
    if (Math.abs(offset) === 1) return "opacity-45";
    return "opacity-0";
  };

  const getZIndexClass = (offset: number) => {
    if (offset === 0) return "z-20";
    if (Math.abs(offset) === 1) return "z-10";
    return "z-0";
  };

  return (
    <section className="py-10 md:py-12 bg-off-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 md:mb-5 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-2">
          {t.featuredProjects.title}
        </h2>
        <p className="text-gray-600">{t.featuredProjects.subtitle}</p>
      </div>

      <div
        className="relative max-w-6xl mx-auto h-[380px] sm:h-[440px] md:h-[490px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {sites.map((site) => {
          const offset = offsetsRef.current[site.id] ?? 0;
          const isCenter = offset === 0;
          const isSide = Math.abs(offset) === 1;
          const isVisible = isCenter || isSide;

          return (
            <div
              key={site.id}
              onClick={() =>
                isSide
                  ? goTo(sites.indexOf(site))
                  : isCenter
                  ? handleProjectClick(site)
                  : undefined
              }
              className={`absolute top-0 left-1/2 w-[260px] sm:w-[300px] md:w-[340px] will-change-transform backface-hidden transition-all duration-700 ease-in-out ${getOpacityClass(offset)} ${getZIndexClass(offset)} ${
                isVisible ? "cursor-pointer" : "pointer-events-none"
              }`}
              style={{ transform: getTransform(offset) }}
            >
              <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-white">
                <img
                  src={site.imageUrl || "/images/placeholder.jpg"}
                  alt={getDisplayName(site, locale)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 text-center">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-1">
                  {getSiteTypeLabel(site, t)}
                </span>
                <h3 className="text-base md:text-lg font-bold text-dark mt-2 line-clamp-2">
                  {getDisplayName(site, locale)}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2 flex items-start justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <span>{getDisplayAddress(site, locale) || "-"}</span>
                </p>
              </div>
            </div>
          );
        })}

        {sites.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous project"
              className="absolute left-2 sm:left-4 md:left-8 top-[150px] sm:top-[180px] md:top-[220px] z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-dark shadow-md border border-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next project"
              className="absolute right-2 sm:right-4 md:right-8 top-[150px] sm:top-[180px] md:top-[220px] z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-dark shadow-md border border-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {sites.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-0">
          {sites.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-primary w-6" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
