"use client";
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { fetchPhotos } from "@/lib/api";

export default function PhotosPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const { data } = useSWR("photos", () => fetchPhotos());

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    (data ?? []).forEach((photo: { image_tags: { tags: { name: string } | null }[] }) => {
      photo.image_tags.forEach((tag) => {
        if (tag.tags?.name) tagSet.add(tag.tags.name);
      });
    });
    return Array.from(tagSet);
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((photo: { image_tags: { tags: { name: string } | null }[]; projects: { title: string } | null }) => {
      const tags = photo.image_tags
        .map((tag) => tag.tags?.name)
        .filter((name): name is string => Boolean(name));
      const matchesQ = q ? (photo.projects?.title ?? "").toLowerCase().includes(q.toLowerCase()) : true;
      const matchesTags = selected.length === 0 || selected.every((tag) => tags.includes(tag));
      return matchesQ && matchesTags;
    });
  }, [data, q, selected]);

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold">Photos</h1>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="프로젝트 제목 검색"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = selected.includes(tag);
            return (
              <button
                key={tag}
                onClick={() =>
                  setSelected((prev) => (active ? prev.filter((id) => id !== tag) : [...prev, tag]))
                }
                className={`rounded-full border px-3 py-1 text-xs ${active ? "bg-sage-100 border-sage-200 text-sage-800" : "hover:bg-accent"}`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="masonry columns-1 sm:columns-2 lg:columns-3">
        {filtered.map((photo: {
          id: string;
          projects: { slug: string; title: string } | null;
          image_url: string;
        }) => {
          const project = photo.projects;
          const href = project ? `/projects/${project.slug}` : undefined;
          return href ? (
            <Link key={photo.id} href={href} className="block overflow-hidden rounded-lg">
              <img
                src={photo.image_url}
                alt={project?.title ?? "프로젝트 이미지"}
                className="w-full object-cover transition-transform hover:scale-[1.02]"
              />
              <div className="p-2 text-xs text-muted-foreground">{project?.title}</div>
            </Link>
          ) : (
            <div key={photo.id} className="block overflow-hidden rounded-lg">
              <img src={photo.image_url} alt="프로젝트 이미지" className="w-full object-cover" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
