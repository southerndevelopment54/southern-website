import {
  Header,
  HeroCarousel,
  AboutSection,
  ServicesSection,
  WhyChooseUs,
  TrustedCompanies,
  GetInTouch,
  Footer,
} from "@/components/sections";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SchemaMarkup type="home" />
      <Header />
      <HeroCarousel />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUs />
      <TrustedCompanies />
      <GetInTouch />
      <Footer />
    </main>
  );
}
