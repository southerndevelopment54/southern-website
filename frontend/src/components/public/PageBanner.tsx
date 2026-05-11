"use client";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export default function PageBanner({ title, subtitle, image }: PageBannerProps) {
  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${image || "/images/hero/banner-placeholder.jpg"}')`,
        }}
      />
      {/* Semi-transparent black mask */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Content */}
      <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4 md:px-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/80 text-lg">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
