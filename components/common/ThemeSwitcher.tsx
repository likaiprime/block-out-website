"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && (resolvedTheme ?? theme) === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
    >
      {/* Render both pre-mount to avoid SSR mismatch; CSS swaps based on .dark class.  */}
      {!mounted ? (
        <span className="h-5 w-5" />
      ) : isDark ? (
        <Sun className="h-5 w-5" strokeWidth={2.25} />
      ) : (
        <Moon className="h-5 w-5" strokeWidth={2.25} />
      )}
    </button>
  );
}
