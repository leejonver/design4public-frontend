"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { fetchItems } from "@/lib/api";
import { ItemCard } from "@/components/item-card";
import { ItemsSkeleton } from "./items-skeleton";
import { addCacheBuster } from "@/lib/utils";

type ItemFilters = {
  q: string;
  categories: string[];
  brands: string[];
};

function useItemFilters() {
  const [filters, setFilters] = useState<ItemFilters>({ q: "", categories: [], brands: [] });

  useEffect(() => {
    const updateFilters = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") ?? "";
      const categories = params.get("categories")?.split(",").filter(Boolean) ?? [];
      const brands = params.get("brands")?.split(",").filter(Boolean) ?? [];
      setFilters({ q, categories, brands });
    };

    updateFilters();

    const handleUrlChange = () => updateFilters();
    window.addEventListener("popstate", handleUrlChange);

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleUrlChange();
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleUrlChange();
    };

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return filters;
}

export function ItemsList() {
  const filters = useItemFilters();
  const { data, error, isLoading } = useSWR(["items-list", JSON.stringify(filters)], async () => {
    const allItems = await fetchItems();

    let filtered = allItems;

    // Search filter
    if (filters.q) {
      const keyword = filters.q.toLowerCase();
      filtered = filtered.filter((item: any) => {
        const itemTags = item.item_tags?.map((it: any) => it.tags?.name ?? "").join(" ") ?? "";
        const text = [item.name, item.description, itemTags].join(" ").toLowerCase();
        return text.includes(keyword);
      });
    }

    // Category filter (matches item tags)
    if (filters.categories.length > 0) {
      filtered = filtered.filter((item: any) => {
        const itemTags = item.item_tags
          ?.map((it: any) => it.tags?.name)
          .filter(Boolean) ?? [];
        return filters.categories.some(cat => itemTags.includes(cat));
      });
    }

    // Brand filter
    if (filters.brands.length) {
      filtered = filtered.filter((item: any) => item.brand_id && filters.brands.includes(item.brand_id));
    }

    return filtered;
  });

  if (isLoading) return <ItemsSkeleton />;
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
        <p className="font-medium">데이터 로딩 오류</p>
        <p className="mt-1 text-destructive/80">아이템 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }

  const items = data ?? [];

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center">
        <p className="text-neutral-600 font-medium">검색 결과가 없습니다</p>
        <p className="mt-1 text-sm text-neutral-500">다른 검색어나 필터를 사용해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 stagger-children">
      {items.map((item: any) => {
        // Get the first category tag for display
        const categoryTag = item.item_tags
          ?.find((it: any) => it.tags?.type === "item")?.tags?.name ?? null;

        return (
          <ItemCard
            key={item.id}
            href={`/items/${item.slug}`}
            name={item.name}
            category={categoryTag}
            imageUrl={addCacheBuster(item.image_url)}
          />
        );
      })}
    </div>
  );
}
