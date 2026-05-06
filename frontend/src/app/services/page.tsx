import PublicLayout from "@/components/public/PublicLayout";
import PageBanner from "@/components/public/PageBanner";
import { Shield, Users, Clock, Headphones, MapPin, Crosshair } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "Residential Security",
    desc: "24/7 guard services for residential buildings and estates with access control, visitor management, and regular patrols to ensure resident safety.",
  },
  {
    icon: Users,
    title: "Commercial Security",
    desc: "Professional security for office buildings, shopping malls, and commercial premises including access control, surveillance, and emergency response.",
  },
  {
    icon: Shield,
    title: "Retail Security",
    desc: "Guard duty at shopping malls and retail stores with loss prevention, customer safety, and asset protection services.",
  },
  {
    icon: Clock,
    title: "Event Security",
    desc: "Crowd control and security management for events, functions, and special occasions of any scale across Hong Kong.",
  },
  {
    icon: Crosshair,
    title: "Bodyguard / Personal Protection",
    desc: "Close protection services for VIP clients requiring personal security detail with highly trained executive protection officers.",
  },
  {
    icon: Headphones,
    title: "Control Room Operator",
    desc: "24/7 CCTV monitoring and alarm systems management from our central control room with rapid incident response.",
  },
  {
    icon: MapPin,
    title: "Mobile Patrol Guard",
    desc: "Regular patrols across multiple sites by our mobile security teams providing flexible and cost-effective coverage.",
  },
  {
    icon: Shield,
    title: "Security Supervisor",
    desc: "Experienced supervisors to oversee security operations, manage guard teams, and ensure compliance with protocols.",
  },
];

export default function ServicesPage() {
  return (
    <PublicLayout>
      <PageBanner title="Our Services" subtitle="Comprehensive security solutions for every need" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium mb-3 tracking-wide uppercase" style={{ color: "#51db3d" }}>
              What We Offer
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1a2447" }}>
              Professional Security Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a full range of security services tailored to meet the unique 
              requirements of residential, commercial, and retail clients across Hong Kong.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#1a2447" }}
                >
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#1a2447" }}>
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
