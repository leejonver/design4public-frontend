import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArea(m2?: number) {
  if (!m2) return "-";
  return `${m2.toLocaleString()} ㎡`;
}

