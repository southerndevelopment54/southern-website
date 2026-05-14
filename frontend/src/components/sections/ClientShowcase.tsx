"use client";

import { useState, useEffect } from "react";
import { Building2, Users, Star } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

const clients = [
  { name: "新鴻基地產", abbr: "SHKP", category: "地產發展商", logo: "/images/clients/SHKP.png" },
  { name: "長江實業集團", abbr: "CK", category: "綜合企業", logo: "/images/clients/CK.png" },
  { name: "恒基兆業地產", abbr: "HEND", category: "地產發展商", logo: "/images/clients/Henderson_Land_Development.png" },
  { name: "信和置業", abbr: "SINO", category: "地產發展商", logo: "/images/clients/SinoGroup.png" },
  { name: "太古地產", abbr: "SWIRE", category: "地產發展商", logo: "/images/clients/swire.png" },
  { name: "九龍倉集團", abbr: "WHARF", category: "綜合企業", logo: "/images/clients/WHARF.png" },
  { name: "新世界發展", abbr: "NWD", category: "綜合企業", logo: "/images/clients/New%20world%20group.png" },
  { name: "華懋集團", abbr: "CML", category: "地產發展商", logo: "/images/clients/CHINACHEM%20group.png" },
  { name: "領展房地產投資信託基金", abbr: "LINK", category: "零售物業", logo: "/images/clients/LINK.png" },
  { name: "港鐵公司", abbr: "MTR", category: "交通基建", logo: "/images/clients/MTR.png" },
  { name: "香港置地", abbr: "HKL", category: "地產投資", logo: "/images/clients/HKL.png" },
  { name: "會德豐地產", abbr: "WHEEL", category: "地產發展商", logo: "/images/clients/WHEELOCK.png" },
];

type SiteCategory = "key" | "commercial" | "residential";

interface Site {
  name: string;
  location: string;
  image: string;
  category: SiteCategory;
}

const sites: Site[] = [
  { name: "環球貿易廣場 (ICC)", location: "九龍柯士甸道西1號", image: "/images/sites/icc.jpg", category: "key" },
  { name: "國際金融中心 (IFC)", location: "中環金融街8號", image: "/images/sites/IFC.jpg", category: "key" },
  { name: "海港城", location: "尖沙咀廣東道", image: "/images/sites/harbour%20city.jpg", category: "key" },
  { name: "時代廣場", location: "銅鑼灣勿地臣街1號", image: "/images/sites/time%20square.jpeg", category: "key" },
  { name: "太古廣場", location: "金鐘金鐘道88號", image: "/images/sites/pacific%20place.jpg", category: "key" },
  { name: "圓方 (Elements)", location: "尖沙咀柯士甸道西1號", image: "/images/sites/elements.png", category: "key" },
];

export default function ClientShowcase() {
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<"clients" | "sites">("clients");
  const [siteFilter, setSiteFilter] = useState<SiteCategory>("key");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const filter = params.get("filter") as SiteCategory | null;

    if (tab === "sites") setActiveTab("sites");
    if (filter && ["key", "commercial", "residential"].includes(filter)) {
      setSiteFilter(filter);
    }
  }, []);

  const mainTabs = [
    { id: "clients" as const, label: t.clientShowcase.tabClients, icon: Users },
    { id: "sites" as const, label: t.clientShowcase.tabSites, icon: Building2 },
  ];

  const siteFilters = [
    { id: "key" as const, label: t.clientShowcase.tabKey },
    { id: "commercial" as const, label: t.clientShowcase.tabCommercial },
    { id: "residential" as const, label: t.clientShowcase.tabResidential },
  ];

  const filteredSites = sites.filter((s) => s.category === siteFilter);

  return (
    <section className="py-20 md:py-28 bg-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
            <Star className="w-4 h-4" />
            {t.clientShowcase.badge}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            {t.clientShowcase.title}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {t.clientShowcase.description}
          </p>
        </div>

        {/* Main Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-off-white rounded-xl p-1.5">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-dark text-white shadow-md"
                    : "text-gray-500 hover:text-dark"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Site Filter Tabs */}
        {activeTab === "sites" && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-lg p-1 border border-gray-100">
              {siteFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSiteFilter(filter.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    siteFilter === filter.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-500 hover:text-dark"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {clients.map((client, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:border-primary/30 hover:shadow-lg transition-all duration-200 group"
              >
                {client.logo ? (
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 overflow-hidden bg-white border border-gray-100 group-hover:border-primary/30 transition-colors duration-200">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-dark rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-200">
                    <span className="text-white font-bold text-lg">
                      {client.abbr}
                    </span>
                  </div>
                )}
                <h3 className="font-bold text-dark mb-1">{client.name}</h3>
                <p className="text-xs text-gray-400">{client.category}</p>
              </div>
            ))}
          </div>
        )}

        {/* Sites Tab */}
        {activeTab === "sites" && (
          <>
            {filteredSites.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSites.map((site, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={site.image}
                        alt={site.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-dark text-lg mb-1">{site.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        {site.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">暫無項目 / No projects yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
