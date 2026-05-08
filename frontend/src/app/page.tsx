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
                關於我們的公司
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                香港值得信賴的保安服務
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                南方保安服務十多年來一直為全香港提供專業的保安方案。我們的持牌保安人員團隊
                確保住宅大廈、商業樓宇、零售商戶及特別活動的安全。
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                我們以嚴謹的培訓計劃、現代化設備及對每項任務的卓越承諾而自豪。
              </p>
              <Link href="/about">
                <Button
                  className="text-white font-semibold hover:opacity-90"
                  style={{ backgroundColor: "#51db3d" }}
                >
                  了解更多關於我們
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
                <p className="text-white/60 text-sm">保安員</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg text-center">
                <Users
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "#51db3d" }}
                />
                <h3 className="text-white font-bold text-2xl mb-1">200+</h3>
                <p className="text-white/60 text-sm">服務客戶</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg text-center">
                <MapPin
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "#51db3d" }}
                />
                <h3 className="text-white font-bold text-2xl mb-1">18</h3>
                <p className="text-white/60 text-sm">覆蓋地區</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg text-center">
                <Award
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "#51db3d" }}
                />
                <h3 className="text-white font-bold text-2xl mb-1">15+</h3>
                <p className="text-white/60 text-sm">年經驗</p>
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
              我們的服務
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#1a2447" }}
            >
              專業保安服務
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              全面的保安方案，量身訂製以滿足每位客戶及每個環境的獨特需求。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "住宅保安",
                desc: "為住宅大廈及屋苑提供24/7保安服務，包括出入管理及巡邏。",
              },
              {
                icon: Users,
                title: "商業保安",
                desc: "為辦公大樓、商場及商業物業提供專業保安服務。",
              },
              {
                icon: Clock,
                title: "活動保安",
                desc: "為活動、宴會及特別場合提供人群管理及保安服務。",
              },
              {
                icon: Shield,
                title: "保鏢服務",
                desc: "為需要個人安全保護的貴賓客戶提供近身保護服務。",
              },
              {
                icon: Headphones,
                title: "控制室監控",
                desc: "在我們的中央控制室提供24/7閉路電視監控及警報應對。",
              },
              {
                icon: MapPin,
                title: "流動巡邏",
                desc: "由我們的流動保安隊伍在多個地點進行定期巡邏。",
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
                查看所有服務
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark */}
      <section style={{ backgroundColor: "#1a2447" }} className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            準備好保障您的物業了嗎？
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            立即聯絡我們免費諮詢，了解我們的保安方案如何保護對您最重要的一切。
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact">
              <Button
                className="text-white font-semibold hover:opacity-90 px-8"
                style={{ backgroundColor: "#51db3d" }}
              >
                聯絡我們
              </Button>
            </Link>
            <Link href="/vacancies">
              <Button
                className="bg-transparent text-white border border-white hover:bg-white/10 px-8"
              >
                查看職位空缺
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
