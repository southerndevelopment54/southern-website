import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  { title: "住宅保安", desc: "住宅大廈及屋苑的保安工作。" },
  { title: "商業保安", desc: "辦公大樓及商業處所的保安工作。" },
  { title: "零售保安", desc: "商場及零售店鋪的保安工作。" },
  { title: "活動保安", desc: "活動及宴會的人群管理及保安工作。" },
  { title: "保鑣 / 私人保護", desc: "為貴賓客戶提供近身保護服務。" },
  { title: "保安督導員", desc: "監督一隊保安人員。" },
  { title: "控制室操作員", desc: "監控閉路電視及警報系統。" },
  { title: "流動巡邏保安員", desc: "駕車巡邏多個地點。" },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">我們的服務</h1>
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
