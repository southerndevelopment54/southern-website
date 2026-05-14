import { Header, Footer } from "@/components/sections";
import ClientShowcase from "@/components/sections/ClientShowcase";

export const metadata = {
  title: "客戶及合作項目 | 南方警衛",
  description: "瀏覽南方警衛的合作客戶及重點守衛項目，見證我們的專業實力與卓越服務。",
};

export default function ClientsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32">
        <ClientShowcase />
      </div>
      <Footer />
    </main>
  );
}
