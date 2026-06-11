import { Header, Footer } from "@/components/sections";
import ServicesTabs from "@/components/sections/ServicesTabs";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <SchemaMarkup type="services" />
      <Header />
      <ServicesTabs />
      <Footer />
    </main>
  );
}
