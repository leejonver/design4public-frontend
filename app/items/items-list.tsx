"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetchItems } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemsSkeleton } from "./items-skeleton";
import { addCacheBuster } from "@/lib/utils";

function useItemFilters() {
  if (typeof window === "undefined") return { q: "", brands: [], tags: [] };
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") ?? "";
  const brands = params.get("brands")?.split(",").filter(Boolean) ?? [];
  const tags = params.get("tags")?.split(",").filter(Boolean) ?? [];
  return { q, brands, tags };
}

export function ItemsList() {
  const filters = useItemFilters();
  const { data, error, isLoading } = useSWR(["items-list", filters], async () => {
    const allItems = await fetchItems();

    let filtered = allItems;

    // 검색어 필터링
    if (filters.q) {
      const keyword = filters.q.toLowerCase();
      filtered = filtered.filter((item: any) => {
        const itemTags = item.item_tags?.map((it: any) => it.tags?.name ?? "").join(" ") ?? "";
        const text = [item.name, item.description, itemTags].join(" ").toLowerCase();
        return text.includes(keyword);
      });
    }

    // 브랜드 필터링
    if (filters.brands.length) {
      filtered = filtered.filter((item: any) => item.brand_id && filters.brands.includes(item.brand_id));
    }

    // 태그 필터링
    if (filters.tags.length) {
      filtered = filtered.filter((item: any) =>
        item.item_tags?.some((it: any) => it.tag_id && filters.tags.includes(it.tag_id))
      );
    }

    return filtered;
  });

  if (isLoading) return <ItemsSkeleton />;
  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
        아이템 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </div>
    );
  }

  const items = data ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item: any) => {
        const tags = item.item_tags
          ?.map((it: any) => (it.tags?.type === "item" ? it.tags?.name : undefined))
          .filter((name: string | undefined): name is string => Boolean(name)) ?? [];

        return (
          <Card key={item.id} className="group">
            <Link href={`/items/${item.slug}`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={addCacheBuster(item.image_url)}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <CardHeader>
              <CardTitle className="text-base">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="muted">브랜드</Badge>
                {item.brands ? (
                  <Link href={`/brands/${item.brands.slug}`} className="hover:underline">
                    {item.brands.name_ko}
                  </Link>
                ) : (
                  <span>미등록</span>
                )}
              </div>
              {item.nara_url ? (
                <div className="mt-2 text-xs">
                  <a href={item.nara_url} target="_blank" className="text-sage-700 underline">
                    나라장터종합쇼핑몰 URL
                  </a>
                </div>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

