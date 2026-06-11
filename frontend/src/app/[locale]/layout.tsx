import { I18nProvider } from "@/components/I18nProvider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "/white-ssl-logo-transparent-bg.png",
    apple: "/white-ssl-logo-transparent-bg.png",
  },
};

export async function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }, { locale: "cn" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: paramLocale } = await params;
  const locale = (["zh", "en", "cn"] as string[]).includes(paramLocale)
    ? (paramLocale as "zh" | "en" | "cn")
    : "zh";

  return (
    <I18nProvider initialLocale={locale}>
      {children}
      <Toaster />
    </I18nProvider>
  );
}
