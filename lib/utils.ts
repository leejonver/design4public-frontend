import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArea(m2?: number) {
  if (!m2) return "-";
  return `${m2.toLocaleString()} ㎡`;
}

/**
 * 이미지 URL에 캐시 버스팅 파라미터를 추가합니다.
 * Supabase Storage나 다른 CDN에서 이미지가 업데이트되었을 때
 * 브라우저가 캐시된 이미지 대신 새 이미지를 가져오도록 합니다.
 */
export function addCacheBuster(url: string | null | undefined): string {
  if (!url) return "/placeholder.png";
  
  // 이미 쿼리 파라미터가 있는지 확인
  const separator = url.includes("?") ? "&" : "?";
  
  // 현재 날짜를 기준으로 캐시 버스팅 (하루 단위로 갱신)
  const today = new Date().toISOString().split("T")[0];
  
  return `${url}${separator}v=${today}`;
}

