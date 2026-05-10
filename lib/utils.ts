import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureTrailingSlash(path: string): string {
  const cleanPath = path.endsWith("/") ? path : `${path}/`;
  return cleanPath;
}
