"use client";

import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "訊息已發送", description: "我們會盡快回覆您。" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold mb-6">聯絡我們</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">姓名</Label>
            <Input id="name" required />
          </div>
          <div>
            <Label htmlFor="email">電郵</Label>
            <Input id="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="message">訊息</Label>
            <Textarea id="message" rows={5} required />
          </div>
          <Button type="submit" className="w-full">發送訊息</Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
