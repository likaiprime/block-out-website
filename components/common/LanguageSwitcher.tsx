"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { langSwitcherData } from "./LangSwitcherData";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const currentLangData = langSwitcherData.find((item) => item.locale === locale);

  const getNewPath = (target: string) => {
    const segments = pathname?.split("/") || [];
    if (locale === "en") {
      segments.splice(1, 0, target);
    } else {
      segments[1] = target;
    }
    return segments.join("/");
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-2.5 sm:px-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        {currentLangData?.icon && (
          <Image
            src={currentLangData.icon}
            alt=""
            width={18}
            height={18}
            className="rounded-sm"
          />
        )}
        <span className="hidden sm:inline-block whitespace-nowrap max-w-[7rem] truncate">
          {currentLangData?.name}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 rounded-2xl border bg-popover shadow-xl z-[100] overflow-hidden animate-fade-in"
        >
          <div className="max-h-[min(60vh,20rem)] overflow-y-auto overscroll-contain py-1.5">
            {langSwitcherData
              .filter((item) => item.locale !== locale)
              .map((item) => (
                <Link
                  key={item.locale}
                  href={getNewPath(item.locale)}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center gap-3 px-3 py-2 mx-1.5 rounded-lg text-sm hover:bg-secondary transition-colors"
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={18}
                    height={18}
                    className="rounded-sm shrink-0"
                    style={{ height: "auto" }}
                  />
                  <span className="text-foreground font-medium">{item.name}</span>
                </Link>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
