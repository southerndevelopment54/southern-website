import { Header, Footer } from "@/components/sections";
import CareersSection from "@/components/sections/CareersSection";
import VacanciesSection from "@/components/sections/VacanciesSection";

export const metadata = {
  title: "加入我們 | 南方(警衛及管業)有限公司",
  description: "加入南方警衛團隊，開展您的保安事業。我們提供具競爭力的薪酬、完善培訓及良好晉升機會。",
};

export default function CareersPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-44">
        <CareersSection />
        <VacanciesSection />
      </div>
      <Footer />
    </main>
  );
}
