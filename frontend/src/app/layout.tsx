import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "南方保安服務 - 香港專業保安服務",
  description: "香港專業保安服務供應商，提供住宅、商業及零售保安服務",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
