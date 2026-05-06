import PublicLayout from "@/components/public/PublicLayout";
import HomeCarousel from "@/components/public/HomeCarousel";
import VacancyShowcase from "@/components/public/VacancyShowcase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Users, MapPin, Award, Clock, Headphones } from "lucide-react";

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Carousel */}
      <HomeCarousel />

      {/* About Section - Dark */}
      <section style={{ backgroundColor: "#1a2447" }} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-sm font-medium mb-3 tracking-wide uppercase"
                style={{ color: "#51db3d" }}
              >
                About Our Company
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Trusted Security Services in Hong Kong
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Southern Security Services has been providing professional
                security solutions across Hong Kong for over a decade. Our team
                of licensed security personnel ensures the safety of residential
                complexes, commercial buildings, retail establishments, and
                special events.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                We pride ourselves on our rigorous training programs, modern
                equipment, and commitment to excellence in every assignment.
              </p>
              <Link href="/about">
                <Button
                  className="text-white font-semibold hover:opacity-90"
                  style={{ backgroundColor: "#51db3d" }}
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-6 rounded-lg text-center">
                <Shield
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "#51db3d" }}
                />
                <h3 className="text-white font-bold text-2xl mb-1">500+</h3>
                <p className="text-white/60 text-sm">Security Guards</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg text-center">
                <Users
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "#51db3d" }}
                />
                <h3 className="text-white font-bold text-2xl mb-1">200+</h3>
                <p className="text-white/60 text-sm">Clients Served</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg text-center">
                <MapPin
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "#51db3d" }}
                />
                <h3 className="text-white font-bold text-2xl mb-1">18</h3>
                <p className="text-white/60 text-sm">Districts Covered</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg text-center">
                <Award
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "#51db3d" }}
                />
                <h3 className="text-white font-bold text-2xl mb-1">15+</h3>
                <p className="text-white/60 text-sm">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - White */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p
              className="text-sm font-medium mb-3 tracking-wide uppercase"
              style={{ color: "#51db3d" }}
            >
              What We Offer
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#1a2447" }}
            >
              Our Security Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive security solutions tailored to meet the unique
              needs of every client and environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Residential Security",
                desc: "24/7 guard services for residential buildings and estates with access control and patrols.",
              },
              {
                icon: Users,
                title: "Commercial Security",
                desc: "Professional security for office buildings, shopping malls, and commercial premises.",
              },
              {
                icon: Clock,
                title: "Event Security",
                desc: "Crowd control and security management for events, functions, and special occasions.",
              },
              {
                icon: Shield,
                title: "Bodyguard Services",
                desc: "Close protection services for VIP clients requiring personal security detail.",
              },
              {
                icon: Headphones,
                title: "Control Room Monitoring",
                desc: "24/7 CCTV monitoring and alarm response from our central control room.",
              },
              {
                icon: MapPin,
                title: "Mobile Patrol",
                desc: "Regular patrols across multiple sites by our mobile security teams.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#1a2447" }}
                >
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#1a2447" }}
                >
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/services">
              <Button
                variant="outline"
                className="font-semibold"
                style={{ borderColor: "#1a2447", color: "#1a2447" }}
              >
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark */}
      <section style={{ backgroundColor: "#1a2447" }} className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Secure Your Property?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contact us today for a free consultation and discover how our
            security solutions can protect what matters most to you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact">
              <Button
                className="text-white font-semibold hover:opacity-90 px-8"
                style={{ backgroundColor: "#51db3d" }}
              >
                Contact Us
              </Button>
            </Link>
            <Link href="/vacancies">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/10 px-8"
              >
                View Vacancies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vacancy Showcase */}
      <VacancyShowcase />
    </PublicLayout>
  );
}
