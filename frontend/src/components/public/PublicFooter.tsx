"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer style={{ backgroundColor: "#1a2447" }} className="text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">
              南方保安服務
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              香港專業保安服務供應商，為住宅、商業及零售物業提供可靠的保安保障，
              服務遍及全港各區。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-4 h-4" style={{ color: "#51db3d" }} />
                <span>香港九龍新蒲崗五芳街10號新寶中心21樓7室</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Phone className="w-4 h-4" style={{ color: "#51db3d" }} />
                <span>+852 2123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Mail className="w-4 h-4" style={{ color: "#51db3d" }} />
                <span>info@southernsec.com</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="w-4 h-4" style={{ color: "#51db3d" }} />
                <span>星期一至六 09:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">快速連結</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  首頁
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  關於我們
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  服務
                </Link>
              </li>
              <li>
                <Link
                  href="/vacancies"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  職位空缺
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white">我們的服務</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>住宅保安</li>
              <li>商業保安</li>
              <li>活動保安</li>
              <li>保鏢服務</li>
              <li>閉路電視監控</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
          <p>© 2026 南方保安服務有限公司。保留所有權利。</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">
              私隱政策
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              服務條款
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
