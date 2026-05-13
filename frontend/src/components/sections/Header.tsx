"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const { locale, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t.header.nav.about, href: `/${locale}/` },
    { label: t.header.nav.services, href: `/${locale}/services` },
    { label: t.header.nav.clients, href: `/${locale}/clients` },
    { label: t.header.nav.careers, href: `/${locale}/careers` },
    { label: t.header.nav.contact, href: `/${locale}/contact` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar - Language switcher */}
        <div className="flex justify-end pt-2 pb-3">
          <LanguageSwitcher />
        </div>

        {/* Main header row */}
        <div className="flex items-end justify-between h-32 pb-3">
          {/* Logo and Company Name */}
          <a href={`/${locale}`} className="flex items-center gap-4">
            <Image
              src="/southern_service_logo.png"
              alt={t.header.companyName}
              width={128}
              height={128}
              className="w-32 h-auto object-contain"
            />
            <span className="text-white font-bold text-2xl tracking-wide hidden sm:block">
              {t.header.companyName}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-end gap-6 pb-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white/80 hover:text-primary text-lg font-medium tracking-wide transition-colors duration-200 pb-1 border-b-2 border-transparent hover:border-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3 pb-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-gray border-t border-white/10">
          <nav className="flex flex-col px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 hover:text-primary py-3 text-lg font-medium tracking-wide transition-colors border-b border-white/5 last:border-0"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
