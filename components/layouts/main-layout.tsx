"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import AdBanner from "@/components/ads";

interface MainLayoutProps {
  children: React.ReactNode;
}

// Level list and level pages place their own banner inside the content
// (level-list.tsx, level-solution.tsx); every other page gets one above the footer.
const HAS_INLINE_AD = /\/level(\/|$)/;

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname() ?? "";
  return (
    <div className=" flex flex-col bg-background overflow-x-hidden">
      <Header />
      <main className="flex-1">{children}</main>
      {!HAS_INLINE_AD.test(pathname) && <AdBanner className="my-8 px-4" />}
      <Footer />
    </div>
  );
}
