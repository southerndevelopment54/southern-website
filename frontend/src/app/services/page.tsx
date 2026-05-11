import PublicLayout from "@/components/public/PublicLayout";
import PageBanner from "@/components/public/PageBanner";
import { Shield, Users, Clock, Headphones, MapPin, Crosshair } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "住宅保安",
    desc: "為住宅大廈及屋苑提供24/7保安服務，包括出入管理、訪客登記及定期巡邏，確保住客安全。",
  },
  {
    icon: Users,
    title: "商業保安",
    desc: "為辦公大樓、商場及商業物業提供專業保安服務，包括出入管理、監控及緊急應變。",
  },
  {
    icon: Shield,
    title: "零售保安",
    desc: "為商場及零售店舖提供保安服務，包括防損、顧客安全及資產保護。",
  },
  {
    icon: Clock,
    title: "活動保安",
    desc: "為全港各類活動、宴會及特別場合提供人群管理及保安服務，不論規模大小。",
  },
  {
    icon: Crosshair,
    title: "保鏢 / 個人保護",
    desc: "為需要個人安全保護的貴賓客戶提供近身保護服務，由高度訓練的行政保護人員執行。",
  },
  {
    icon: Headphones,
    title: "控制室操作員",
    desc: "在我們的中央控制室提供24/7閉路電視監控及警報系統管理，並作快速事故應變。",
  },
  {
    icon: MapPin,
    title: "流動巡邏保安",
    desc: "由我們的流動保安隊伍在多個地點進行定期巡邏，提供靈活且具成本效益的覆蓋。",
  },
  {
    icon: Shield,
    title: "保安主管",
    desc: "經驗豐富的保安主管負責監督保安運作、管理保安團隊及確保符合協議規定。",
  },
];

export default function ServicesPage() {
  return (
    <PublicLayout>
      <PageBanner title="我們的服務" subtitle="為各種需求提供全面的保安方案" image="/images/about/guard_assisting.png" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium mb-3 tracking-wide uppercase" style={{ color: "#51db3d" }}>
              我們的服務
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1a2447" }}>
              專業保安服務
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              我們提供全面的保安服務，量身訂製以滿足住宅、商業及零售客戶的獨特需求。
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
