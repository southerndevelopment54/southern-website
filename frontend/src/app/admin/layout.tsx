"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout, hydrate } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    hydrate();
    setChecking(false);
  }, [hydrate]);

  useEffect(() => {
    if (!checking && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, pathname, router, checking]);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-muted-foreground">載入中...</div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/admin/login") return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {pathname !== "/admin/login" && (
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg text-slate-900">後台管理</span>
            <nav className="flex gap-1 text-sm">
              {[
                { href: "/admin/dashboard", label: "儀表板" },
                { href: "/admin/vacancies", label: "職位空缺" },
                { href: "/admin/submissions", label: "申請紀錄" },
                { href: "/admin/inquiries", label: "服務查詢" },
                { href: "/admin/clients", label: "合作客戶" },
                { href: "/admin/projects", label: "合作項目" },
                { href: "/admin/tier-limits", label: "精選上限" },
              ].map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Button variant="default" size="sm" className="bg-slate-800 text-white hover:bg-slate-700" onClick={logout}>
            登出
          </Button>
        </header>
      )}
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
      <Toaster />
    </div>
  );
}
