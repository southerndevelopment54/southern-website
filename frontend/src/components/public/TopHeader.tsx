"use client";

import { MapPin } from "lucide-react";

export default function TopHeader() {
  return (
    <div className="bg-purple text-white text-xs py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
        <MapPin className="w-3 h-3" />
        <span>香港九龍觀塘成業街16號怡生工業中心A座3樓301室</span>
      </div>
    </div>
  );
}
