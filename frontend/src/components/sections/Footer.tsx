"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function Footer() {
  const { locale, t } = useI18n();
  const [year, setYear] = useState(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const companyLinks = [
    { label: t.header.nav.about, href: `/${locale}/about` },
    { label: t.header.nav.services, href: `/${locale}/services` },
    { label: t.header.nav.clients, href: `/${locale}/clients` },
    { label: t.header.nav.careers, href: `/${locale}/careers` },
    { label: t.header.nav.contact, href: `/${locale}/contact` },
  ];

  const serviceLinks = t.services.items.map((item, index) => ({
    label: item.title,
    href: `/${locale}/services#${index}`,
  }));

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-3">
          {/* Company Info */}
          <div className="lg:max-w-[260px]">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/white-ssl-logo-transparent-bg.png"
                alt={t.header.companyName}
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-lg whitespace-nowrap">{t.header.companyName}</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+852 2762 8128</span>
              </div>
              {/* TODO: Re-enable when email is ready
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>info@southern-security.hk</span>
              </div>
              */}

              <div className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{t.contact.addressValue}</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:max-w-[140px]">
            <h3 className="font-semibold text-white mb-4">{t.footer.companyInfo}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Types */}
          <div className="lg:max-w-[280px]">
            <h3 className="font-semibold text-white mb-4">{t.footer.serviceTypes}</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* License Info */}
          <div className="lg:max-w-[220px]">
            <h3 className="font-semibold text-white mb-4">{t.footer.licenseTitle}</h3>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-white/60 leading-relaxed">
                {t.footer.licenseText}
              </p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-white/40">{t.footer.licenseNo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">
              <span className="whitespace-nowrap">&copy; {year} {t.header.companyName}.</span> <span>{t.footer.copyright}</span>
            </p>
            <div className="flex gap-6">
              <a href={`/${locale}/privacy-policy`} className="text-sm text-white/40 hover:text-white/60 transition-colors">
                {t.footer.privacy}
              </a>
              <a href={`/${locale}/terms-of-use`} className="text-sm text-white/40 hover:text-white/60 transition-colors">
                {t.footer.terms}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
