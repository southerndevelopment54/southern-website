"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

export default function GetInTouch({ showForm = false }: { showForm?: boolean }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const { toast } = useToast();

  const isContactPage = pathname.startsWith(`/${locale}/contact`);

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    serviceType: "",
    message: "",
  });

  const contactDetails = [
    {
      icon: Phone,
      label: t.contact.phone,
      value: "+852 2762 8128",
      href: "tel:+85227628128",
    },
    {
      icon: Mail,
      label: t.contact.email,
      value: "info@southern.hk",
      href: "mailto:info@southern.hk",
    },

    {
      icon: MapPin,
      label: t.contact.address,
      value: t.contact.addressValue,
      href: isContactPage ? "#our-location" : `/${locale}/contact#our-location`,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isContactPage) {
          e.preventDefault();
          document.getElementById("our-location")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      },
    },
    {
      icon: Clock,
      label: t.contact.hours,
      value: t.contact.officeHours,
      href: "#",
      disabled: true,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault(),
    },
  ];

  const serviceOptions = t.services.items.map((item) => item.title);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.company.trim() || !form.serviceType.trim() || !form.message.trim()) {
      toast({ title: "錯誤", description: "請填寫所有欄位", variant: "destructive" });
      return;
    }
    try {
      await api.post("/contact", form);
      toast({
        title: t.contact.successTitle,
        description: t.contact.successMessage,
      });
      setForm({
        name: "",
        company: "",
        phone: "",
        email: "",
        serviceType: "",
        message: "",
      });
    } catch (err) {
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      const backendMsg = e.response?.data?.message;
      if (e.response?.status === 429) {
        toast({
          title: "提交過於頻繁",
          description: "請稍候一分鐘後再試。",
          variant: "destructive",
        });
      } else {
        toast({
          title: "提交失敗",
          description: backendMsg || "請稍後再試。",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Image + Contact Details */}
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${showForm ? "mb-20" : ""}`}>
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/images/phone_holding.png"
                alt={t.contact.badge}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right - Contact Details */}
          <div>
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              {t.contact.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              {t.contact.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              {t.contact.description}
            </p>

            <div className="space-y-6">
              {contactDetails.map((detail, index) => (
                <a
                  key={index}
                  href={detail.href}
                  onClick={detail.onClick}
                  className={`flex items-start gap-4 ${detail.disabled ? "cursor-default" : "group"}`}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white text-primary transition-colors duration-200">
                    <detail.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">{detail.label}</div>
                    <div className={`font-semibold transition-colors ${detail.disabled ? "text-dark" : "text-dark group-hover:text-primary"}`}>
                      <span>{detail.value}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section — only on Contact page */}
        {showForm && (
          <div id="our-location" className="mb-20 scroll-mt-40">
            <h3 className="text-2xl md:text-3xl font-bold text-dark mb-6 text-center">
              {t.contact.ourLocation}
            </h3>
            <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=22.33794902448044,114.19973059717107&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>
          </div>
        )}

        {/* Bottom Section: Inquiry Form */}
        {showForm && (
        <div id="inquiry" className="max-w-4xl mx-auto scroll-mt-40">
          <div className="bg-off-white rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-dark mb-2">
                {t.contact.inquiryTitle}
              </h3>
              <p className="text-gray-600">{t.contact.inquirySubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">{t.contact.name} <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder={t.contact.namePlaceholder}
                    required
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company">{t.contact.company} <span className="text-red-500">*</span></Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    placeholder={t.contact.companyPlaceholder}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.contact.phoneLabel} <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder={t.contact.phonePlaceholder}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t.contact.emailLabel} <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={t.contact.emailPlaceholder}
                    required
                  />
                </div>
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType">{t.contact.serviceType} <span className="text-red-500">*</span></Label>
                <Select
                  value={form.serviceType}
                  onValueChange={(value) => handleChange("serviceType", value)}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder={t.contact.servicePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">{t.contact.message} <span className="text-red-500">*</span></Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder={t.contact.messagePlaceholder}
                  rows={5}
                  required
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-primary hover:bg-primary-light text-white px-8 py-3 h-auto text-base font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t.contact.submit}
                </Button>
              </div>
            </form>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
