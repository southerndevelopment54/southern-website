import type { MetadataRoute } from "next";

const baseUrl = "https://southernservices.com.hk";
const locales = ["zh", "en", "cn"] as const;

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "about", priority: 0.8, changeFrequency: "monthly" },
  { path: "services", priority: 0.8, changeFrequency: "monthly" },
  { path: "clients", priority: 0.7, changeFrequency: "monthly" },
  { path: "careers", priority: 0.7, changeFrequency: "weekly" },
  { path: "contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "privacy-policy", priority: 0.5, changeFrequency: "yearly" },
  { path: "terms-of-use", priority: 0.5, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path ? `/${route.path}` : ""}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  );
}
