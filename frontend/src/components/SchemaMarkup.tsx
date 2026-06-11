"use client";

import { useI18n } from "@/components/I18nProvider";

interface SchemaMarkupProps {
  type?: "home" | "about" | "contact" | "services" | "careers" | "clients";
}

export default function SchemaMarkup({ type = "home" }: SchemaMarkupProps) {
  const { locale } = useI18n();

  const isEn = locale === "en";
  const baseUrl = "https://southernservices.com.hk";

  const orgName = isEn
    ? "Southern (Security & Property Management) Co., Ltd."
    : "南方(警衛及管業)有限公司";

  const orgNameAlt = isEn
    ? "Southern Services Limited"
    : "南方警衛";

  const description = isEn
    ? "Southern is a leading provider of professional security and property management solutions across Hong Kong since 1997. Over 500 licensed security professionals protecting commercial, residential and industrial properties."
    : "南方自1997年創立以來，一直為香港各界提供專業可靠的綜合保安服務。現有逾500名持牌保安人員，服務網絡遍及商業大廈、住宅屋苑、工業設施及大型活動場地。";

  const address = {
    "@type": "PostalAddress",
    streetAddress: "Suite 2105-2107, New Treasure Centre, 10 Ng Fong Street, San Po Kong",
    addressLocality: "Kowloon",
    addressRegion: "Hong Kong",
    addressCountry: "HK",
  };

  const geo = {
    "@type": "GeoCoordinates",
    latitude: "22.3355",
    longitude: "114.1960",
  };

  const logo = `${baseUrl}/white-ssl-logo-transparent-bg.png`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: orgName,
    alternateName: orgNameAlt,
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: logo,
      width: 128,
      height: 128,
    },
    image: logo,
    description: description,
    foundingDate: "1997",
    telephone: "+852-2762-8128",
    email: "info@southern-security.hk",
    address: address,
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: orgName,
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#localbusiness`,
    name: orgName,
    alternateName: orgNameAlt,
    description: description,
    url: baseUrl,
    logo: logo,
    image: logo,
    telephone: "+852-2762-8128",
    email: "info@southern-security.hk",
    address: address,
    geo: geo,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: "Hong Kong",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isEn ? "Security Services" : "保安服務",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn ? "Commercial Building Security" : "商業大廈保安",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn ? "Residential Security" : "住宅保安",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn ? "Event Security" : "活動保安",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn ? "Personal Protection" : "個人護衛",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn ? "Security System Services" : "保安系統服務",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isEn ? "Mobile Patrol" : "車隊巡邏",
          },
        },
      ],
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isEn ? "Security Services" : "保安服務",
    provider: {
      "@id": `${baseUrl}/#organization`,
    },
    description: description,
    areaServed: {
      "@type": "City",
      name: "Hong Kong",
    },
    hasOfferCatalog: localBusinessSchema.hasOfferCatalog,
  };

  const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });

  let schemas: object[] = [];

  switch (type) {
    case "home":
      schemas = [organizationSchema, websiteSchema, localBusinessSchema];
      break;
    case "about":
      schemas = [organizationSchema, breadcrumbSchema([
        { name: isEn ? "Home" : "首頁", url: `${baseUrl}/${locale}/` },
        { name: isEn ? "About" : "關於南方", url: `${baseUrl}/${locale}/about` },
      ])];
      break;
    case "contact":
      schemas = [localBusinessSchema, breadcrumbSchema([
        { name: isEn ? "Home" : "首頁", url: `${baseUrl}/${locale}/` },
        { name: isEn ? "Contact" : "聯絡我們", url: `${baseUrl}/${locale}/contact` },
      ])];
      break;
    case "services":
      schemas = [serviceSchema, breadcrumbSchema([
        { name: isEn ? "Home" : "首頁", url: `${baseUrl}/${locale}/` },
        { name: isEn ? "Services" : "服務範圍", url: `${baseUrl}/${locale}/services` },
      ])];
      break;
    case "careers":
      schemas = [breadcrumbSchema([
        { name: isEn ? "Home" : "首頁", url: `${baseUrl}/${locale}/` },
        { name: isEn ? "Careers" : "加入我們", url: `${baseUrl}/${locale}/careers` },
      ])];
      break;
    case "clients":
      schemas = [breadcrumbSchema([
        { name: isEn ? "Home" : "首頁", url: `${baseUrl}/${locale}/` },
        { name: isEn ? "Clients" : "客戶及項目", url: `${baseUrl}/${locale}/clients` },
      ])];
      break;
    default:
      schemas = [organizationSchema];
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
