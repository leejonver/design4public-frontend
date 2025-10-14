"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchProjects, fetchBrands, fetchTags } from "@/lib/api";

type BrandFilter = { id: string; name: string };
type TagFilter = { id: string; name: string };

export function ProjectsFilter() {
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: projects } = useSWR("projects-filter", () => fetchProjects());
  const { data: brands } = useSWR("brands-filter", () => fetchBrands());
  const { data: tags } = useSWR("tags-filter", () => fetchTags());

  const brandOptions: BrandFilter[] = useMemo(() => {
    return (brands ?? []).map((b: { id: string; name_ko: string; name_en: string | null }) => ({ 
      id: b.id, 
      name: b.name_ko || b.name_en || '이름 없음' 
    }));
  }, [brands]);

const tagOptions: TagFilter[] = useMemo(() => {
  return (tags ?? [])
    .filter((t: { id: string; name: string; type?: string }) => !t.type || t.type === "project")
    .map((t: { id: string; name: string }) => ({ id: t.id, name: t.name }));
}, [tags]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (search) params.set("q", search);
    else params.delete("q");

    if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
    else params.delete("brands");

    if (selectedTags.length) params.set("tags", selectedTags.join(","));
    else params.delete("tags");

    const next = `${url.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", next);
  }, [search, selectedBrands, selectedTags]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-base font-semibold">필터</h2>
        <Input
          placeholder="검색 (제목, 설명, 태그)"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          총 {projects?.length ?? 0}개의 프로젝트가 등록되어 있습니다.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">브랜드</h3>
        <div className="space-y-2">
          {brandOptions.map((brand) => {
            const checked = selectedBrands.includes(brand.id);
            return (
              <label key={brand.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    setSelectedBrands((prev) =>
                      value ? [...prev, brand.id] : prev.filter((id) => id !== brand.id)
                    )
                  }
                />
                {brand.name}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">태그</h3>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => {
            const active = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() =>
                  setSelectedTags((prev) =>
                    active ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                  )
                }
                className={`rounded-full border px-3 py-1 text-xs ${active ? "bg-sage-100 border-sage-200 text-sage-800" : "hover:bg-accent"}`}
              >
                #{tag.name}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={() => {
          setSearch("");
          setSelectedBrands([]);
          setSelectedTags([]);
        }}
      >
        필터 초기화
      </Button>
    </div>
  );
}

