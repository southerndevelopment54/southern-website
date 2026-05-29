import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "南方(警衛及管業)有限公司 | Southern Services",
  description: "專業保安服務，守護您的安全。提供全面保安服務，包括商業大廈、住宅、活動及個人保安服務。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="antialiased bg-light text-dark">
        {children}
      </body>
    </html>
  );
}
