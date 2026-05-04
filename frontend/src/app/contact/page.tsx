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
    toast({ title: "Message sent", description: "We will get back to you soon." });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} required />
          </div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
