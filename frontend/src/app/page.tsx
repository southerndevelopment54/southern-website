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

export default function Home() {
  return (
    <main className="min-h-screen">
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
