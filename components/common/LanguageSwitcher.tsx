"use client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { langSwitcherData } from "./LangSwitcherData";

export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const currentLangData = langSwitcherData.find(
    (item) => item.locale === locale
  );

  const getNewPath = (target: string) => {
    const segments = pathname?.split("/") || [];
    if (locale === "en") {
      // English has no locale prefix — insert the target locale
      segments.splice(1, 0, target);
    } else {
      // Other locales have the locale in segments[1]
      segments[1] = target;
    }
    return segments.join("/");
  };

  return (
    <div className="group relative">
      <button
        type="button"
        className="peer inline-flex items-center gap-2 rounded-xl px-3 h-10 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        aria-haspopup="menu"
      >
        {currentLangData?.icon && (
          <Image
            src={currentLangData.icon}
            alt={currentLangData.name || ""}
            width={18}
            height={18}
            className="rounded-sm"
          />
        )}
        <span className="hidden sm:inline-block whitespace-nowrap">
          {currentLangData?.name}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:rotate-180" />
      </button>

      <div
        role="menu"
        className="invisible absolute right-0 mt-2 w-52 rounded-2xl border bg-popover shadow-xl z-100 peer-hover:visible hover:visible peer-focus-visible:visible transition-all overflow-hidden"
      >
        <div className="max-h-[60vh] overflow-y-auto py-1.5">
          {langSwitcherData
            .filter((item) => item.locale !== locale)
            .map((item) => (
              <Link
                key={item.locale}
                href={getNewPath(item.locale)}
                role="menuitem"
                className="flex items-center gap-3 px-3 py-2 mx-1.5 rounded-lg text-sm hover:bg-secondary transition-colors"
              >
                <Image
                  src={item.icon}
                  alt={item.name}
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
    </div>
  );
}
