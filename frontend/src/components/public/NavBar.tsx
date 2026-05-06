"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "關於我們" },
  { href: "/services", label: "服務" },
  { href: "/vacancies", label: "職位空缺" },
  { href: "/contact", label: "聯絡我們" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="w-full z-50"
      style={{ backgroundColor: "#1a2447" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-3 text-sm font-medium transition-colors"
                style={{
                  color: isActive ? "#51db3d" : "#ffffff",
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: "#51db3d" }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
