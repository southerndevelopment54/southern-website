import { Header, Footer } from "@/components/sections";
import GetInTouch from "@/components/sections/GetInTouch";

export const metadata = {
  title: "聯絡我們 | 南方(警衛及管業)有限公司",
  description: "如有任何查詢，歡迎隨時聯絡南方警衛團隊。我們樂意為您提供專業的保安服務建議。",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <GetInTouch showForm />
      </div>
      <Footer />
    </main>
  );
}
