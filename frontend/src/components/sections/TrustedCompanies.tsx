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
    <section className="py-16 md:py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            {t.trustedCompanies.title}
          </h2>
          <p className="text-gray-600">
            {t.trustedCompanies.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          {clients.map((company) => (
            <div
              key={company.id}
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-200 shadow-sm"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-white flex items-center justify-center mb-3 p-2">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-400">
                    {company.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-700 text-center font-medium">
                {company.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
