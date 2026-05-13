"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "./I18nProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "zh" | "en") => {
    if (newLocale === locale) return;

    setLocale(newLocale);

    // Replace locale in current path
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => switchLocale("zh")}
        className={`px-2 py-1 text-sm font-medium transition-colors duration-200 rounded ${
          locale === "zh"
            ? "text-white bg-primary"
            : "text-white/60 hover:text-white"
        }`}
        aria-label="Switch to Chinese"
      >
        中文
      </button>
      <span className="text-white/30 text-xs">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 text-sm font-medium transition-colors duration-200 rounded ${
          locale === "en"
            ? "text-white bg-primary"
            : "text-white/60 hover:text-white"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
