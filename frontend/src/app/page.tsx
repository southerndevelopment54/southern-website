import TopHeader from "@/components/public/TopHeader";
import MainHeader from "@/components/public/MainHeader";
import Navbar from "@/components/public/Navbar";
import Carousel from "@/components/public/Carousel";
import ServicesSection from "@/components/public/ServicesSection";
import VacanciesPreview from "@/components/public/VacanciesPreview";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopHeader />
      <MainHeader />
      <Navbar />
      <Carousel />
      <ServicesSection />
      <VacanciesPreview />
      <Footer />
    </div>
  );
}
