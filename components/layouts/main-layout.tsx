"use client";

import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className=" flex flex-col bg-background overflow-x-hidden">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
