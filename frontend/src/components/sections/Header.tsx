"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t.header.nav.about, href: `/${locale}/` },
    { label: t.header.nav.services, href: `/${locale}/services` },
    { label: t.header.nav.clients, href: `/${locale}/clients` },
    { label: t.header.nav.careers, href: `/${locale}/careers` },
    { label: t.header.nav.contact, href: `/${locale}/contact` },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}/`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header row */}
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-24" : "h-32"
          }`}
        >
          {/* Logo and Company Name */}
          <a href={`/${locale}`} className="flex items-center gap-4">
            <Image
              src="/white-ssl-logo-transparent-bg.png"
              alt={t.header.companyName}
              width={128}
              height={128}
              className={`object-contain transition-all duration-300 ${
                scrolled ? "w-20 h-20" : "w-28 h-28"
              }`}
            />
            <span
              className={`text-dark font-bold tracking-wide hidden lg:block transition-all duration-300 ${
                scrolled ? "text-lg" : "text-xl"
              }`}
            >
              {t.header.companyName}
            </span>
          </a>

          {/* Desktop Navigation + Language Switcher */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`text-base font-medium tracking-wide transition-colors duration-200 pb-1 border-b-2 ${
                      active
                        ? "text-primary border-primary"
                        : "text-dark/70 border-transparent hover:text-primary hover:border-primary"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="w-px h-6 bg-dark/20" />

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-dark p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col px-4 py-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 text-lg font-medium tracking-wide transition-colors border-b border-gray-100 last:border-0 ${
                    active
                      ? "text-primary"
                      : "text-dark/70 hover:text-primary"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
