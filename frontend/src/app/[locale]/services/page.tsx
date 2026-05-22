import { Header, Footer } from "@/components/sections";
import ServicesTabs from "@/components/sections/ServicesTabs";

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ServicesTabs />
      <Footer />
    </main>
  );
}
