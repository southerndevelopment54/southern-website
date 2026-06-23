"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/components/I18nProvider";

interface Client {
  id: number;
  name: string;
  nameEn?: string;
  nameCn?: string;
}

function splitIntoRows<T>(arr: T[], rowCount: number): T[][] {
  const rows: T[][] = Array.from({ length: rowCount }, () => []);
  arr.forEach((item, i) => {
    rows[i % rowCount].push(item);
  });
  return rows;
}

function MarqueeTrack({ names, reverse = false }: { names: string[]; reverse?: boolean }) {
  if (names.length === 0) return null;

  const animationStyle: React.CSSProperties = {
    animation: `${reverse ? "trusted-marquee-rtl" : "trusted-marquee-ltr"} 25s linear infinite`,
  };

  return (
    <div className="relative overflow-hidden py-3 md:py-4">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-off-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-off-white to-transparent z-10" />

      <div
        className="flex whitespace-nowrap will-change-transform backface-hidden hover:[animation-play-state:paused]"
        style={animationStyle}
      >
        {[...Array(5)].map((_, groupIndex) => (
          <span
            key={groupIndex}
            className="flex items-center shrink-0"
            aria-hidden={groupIndex > 0 ? "true" : undefined}
          >
            {names.map((name, i) => (
              <span
                key={`${groupIndex}-${i}`}
                className="shrink-0 px-6 md:px-10 text-sm md:text-base font-medium text-dark/80"
              >
                {name}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TrustedCompanies() {
  const { locale, t } = useI18n();
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    api
      .get("/clients")
      .then((res) => {
        const list: Client[] = res.data || [];
        const names = list
          .map((c) =>
            locale === "en" && c.nameEn
              ? c.nameEn
              : locale === "cn" && c.nameCn
              ? c.nameCn
              : c.name
          )
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, locale === "en" ? "en" : "zh-HK"));
        setRows(splitIntoRows(names, 3));
      })
      .catch(() => setRows([]));
  }, [locale]);

  if (rows.length === 0 || rows.every((r) => r.length === 0)) return null;

  return (
    <section className="py-16 md:py-24 bg-off-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            {t.trustedCompanies.title}
          </h2>
          <p className="text-gray-600">{t.trustedCompanies.subtitle}</p>
        </div>
      </div>

      <div className="space-y-1">
        <MarqueeTrack names={rows[0] || []} />
        <MarqueeTrack names={rows[1] || []} reverse />
        <MarqueeTrack names={rows[2] || []} />
      </div>

      <style>{`
        @keyframes trusted-marquee-ltr {
          0% { transform: translate3d(-20%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes trusted-marquee-rtl {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-20%, 0, 0); }
        }
      `}</style>
    </section>
  );
}
