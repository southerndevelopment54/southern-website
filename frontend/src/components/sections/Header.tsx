"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "關於我們", href: "/#about" },
  { label: "服務範圍", href: "/services" },
  { label: "客戶及項目", href: "/clients" },
  { label: "加入我們", href: "/careers" },
  { label: "聯絡我們", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between h-36 pb-1">
          {/* Logo and Company Name */}
          <a href="/" className="flex items-center gap-4 pt-2">
            <Image
              src="/southern_service_logo.png"
              alt="南方(警衛及管業)有限公司"
              width={128}
              height={128}
              className="w-32 h-auto object-contain"
            />
            <span className="text-white font-bold text-2xl tracking-wide hidden sm:block">
              南方(警衛及管業)有限公司
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-end gap-8 pb-1">
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
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 pb-3"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
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
