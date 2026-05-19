"use client";

import { useState, useEffect, useCallback } from "react";
import { Building2, Users, Star } from "lucide-react";
import { api } from "@/lib/api";
import { useI18n } from "@/components/I18nProvider";

interface Client {
  id: number;
  name: string;
  nameEn?: string;
  logoUrl: string;
}

interface GuardingSite {
  id: number;
  name: string;
  nameEn?: string;
  imageUrl: string;
  address: string;
  addressEn?: string;
  category: string;
  isFeatured: boolean;
}

type SiteFilter = "featured" | "commercial" | "residential" | "other";

export default function ClientShowcase() {
  const { t, locale } = useI18n();

  const [activeTab, setActiveTab] = useState<"clients" | "sites">("clients");
  const [siteFilter, setSiteFilter] = useState<SiteFilter>("featured");
  const [clients, setClients] = useState<Client[]>([]);
  const [sites, setSites] = useState<GuardingSite[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);

  // Read URL params once on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const filter = params.get("filter") as SiteFilter | null;

    if (tab === "sites") setActiveTab("sites");
    if (filter && ["featured", "commercial", "residential", "other"].includes(filter)) {
      setSiteFilter(filter);
    }
  }, []);

  // Fetch clients once
  useEffect(() => {
    api.get("/clients")
      .then((res) => setClients(res.data))
      .catch(() => setClients([]));
  }, []);

  // Fetch sites whenever the filter changes
  const fetchSites = useCallback(async (filter: SiteFilter) => {
    setLoadingSites(true);
    setSites([]);
    try {
      const url = filter === "featured"
        ? "/projects?featured=true"
        : `/projects?category=${encodeURIComponent(filter)}`;
      const res = await api.get(url);
      const data = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setSites(data);
    } catch {
      setSites([]);
    } finally {
      setLoadingSites(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "sites") {
      fetchSites(siteFilter);
    }
  }, [siteFilter, activeTab, fetchSites]);

  const mainTabs = [
    { id: "clients" as const, label: t.clientShowcase.tabClients, icon: Users },
    { id: "sites" as const, label: t.clientShowcase.tabSites, icon: Building2 },
  ];

  const siteFilters = [
    { id: "featured" as const, label: t.clientShowcase.tabKey },
    { id: "commercial" as const, label: t.clientShowcase.tabCommercial },
    { id: "residential" as const, label: t.clientShowcase.tabResidential },
    { id: "other" as const, label: t.clientShowcase.tabOthers },
  ];

  const featuredSites = sites.filter((s) => s.isFeatured);
  const nonFeaturedSites = sites.filter((s) => !s.isFeatured);

  const formatClientName = (name: string) => {
    const parts = name.split("有限公司");
    if (parts.length <= 1) return name;
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && (
          <>
            <wbr />
            <span className="whitespace-nowrap">有限公司</span>
          </>
        )}
      </span>
    ));
  };

  const renderSiteCard = (site: GuardingSite, compact = false) => (
    <div
      key={site.id}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-200 group"
    >
      <div className={`overflow-hidden ${compact ? "aspect-[16/10]" : "aspect-[16/10]"}`}>
        <img
          src={site.imageUrl || "/images/placeholder.jpg"}
          alt={site.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className={compact ? "p-4" : "p-6"}>
        <h3 className={`font-bold text-dark mb-1 ${compact ? "text-base" : "text-lg"}`}>{locale === "en" && site.nameEn ? site.nameEn : site.name}</h3>
        <p className="text-sm text-gray-500 flex items-center gap-1.5">
          <Building2 className={`text-primary ${compact ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
          {(locale === "en" && site.addressEn ? site.addressEn : site.address) || "-"}
        </p>
      </div>
    </div>
  );

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 flex items-center gap-5 hover:border-primary/30 hover:shadow-lg transition-all duration-200 group"
              >
                {client.logoUrl ? (
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-white border border-gray-100 group-hover:border-primary/30 transition-colors duration-200">
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-dark rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-200">
                    <span className="text-white font-bold text-2xl">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-dark text-lg md:text-xl mb-1">{formatClientName(locale === "en" && client.nameEn ? client.nameEn : client.name)}</h3>
                </div>
              </div>
            ))}
            {clients.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 text-lg">暫無客戶 / No clients yet</p>
              </div>
            )}
          </div>
        )}

        {/* Sites Tab */}
        {activeTab === "sites" && (
          <>
            {loadingSites ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">載入中...</p>
              </div>
            ) : sites.length > 0 ? (
              <div key={siteFilter}>
                {/* Featured tab — single grid */}
                {siteFilter === "featured" && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sites.map((site) => renderSiteCard(site))}
                  </div>
                )}

                {/* Category tabs — featured on top (3 col), non-featured below (4 col smaller) */}
                {siteFilter !== "featured" && (
                  <div className="space-y-10">
                    {featuredSites.length > 0 && (
                      <div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {featuredSites.map((site) => renderSiteCard(site))}
                        </div>
                      </div>
                    )}

                    {nonFeaturedSites.length > 0 && (
                      <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {nonFeaturedSites.map((site) => renderSiteCard(site, true))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
