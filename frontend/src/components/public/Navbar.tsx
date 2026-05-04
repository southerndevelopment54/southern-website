"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/vacancies", label: "Vacancies" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <Link href="/" className="text-xl font-bold">
              Security Co
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
        </div>
      )}
    </nav>
  );
}
