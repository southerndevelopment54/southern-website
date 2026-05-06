import PublicLayout from "@/components/public/PublicLayout";
import PageBanner from "@/components/public/PageBanner";
import { Shield, Users, Award, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <PublicLayout>
      <PageBanner title="關於我們" subtitle="了解更多關於南方保安服務" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-sm font-medium mb-3 tracking-wide uppercase"
                style={{ color: "#51db3d" }}
              >
                我們是誰
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#1a2447" }}>
                您在香港值得信賴的保安夥伴
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                南方保安服務是一家位於香港的持牌保安公司，為全港提供可靠及專業的保安服務。
                我們的團隊由經過嚴格培訓的持牌保安人員組成，具備豐富的住宅、商業、零售及活動保安經驗。
              </p>
              <p className="text-gray-600 leading-relaxed">
                我們致力以誠信、警覺及卓越的精神保障人們及物業的安全。憑藉超過15年的經驗，
                我們已在香港建立起最值得信賴的保安服務供應商之一的聲譽。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-lg text-center border border-gray-100">
                <Shield className="w-10 h-10 mx-auto mb-3" style={{ color: "#51db3d" }} />
                <h3 className="font-bold text-2xl mb-1" style={{ color: "#1a2447" }}>500+</h3>
                <p className="text-gray-500 text-sm">保安員</p>
              </div>
              <div className="p-6 rounded-lg text-center border border-gray-100">
                <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "#51db3d" }} />
                <h3 className="font-bold text-2xl mb-1" style={{ color: "#1a2447" }}>200+</h3>
                <p className="text-gray-500 text-sm">服務客戶</p>
              </div>
              <div className="p-6 rounded-lg text-center border border-gray-100">
                <Award className="w-10 h-10 mx-auto mb-3" style={{ color: "#51db3d" }} />
                <h3 className="font-bold text-2xl mb-1" style={{ color: "#1a2447" }}>18</h3>
                <p className="text-gray-500 text-sm">覆蓋地區</p>
              </div>
              <div className="p-6 rounded-lg text-center border border-gray-100">
                <Target className="w-10 h-10 mx-auto mb-3" style={{ color: "#51db3d" }} />
                <h3 className="font-bold text-2xl mb-1" style={{ color: "#1a2447" }}>15+</h3>
                <p className="text-gray-500 text-sm">年經驗</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section style={{ backgroundColor: "#1a2447" }} className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-sm font-medium mb-3 tracking-wide uppercase" style={{ color: "#51db3d" }}>
            我們的使命
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            致力於您的安全
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto mb-12">
            我們的使命是提供世界級的保安服務，讓客戶安心無憂。我們通過嚴格的培訓、
            現代化科技及對卓越的不懈追求來實現這一目標。
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "誠信", desc: "我們在所有業務往來中秉持誠實及透明的原則。" },
              { title: "警覺", desc: "時刻保持警惕及主動偵測威脅是我們的標誌。" },
              { title: "卓越", desc: "我們在每項任務中力求達到最高標準。" },
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
