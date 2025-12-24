"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchItems, fetchBrands } from "@/lib/api";
import { Search, X, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Fixed item categories
const ITEM_CATEGORIES = [
  { id: "Table", name: "Table" },
  { id: "Sofa Table", name: "Sofa Table" },
  { id: "Desk", name: "Desk" },
  { id: "Storage", name: "Storage" },
  { id: "Chair", name: "Chair" },
  { id: "Stool Sofa", name: "Stool Sofa" },
  { id: "Others", name: "Others" },
];

type BrandOption = { id: string; name_ko: string; name_en: string | null };

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}

function FilterSection({ title, children, defaultOpen = true, count }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 group-hover:text-neutral-900">
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-2xs font-medium bg-sage-600 text-white rounded-full">
              {count}
            </span>
          )}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600" />
        )}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function ItemsFilter() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const { data: items } = useSWR("items-filter", () => fetchItems());
  const { data: brands } = useSWR("brands-filter", () => fetchBrands());

  const brandOptions: BrandOption[] = useMemo(() => {
    return (brands ?? []).map((b: { id: string; name_ko: string; name_en: string | null }) => ({
      id: b.id,
      name_ko: b.name_ko,
      name_en: b.name_en,
    }));
  }, [brands]);

  const totalSelected = selectedCategories.length + selectedBrands.length;

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (search) params.set("q", search);
    else params.delete("q");

    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    else params.delete("categories");

    if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
    else params.delete("brands");

    const next = `${url.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", next);
  }, [search, selectedCategories, selectedBrands]);

  const handleReset = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  return (
    <div className="space-y-0">
      {/* Steelcase-style Search Section */}
      <div className="border-b border-neutral-200 pb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-3">
          Search
        </label>
        <div className="relative">
          <Input
            placeholder="아이템 검색..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pr-9 bg-white border-neutral-300 focus:border-sage-500 focus:ring-sage-500 transition-colors"
          />
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          )}
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          총 <span className="font-semibold text-neutral-700">{items?.length ?? 0}</span>개 아이템
        </p>
      </div>

      {/* Category Filter - Main categories */}
      <FilterSection title="Category" count={selectedCategories.length}>
        <div className="space-y-2">
          {ITEM_CATEGORIES.map((category) => {
            const checked = selectedCategories.includes(category.id);
            return (
              <label
                key={category.id}
                className={cn(
                  "flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors",
                  checked ? "bg-sage-50" : "hover:bg-neutral-50"
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    setSelectedCategories((prev) =>
                      value ? [...prev, category.id] : prev.filter((id) => id !== category.id)
                    )
                  }
                  className="data-[state=checked]:bg-sage-600 data-[state=checked]:border-sage-600"
                />
                <span className={cn("text-sm", checked ? "font-medium text-sage-800" : "text-neutral-600")}>
                  {category.name}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Brands Filter */}
      <FilterSection title="Brands" count={selectedBrands.length} defaultOpen={false}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brandOptions.map((brand) => {
            const checked = selectedBrands.includes(brand.id);
            return (
              <label
                key={brand.id}
                className={cn(
                  "flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors",
                  checked ? "bg-sage-50" : "hover:bg-neutral-50"
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    setSelectedBrands((prev) =>
                      value ? [...prev, brand.id] : prev.filter((id) => id !== brand.id)
                    )
                  }
                  className="data-[state=checked]:bg-sage-600 data-[state=checked]:border-sage-600"
                />
                <span className={cn("text-sm", checked ? "font-medium text-sage-800" : "text-neutral-600")}>
                  {brand.name_ko}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Reset Button */}
      {totalSelected > 0 && (
        <div className="pt-5">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="w-full justify-center gap-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <RotateCcw className="h-4 w-4" />
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  );
}
