"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            <nav className="flex gap-4 text-sm">
              <Link href="/admin/dashboard" className="text-slate-700 hover:text-slate-900">儀表板</Link>
              <Link href="/admin/vacancies" className="text-slate-700 hover:text-slate-900">職位空缺</Link>
              <Link href="/admin/submissions" className="text-slate-700 hover:text-slate-900">申請紀錄</Link>
              <Link href="/admin/clients" className="text-slate-700 hover:text-slate-900">合作客戶</Link>
              <Link href="/admin/projects" className="text-slate-700 hover:text-slate-900">合作項目</Link>
              <Link href="/admin/tier-limits" className="text-slate-700 hover:text-slate-900">層級限制</Link>
            </nav>
          </div>
          <Button variant="default" size="sm" className="bg-slate-800 text-white hover:bg-slate-700" onClick={logout}>
            登出
          </Button>
        </header>
      )}
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
