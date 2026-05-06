"use client";

import TopBar from "./TopBar";
import MainHeader from "./MainHeader";
import NavBar from "./NavBar";
import PublicFooter from "./PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed header section */}
      <header className="sticky top-0 z-50 shadow-md">
        <TopBar />
        <MainHeader />
        <NavBar />
      </header>

      {/* Page content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
