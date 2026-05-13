import { Header, Footer } from "@/components/sections";
import ServicesSection from "@/components/sections/ServicesSection";

export const metadata = {
  title: "服務範圍 | 南方(警衛及管業)有限公司",
  description: "我們提供全面的保安解決方案，包括商業大廈、住宅、活動及個人保安服務。",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-44">
        <ServicesSection />
      </div>
      <Footer />
    </main>
  );
}
