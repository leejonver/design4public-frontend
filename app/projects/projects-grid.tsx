"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchProjects } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectsSkeleton } from "./projects-skeleton";
import { addCacheBuster } from "@/lib/utils";

type ProjectFilters = {
  q: string;
  years: string[];
  tags: string[];
};

function useProjectFilters() {
  const [filters, setFilters] = useState<ProjectFilters>({ q: "", years: [], tags: [] });

  useEffect(() => {
    const updateFilters = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") ?? "";
      const years = params.get("years")?.split(",").filter(Boolean) ?? [];
      const tags = params.get("tags")?.split(",").filter(Boolean) ?? [];
      setFilters({ q, years, tags });
    };

    updateFilters();
    
    // URL 변경 감지
    const handleUrlChange = () => updateFilters();
    window.addEventListener("popstate", handleUrlChange);
    
    // MutationObserver를 사용하여 pushState/replaceState 감지
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleUrlChange();
    };
    
    window.history.replaceState = function(...args) {
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

export function ProjectsGrid() {
  const filters = useProjectFilters();
  const { data, error, isLoading } = useSWR(
    ["projects-grid", JSON.stringify(filters)], 
    () => fetchProjects(filters)
  );

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
        const tags = project.project_tags
          .map((tag: any) => (tag.tags?.type === "project" ? tag.tags?.name : undefined))
          .filter((name: string | undefined): name is string => Boolean(name));
        const cover = project.cover_image_url ?? project.project_images[0]?.image_url ?? "/placeholder.png";

        return (
          <Card key={project.id} className="group">
            <Link href={`/projects/${project.slug}`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={addCacheBuster(cover)}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <CardHeader>
              <CardTitle className="text-base">{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                {project.year ?? "연도 미정"}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


