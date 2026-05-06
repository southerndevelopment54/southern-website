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
              Southern Security Services
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Professional security services provider in Hong Kong. We deliver
              trusted protection for residential, commercial, and retail
              properties across all districts.
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
                <span>Mon - Sat 09:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/vacancies"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Vacancies
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Our Services</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Residential Security</li>
              <li>Commercial Security</li>
              <li>Event Security</li>
              <li>Bodyguard Services</li>
              <li>CCTV Monitoring</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
          <p>© 2026 Southern Security Services. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
