import { I18nProvider } from "@/components/I18nProvider";
import { Toaster } from "@/components/ui/toaster";

export async function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale === "en" ? "en" : "zh";

  return (
    <I18nProvider initialLocale={locale}>
      {children}
      <Toaster />
    </I18nProvider>
  );
}
