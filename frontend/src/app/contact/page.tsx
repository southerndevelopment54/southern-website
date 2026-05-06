"use client";

import { useState } from "react";
import PublicLayout from "@/components/public/PublicLayout";
import PageBanner from "@/components/public/PageBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast({ title: "訊息已發送", description: "我們會盡快回覆您。" });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({ title: "錯誤", description: "發送訊息失敗，請稍後再試。", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <PageBanner title="聯絡我們" subtitle="與我們的團隊取得聯繫" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <p className="text-sm font-medium mb-3 tracking-wide uppercase" style={{ color: "#51db3d" }}>
                聯絡我們
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#1a2447" }}>
                聯絡資訊
              </h2>
              <p className="text-gray-600 mb-8">
                對我們的服務有疑問或想討論您的保安需求？
                歡迎聯絡我們，我們的團隊會盡快回覆。
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#1a2447" }}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "#1a2447" }}>地址</h3>
                    <p className="text-gray-600 text-sm">香港九龍新蒲崗五芳街10號新寶中心21樓7室</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#1a2447" }}>
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "#1a2447" }}>電話</h3>
                    <p className="text-gray-600 text-sm">+852 2123 4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#1a2447" }}>
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "#1a2447" }}>電郵</h3>
                    <p className="text-gray-600 text-sm">info@southernsec.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#1a2447" }}>
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "#1a2447" }}>辦公時間</h3>
                    <p className="text-gray-600 text-sm">星期一至六 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6" style={{ color: "#1a2447" }}>發送訊息給我們</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">姓名</Label>
                  <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">電郵</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="message">訊息</Label>
                  <Textarea id="message" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <Button
                  type="submit"
                  className="w-full text-white font-semibold hover:opacity-90"
                  style={{ backgroundColor: "#51db3d" }}
                  disabled={loading}
                >
                  {loading ? "發送中..." : "發送訊息"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
