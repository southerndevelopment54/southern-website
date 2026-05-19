"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/components/I18nProvider";

interface Client {
  id: number;
  name: string;
  logoUrl: string;
  isFeatured?: boolean;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function ClientCard({ company }: { company: Client }) {
  return (
    <div className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-5 md:p-6 flex flex-col items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 w-40 md:w-48 h-44 md:h-52">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white flex items-center justify-center mb-3 p-2 border border-gray-100">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-xl md:text-2xl font-bold text-gray-400">
            {company.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="text-xs md:text-sm text-gray-800 text-center font-semibold leading-tight line-clamp-2">
        {company.name}
      </div>
    </div>
  );
}

export default function TrustedCompanies() {
  const { t } = useI18n();
  const [clients, setClients] = useState<Client[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const dupGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/clients")
      .then((res) => {
        const list: Client[] = res.data || [];
        list.sort((a, b) => {
          if (a.isFeatured === b.isFeatured) return 0;
          return a.isFeatured ? -1 : 1;
        });
        setClients(list);
      })
      .catch(() => setClients([]));
  }, []);

  useEffect(() => {
    if (clients.length === 0) return;

    const timer = setTimeout(() => {
      const track = trackRef.current;
      const firstGroup = firstGroupRef.current;
      const dupGroup = dupGroupRef.current;
      if (!track || !firstGroup || !dupGroup) return;

      const cycleWidth =
        dupGroup.getBoundingClientRect().left -
        firstGroup.getBoundingClientRect().left;

      if (!cycleWidth || cycleWidth <= 0) return;

      track.style.setProperty("--cycle-width", `-${cycleWidth}px`);
    }, 300);

    return () => clearTimeout(timer);
  }, [clients]);

  if (clients.length === 0) return null;

  const clientGroups = chunkArray(clients, 2);

  const renderGroups = (
    prefix: string,
    firstRef?: React.Ref<HTMLDivElement>,
    dupRef?: React.Ref<HTMLDivElement>
  ) =>
    clientGroups.map((group, i) => (
      <div
        key={`${prefix}-${i}`}
        ref={i === 0 ? firstRef || dupRef || undefined : undefined}
        className="flex flex-col gap-4 md:gap-5 shrink-0 pr-6 md:pr-8"
      >
        {group.map((company) => (
          <ClientCard key={`${company.id}-${prefix}-${i}`} company={company} />
        ))}
        {group.length === 1 && (
          <div className="invisible w-40 md:w-48 h-44 md:h-52" aria-hidden="true" />
        )}
      </div>
    ));

  return (
    <section className="py-16 md:py-24 bg-off-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            {t.trustedCompanies.title}
          </h2>
          <p className="text-gray-600">{t.trustedCompanies.subtitle}</p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex shrink-0"
          style={{
            width: "max-content",
            animation: "marquee 40s linear infinite",
          }}
        >
          {renderGroups("a", firstGroupRef)}
          {renderGroups("b", undefined, dupGroupRef)}
          {renderGroups("c")}
          {renderGroups("d")}
          {renderGroups("e")}
          {renderGroups("f")}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(var(--cycle-width, -50%));
          }
        }
      `}</style>
    </section>
  );
}
