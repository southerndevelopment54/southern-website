import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  { title: "Residential Security", desc: "Guard duty at residential buildings and estates." },
  { title: "Commercial Security", desc: "Guard duty at office buildings and commercial premises." },
  { title: "Retail Security", desc: "Guard duty at shopping malls and retail stores." },
  { title: "Event Security", desc: "Crowd control and security at events and functions." },
  { title: "Bodyguard / Personal Protection", desc: "Close protection services for VIP clients." },
  { title: "Security Supervisor", desc: "Supervise a team of security guards." },
  { title: "Control Room Operator", desc: "Monitor CCTV and alarm systems." },
  { title: "Mobile Patrol Guard", desc: "Patrol multiple sites by vehicle." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <Card key={s.title}>
              <CardHeader>
                <CardTitle className="text-lg">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
