import PublicLayout from "@/components/public/PublicLayout";
import PageBanner from "@/components/public/PageBanner";
import { Shield, Users, Award, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <PublicLayout>
      <PageBanner title="About Us" subtitle="Learn more about Southern Security Services" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-sm font-medium mb-3 tracking-wide uppercase"
                style={{ color: "#51db3d" }}
              >
                Who We Are
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#1a2447" }}>
                Your Trusted Security Partner in Hong Kong
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Southern Security Services is a licensed security company based in Hong Kong, 
                providing reliable and professional security services across the territory. 
                Our team consists of highly trained security personnel with valid permits and 
                extensive experience in residential, commercial, retail, and event security.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We are committed to safeguarding people and property with integrity, vigilance, 
                and excellence. With over 15 years of experience, we have built a reputation as 
                one of the most trusted security providers in Hong Kong.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-lg text-center border border-gray-100">
                <Shield className="w-10 h-10 mx-auto mb-3" style={{ color: "#51db3d" }} />
                <h3 className="font-bold text-2xl mb-1" style={{ color: "#1a2447" }}>500+</h3>
                <p className="text-gray-500 text-sm">Security Guards</p>
              </div>
              <div className="p-6 rounded-lg text-center border border-gray-100">
                <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "#51db3d" }} />
                <h3 className="font-bold text-2xl mb-1" style={{ color: "#1a2447" }}>200+</h3>
                <p className="text-gray-500 text-sm">Clients Served</p>
              </div>
              <div className="p-6 rounded-lg text-center border border-gray-100">
                <Award className="w-10 h-10 mx-auto mb-3" style={{ color: "#51db3d" }} />
                <h3 className="font-bold text-2xl mb-1" style={{ color: "#1a2447" }}>18</h3>
                <p className="text-gray-500 text-sm">Districts Covered</p>
              </div>
              <div className="p-6 rounded-lg text-center border border-gray-100">
                <Target className="w-10 h-10 mx-auto mb-3" style={{ color: "#51db3d" }} />
                <h3 className="font-bold text-2xl mb-1" style={{ color: "#1a2447" }}>15+</h3>
                <p className="text-gray-500 text-sm">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section style={{ backgroundColor: "#1a2447" }} className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-sm font-medium mb-3 tracking-wide uppercase" style={{ color: "#51db3d" }}>
            Our Mission
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Committed to Your Safety
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto mb-12">
            Our mission is to provide world-class security services that give our clients 
            peace of mind. We achieve this through rigorous training, modern technology, 
            and a relentless commitment to excellence.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Integrity", desc: "We operate with honesty and transparency in all our dealings." },
              { title: "Vigilance", desc: "Constant alertness and proactive threat detection are our hallmarks." },
              { title: "Excellence", desc: "We strive for the highest standards in every assignment we undertake." },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
