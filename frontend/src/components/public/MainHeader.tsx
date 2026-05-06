"use client";

import { Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";

export default function MainHeader() {
  return (
    <div className="w-full bg-white py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/images/hero/southern_service_logo.png"
            alt="南方保安服務"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        {/* Contact Details */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#1a2447" }}
            >
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">電話</p>
              <p className="font-semibold" style={{ color: "#1a2447" }}>
                +852 2123 4567
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#1a2447" }}
            >
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">電郵</p>
              <p className="font-semibold" style={{ color: "#1a2447" }}>
                info@southernsec.com
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#1a2447" }}
            >
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">辦公時間</p>
              <p className="font-semibold" style={{ color: "#1a2447" }}>
                星期一至六 09:00 - 18:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
