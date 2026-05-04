"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "首頁" },
  { href: "#", label: "關於我們" },
  { href: "#", label: "服務範圍" },
  { href: "#", label: "職位空缺" },
  { href: "#", label: "聯絡我們" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-purple text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-4 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
