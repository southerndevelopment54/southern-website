import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About Security Co</h1>
        <p className="text-muted-foreground mb-4">
          Security Co is a licensed security company based in Hong Kong, providing reliable and professional security services across the territory.
        </p>
        <p className="text-muted-foreground mb-4">
          Our team consists of highly trained security personnel with valid permits and extensive experience in residential, commercial, retail, and event security.
        </p>
        <p className="text-muted-foreground">
          We are committed to safeguarding people and property with integrity, vigilance, and excellence.
        </p>
      </main>
      <Footer />
    </div>
  );
}
