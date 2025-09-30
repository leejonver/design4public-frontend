"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetchProjects } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatArea } from "@/lib/utils";
import { ProjectsSkeleton } from "./projects-skeleton";

function useProjectFilters() {
  if (typeof window === "undefined") return { q: "", brands: [], tags: [] };
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") ?? "";
  const brands = params.get("brands")?.split(",").filter(Boolean) ?? [];
  const tags = params.get("tags")?.split(",").filter(Boolean) ?? [];
  return { q, brands, tags };
}

export function ProjectsGrid() {
  const filters = useProjectFilters();
  const { data, error, isLoading } = useSWR(["projects-grid", filters], () => fetchProjects(filters));

  if (isLoading) return <ProjectsSkeleton />;
  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
        프로젝트 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </div>
    );
  }

  const projects = data ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: any) => {
        const brandNames = project.project_items
          .map((item: any) => item.items?.brands?.name)
          .filter(Boolean) as string[];
        const tags = project.project_tags
          .map((tag: any) => tag.tags?.name)
          .filter((name: string | undefined): name is string => Boolean(name));
        const cover = project.cover_image_url ?? project.project_images[0]?.image_url ?? "/placeholder.png";

        return (
          <Card key={project.id} className="group">
            <Link href={`/projects/${project.slug}`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={cover}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <CardHeader>
              <CardTitle className="text-base">{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</div>
              <div className="mb-2 flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {project.year ?? "연도 미정"} · {formatArea(project.area ?? undefined)}
                </span>
                <span>{brandNames.join(", ")}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


