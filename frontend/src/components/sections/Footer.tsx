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

  const footerLinks = {
    [t.footer.companyInfo]: [
      { label: t.header.nav.about, href: `/${locale}/#about` },
      { label: t.header.nav.services, href: `/${locale}/services` },
      { label: t.header.nav.careers, href: `/${locale}/careers` },
      { label: t.header.nav.contact, href: `/${locale}/contact` },
    ],
    [t.footer.serviceTypes]: [
      { label: t.services.items[0]?.title ?? "", href: `/${locale}/#services` },
      { label: t.services.items[1]?.title ?? "", href: `/${locale}/#services` },
      { label: t.services.items[2]?.title ?? "", href: `/${locale}/#services` },
      { label: t.services.items[3]?.title ?? "", href: `/${locale}/#services` },
    ],
  };

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/southern_service_logo.png"
                alt={t.header.companyName}
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-lg">{t.header.companyName}</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+852 2762 8128</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>info@southern-security.hk</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>新蒲崗五芳街10號新寶中心19樓1907室</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
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
          ))}

          {/* License Info */}
          <div>
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
              <span>&copy; {year} {t.header.companyName}. {t.footer.copyright}</span>
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">
                {t.footer.privacy}
              </a>
              <a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">
                {t.footer.terms}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
