import { I18nProvider } from "@/components/I18nProvider";
import { Toaster } from "@/components/ui/toaster";

export async function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }, { locale: "cn" }];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = (["zh", "en", "cn"] as string[]).includes(params.locale)
    ? (params.locale as "zh" | "en" | "cn")
    : "zh";

  return (
    <I18nProvider initialLocale={locale}>
      {children}
      <Toaster />
    </I18nProvider>
  );
}
