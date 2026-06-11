"use client";

import { useState, useEffect } from "react";
import { Header, Footer } from "@/components/sections";
import { useI18n } from "@/components/I18nProvider";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface AppreciationLetter {
  id: number;
  date: string;
  imageKey: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AboutPage() {
  const { t } = useI18n();
  const [letters, setLetters] = useState<AppreciationLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<AppreciationLetter | null>(null);

  const regionImages = [
    { src: "/images/hongkongislandlogo.png", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { src: "/images/kowloonlogo.png", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { src: "/images/newterriorylogo.png", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ];

  useEffect(() => {
    api.get("/appreciation-letters")
      .then((res) => setLetters(res.data))
      .catch(() => setLetters([]));
  }, []);

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-36 md:pt-44 pb-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
              {t.about.badge}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              {t.about.pageTitle}
            </h1>
          </div>

          {/* Image + Description */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-12">
            <div className="grid lg:grid-cols-2">
              {/* Image */}
              <div className="h-full min-h-[300px]">
                <img
                  src="/images/southern front desk.png"
                  alt={t.about.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6 leading-tight">
                  {t.about.pageTitle}
                </h2>
                <p className="text-dark leading-relaxed mb-5">
                  <strong className="font-bold">{t.about.companyName}</strong>{" "}
                  {t.about.intro}
                </p>
                <div className="space-y-4 text-gray-600 leading-relaxed whitespace-pre-line">
                  {t.about.description}
                </div>
              </div>
            </div>
          </div>

          {/* Coverage */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 md:p-14 mb-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                {t.about.coverage.title} — {t.about.coverage.subtitle}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t.about.coverage.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.about.coverage.regions.map((region, index) => (
                <div
                  key={index}
                  className={`text-center p-8 rounded-xl border ${regionImages[index].color} bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-1`}
                >
                  <div className="w-40 h-40 flex items-center justify-center mx-auto mb-5">
                    <img
                      src={regionImages[index].src}
                      alt={region}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{region}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 md:p-14 text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              {t.about.vision.title}
            </h2>
            {t.about.vision.subtitle && (
              <p className="text-lg md:text-xl text-dark font-medium mb-5">
                {t.about.vision.subtitle}
              </p>
            )}
            <div className="space-y-5 text-gray-600 leading-relaxed max-w-2xl mx-auto text-center">
              {t.about.vision.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Appreciation Letters */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 md:p-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
                {t.about.letters.badge}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-dark">
                {t.about.letters.title}
              </h2>
            </div>
            {letters.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {letters.map((letter) => (
                  <button
                    key={letter.id}
                    onClick={() => setSelectedLetter(letter)}
                    className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <div className="aspect-[3/4] p-3">
                      <img
                        src={letter.imageUrl}
                        alt={letter.date}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                {t.about.letters.title}
              </div>
            )}
          </div>
        </div>
      </section>

      <Dialog open={selectedLetter !== null} onOpenChange={() => setSelectedLetter(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-2 bg-white border-0">
          <DialogTitle className="sr-only">
            {selectedLetter?.date}
          </DialogTitle>
          {selectedLetter !== null && (
            <img
              src={selectedLetter.imageUrl}
              alt={selectedLetter.date}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
