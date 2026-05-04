import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import VacancyShowcase from "@/components/public/VacancyShowcase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Users, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-slate-900 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Security Services in Hong Kong
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Trusted protection for residential, commercial, and retail properties across all districts.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/vacancies">
                <Button size="lg">View Vacancies</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border">
              <Shield className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Experienced Guards</h3>
              <p className="text-muted-foreground">
                All personnel hold valid Security Personnel Permits.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border">
              <MapPin className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Island-wide Coverage</h3>
              <p className="text-muted-foreground">
                Serving all 18 districts across Hong Kong.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border">
              <Users className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Tailored Solutions</h3>
              <p className="text-muted-foreground">
                Customized security plans for every client need.
              </p>
            </div>
          </div>
        </section>

        <VacancyShowcase />
      </main>
      <Footer />
    </div>
  );
}
