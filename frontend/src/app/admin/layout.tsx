"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
