"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-purple text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/hero/southern_service_logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">Southern Service</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              我們致力為香港各類型物業提供專業、可靠的保安服務，守護您的安全是我們的使命。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">快速連結</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="hover:text-green cursor-pointer transition-colors">首頁</li>
              <li className="hover:text-green cursor-pointer transition-colors">關於我們</li>
              <li className="hover:text-green cursor-pointer transition-colors">服務範圍</li>
              <li className="hover:text-green cursor-pointer transition-colors">職位空缺</li>
              <li className="hover:text-green cursor-pointer transition-colors">聯絡我們</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">聯絡我們</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-green flex-shrink-0" />
                <span>香港九龍觀塘成業街16號怡生工業中心A座3樓301室</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green flex-shrink-0" />
                <span>+852 2345 6789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green flex-shrink-0" />
                <span>info@southern-service.hk</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-green flex-shrink-0" />
                <span>星期一至六: 09:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Southern Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
