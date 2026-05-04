"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "首頁" },
    { href: "/about", label: "關於我們" },
    { href: "/services", label: "服務範圍" },
    { href: "/vacancies", label: "職位空缺" },
    { href: "/contact", label: "聯絡我們" },
  ];

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <Link href="/" className="text-xl font-bold">
              安保公司
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-slate-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-slate-900">
                後台管理
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin/login" className="block px-3 py-2">
            <Button variant="outline" size="sm" className="w-full text-white border-white">
              後台管理
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
