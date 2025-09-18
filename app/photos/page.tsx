"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { photos, projects, items } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";

export default function PhotosPage() {
  const [q, setQ] = useState("");
  const allTags = useMemo(() => Array.from(new Set(photos.flatMap((p) => p.tags))).sort(), []);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return photos.filter((p) => {
      const matchesQ = q ? `${p.alt} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase()) : true;
      const matchesTags = selected.length === 0 || selected.every((t) => p.tags.includes(t));
      return matchesQ && matchesTags;
    });
  }, [q, selected]);

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold">Photos</h1>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input placeholder="사진 검색" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => {
            const active = selected.includes(t);
            return (
              <button
                key={t}
                onClick={() => setSelected((prev) => (active ? prev.filter((x) => x !== t) : [...prev, t]))}
                className={`rounded-full border px-3 py-1 text-xs ${active ? "bg-sage-100 border-sage-200 text-sage-800" : "hover:bg-accent"}`}
              >
                #{t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="masonry columns-1 sm:columns-2 lg:columns-3">
        {filtered.map((ph) => {
          const project = ph.projectId ? projects.find((p) => p.id === ph.projectId) : undefined;
          const item = ph.itemId ? items.find((i) => i.id === ph.itemId) : undefined;
          const href = project ? `/projects/${project.slug}` : item ? `/items/${item.slug}` : undefined;
          return href ? (
            <Link key={ph.id} href={href} className="block overflow-hidden rounded-lg">
              <img src={ph.url} alt={ph.alt} className="w-full object-cover transition-transform hover:scale-[1.02]" />
              <div className="p-2 text-xs text-muted-foreground">{ph.alt}</div>
            </Link>
          ) : (
            <div key={ph.id} className="block overflow-hidden rounded-lg">
              <img src={ph.url} alt={ph.alt} className="w-full object-cover" />
              <div className="p-2 text-xs text-muted-foreground">{ph.alt}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
