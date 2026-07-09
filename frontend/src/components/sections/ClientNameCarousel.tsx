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

function getDisplayName(client: Client, locale: string) {
  if (locale === "en" && client.nameEn) return client.nameEn;
  if (locale === "cn" && client.nameCn) return client.nameCn;
  return client.name;
}

function ClientName({ name }: { name: string }) {
  const suffix = "有限公司";
  const idx = name.indexOf(suffix);
  if (idx !== -1) {
    return (
      <>
        {name.slice(0, idx)}
        <br />
        <span className="whitespace-nowrap">
          {suffix}
          {name.slice(idx + suffix.length)}
        </span>
      </>
    );
  }
  return <>{name}</>;
}

function ClientCard({
  client,
  number,
  locale,
}: {
  client: Client;
  number: number;
  locale: string;
}) {
  return (
    <div
      className="relative flex-none w-56 sm:w-64 h-24 sm:h-28 shadow-[inset_0_0_0_1px_#e5e7eb] bg-white flex items-center justify-center px-4 overflow-hidden"
    >
      <span className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold text-gray-300 tracking-wider">
        #{String(number).padStart(2, "0")}
      </span>
      <span className="text-center text-base sm:text-lg font-semibold text-black leading-snug line-clamp-2 break-keep">
        <ClientName name={getDisplayName(client, locale)} />
      </span>
    </div>
  );
}

function ScrollingRow({
  clients,
  startNumber,
  duration,
  locale,
}: {
  clients: Client[];
  startNumber: number;
  duration: number;
  locale: string;
}) {
  const loop = [...clients, ...clients];

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex w-max animate-client-marquee will-change-transform"
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((client, index) => (
          <ClientCard
            key={`${client.id}-${index}`}
            client={client}
            number={startNumber + (index % clients.length)}
            locale={locale}
          />
        ))}
      </div>
      {/* Left fade */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none z-10" />
      {/* Right fade */}
      <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none z-10" />
    </div>
  );
}

export default function ClientNameCarousel() {
  const { locale, t } = useI18n();
  const [clients, setClients] = useState<Client[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get("/clients")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setClients(data);
      })
      .catch((err) => {
        console.error("Failed to load clients for carousel:", err);
        setClients([]);
      })
      .finally(() => setLoaded(true));
  }, []);

  const mid = Math.ceil(clients.length / 2);
  const row1 = clients.slice(0, mid);
  const row2 = clients.slice(mid);

  // Keep both rows moving at the same visual speed.
  const secondsPerCard = 4.5;
  const duration1 = row1.length * secondsPerCard;
  const duration2 = row2.length * secondsPerCard;

  return (
    <section className="py-10 md:py-14 bg-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark">
            {t.clientCarousel.title}
          </h2>
          <p className="text-gray-600 mt-2">{t.clientCarousel.subtitle}</p>
        </div>
        {loaded && clients.length > 0 ? (
          <div className="space-y-0">
            {row1.length > 0 && (
              <ScrollingRow
                clients={row1}
                startNumber={1}
                duration={duration1}
                locale={locale}
              />
            )}
            {row2.length > 0 && (
              <ScrollingRow
                clients={row2}
                startNumber={mid + 1}
                duration={duration2}
                locale={locale}
              />
            )}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-dark/60 font-medium text-center px-4">
            {loaded && clients.length === 0
              ? "暫無客戶資料 / No client data"
              : "載入客戶名單中..."}
          </div>
        )}
      </div>

    </section>
  );
}
