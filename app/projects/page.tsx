"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { projects, brands, items } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { formatArea } from "@/lib/utils";

export default function ProjectsListPage() {
  const [q, setQ] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tags))).sort(),
    []
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesQ = q
        ? [p.title, p.description, ...p.tags].join(" ").toLowerCase().includes(q.toLowerCase())
        : true;
      const matchesBrand =
        selectedBrands.length === 0 || p.brandIds.some((b) => selectedBrands.includes(b));
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((t) => p.tags.includes(t));
      return matchesQ && matchesBrand && matchesTags;
    });
  }, [q, selectedBrands, selectedTags]);

  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-3 space-y-6">
        <div>
          <h2 className="mb-2 text-base font-semibold">필터</h2>
          <Input placeholder="검색 (제목, 설명, 태그)" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium">브랜드</h3>
          <div className="space-y-2">
            {brands.map((b) => {
              const checked = selectedBrands.includes(b.id);
              return (
                <label key={b.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) =>
                      setSelectedBrands((prev) =>
                        v ? [...prev, b.id] : prev.filter((x) => x !== b.id)
                      )
                    }
                  />
                  {b.name}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium">태그</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => {
              const active = selectedTags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() =>
                    setSelectedTags((prev) => (active ? prev.filter((x) => x !== t) : [...prev, t]))
                  }
                  className={`rounded-full border px-3 py-1 text-xs ${active ? "bg-sage-100 border-sage-200 text-sage-800" : "hover:bg-accent"}`}
                >
                  #{t}
                </button>
              );
            })}
          </div>
        </div>

        <Button variant="ghost" onClick={() => { setQ(""); setSelectedBrands([]); setSelectedTags([]); }}>필터 초기화</Button>
      </aside>

      <section className="col-span-12 md:col-span-9">
        <h1 className="mb-4 text-xl font-semibold">Projects</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const pBrands = p.brandIds.map((id) => brands.find((b) => b.id === id)?.name).filter(Boolean) as string[];
            return (
              <Card key={p.id} className="group">
                <Link href={`/projects/${p.slug}`}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {/* Using img for simplicity to avoid next/image config */}
                    <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {p.tags.slice(0, 3).map((t) => (
                      <Badge key={t}>#{t}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.year} · {formatArea(p.areaM2)}</span>
                    <span>{pBrands.join(", ")}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-8">
          <InquiryDialog />
        </div>
      </section>
    </div>
  );
}

