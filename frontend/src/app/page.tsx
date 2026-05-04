import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
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
              香港專業保安服務
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              為住宅、商業及零售物業提供全港各區可信賴的專業保安保障。
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/vacancies">
                <Button size="lg">瀏覽職位空缺</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white">
                  聯絡我們
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border">
              <Shield className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">經驗豐富的保安員</h3>
              <p className="text-muted-foreground">
                所有人員均持有有效的保安人員許可證。
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border">
              <MapPin className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">全港覆蓋</h3>
              <p className="text-muted-foreground">
                服務香港全部18個地區。
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border">
              <Users className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">度身訂造方案</h3>
              <p className="text-muted-foreground">
                為每位客戶量身定制保安計劃。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
