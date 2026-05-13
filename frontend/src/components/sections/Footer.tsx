"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  公司資訊: [
    { label: "關於我們", href: "#about" },
    { label: "服務範圍", href: "#services" },
    { label: "加入我們", href: "#careers" },
    { label: "聯絡我們", href: "#contact" },
  ],
  服務類型: [
    { label: "商業大廈保安", href: "#services" },
    { label: "住宅保安服務", href: "#services" },
    { label: "活動保安管理", href: "#services" },
    { label: "個人護衛服務", href: "#services" },
  ],
};

export default function Footer() {
  const [year, setYear] = useState(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

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
                alt="南方(警衛及管業)有限公司"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-lg">南方警衛</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              專業保安服務，守護您的安全。我們致力為客戶提供最優質的保安解決方案。
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
                <span>香港九龍尖沙咀廣東道1號</span>
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
            <h3 className="font-semibold text-white mb-4">牌照資訊</h3>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-white/60 leading-relaxed">
                本公司持有香港警務處簽發的保安公司牌照，所有保安人員均持有有效保安人員許可證。
              </p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-white/40">牌照號碼: 12345ABC</span>
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
              <span>© {year} 南方(警衛及管業)有限公司. 保留所有權利.</span>
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">
                私隱政策
              </a>
              <a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">
                使用條款
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
