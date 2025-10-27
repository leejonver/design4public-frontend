"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchProjects, fetchTags } from "@/lib/api";

type TagFilter = { id: string; name: string };

export function ProjectsFilter() {
  const [search, setSearch] = useState("");
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: projects } = useSWR("projects-filter", () => fetchProjects());
  const { data: tags } = useSWR("tags-filter", () => fetchTags());

  const yearOptions: string[] = useMemo(() => {
    const years = new Set<string>();
    (projects ?? []).forEach((p: any) => {
      if (p.year) years.add(String(p.year));
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [projects]);

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

    if (selectedYears.length) params.set("years", selectedYears.join(","));
    else params.delete("years");

    if (selectedTags.length) params.set("tags", selectedTags.join(","));
    else params.delete("tags");

    const next = `${url.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", next);
  }, [search, selectedYears, selectedTags]);

  return (
    <div className="space-y-6">
      <div>
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
        <h3 className="mb-2 text-sm font-medium">Completion Date</h3>
        <div className="space-y-2">
          {yearOptions.map((year) => {
            const checked = selectedYears.includes(year);
            return (
              <label key={year} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) =>
                    setSelectedYears((prev) =>
                      value ? [...prev, year] : prev.filter((y) => y !== year)
                    )
                  }
                />
                {year}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Tags</h3>
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
          setSelectedYears([]);
          setSelectedTags([]);
        }}
      >
        필터 초기화
      </Button>
    </div>
  );
}

