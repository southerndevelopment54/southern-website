"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/components/I18nProvider";

interface Client {
  id: number;
  name: string;
  logoUrl: string;
}

export default function TrustedCompanies() {
  const { t } = useI18n();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    api.get("/clients?featured=true")
      .then((res) => setClients(res.data))
      .catch(() => setClients([]));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            {t.trustedCompanies.title}
          </h2>
          <p className="text-gray-600">
            {t.trustedCompanies.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {clients.map((company) => (
            <div
              key={company.id}
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white flex items-center justify-center mb-4 p-3 border border-gray-100">
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
              <div className="text-sm md:text-base text-gray-800 text-center font-semibold">
                {company.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
