"use client";

import Image from "next/image";
import { Mail, Phone, Clock } from "lucide-react";

export default function MainHeader() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Company Info */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src="/images/hero/southern_service_logo.png"
                alt="Southern Service Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-purple tracking-tight">
                Southern Service
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                專業保安服務 · 守護您的安全
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-green" />
              <span>+852 2345 6789</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-green" />
              <span>info@southern-service.hk</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-green" />
              <span>Mon - Sat: 09:00 - 18:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
