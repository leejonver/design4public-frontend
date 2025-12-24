"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchProjects } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { ProjectsSkeleton } from "./projects-skeleton";
import { addCacheBuster } from "@/lib/utils";

type ProjectFilters = {
  q: string;
  categories: string[];
  brands: string[];
};

function useProjectFilters() {
  const [filters, setFilters] = useState<ProjectFilters>({ q: "", categories: [], brands: [] });

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

export function ProjectsGrid() {
  const filters = useProjectFilters();
  const { data, error, isLoading } = useSWR(
    ["projects-grid", JSON.stringify(filters)],
    async () => {
      const allProjects = await fetchProjects();

      let filtered = allProjects;

      // Search filter
      if (filters.q) {
        const keyword = filters.q.toLowerCase();
        filtered = filtered.filter((project: any) => {
          const tags = project.project_tags?.map((t: any) => t.tags?.name ?? "").join(" ") ?? "";
          const text = [project.title, project.description, project.location, tags].join(" ").toLowerCase();
          return text.includes(keyword);
        });
      }

      // Category filter (matches project tags)
      if (filters.categories.length > 0) {
        filtered = filtered.filter((project: any) => {
          const projectTags = project.project_tags
            ?.map((t: any) => t.tags?.name)
            .filter(Boolean) ?? [];
          return filters.categories.some(cat => projectTags.includes(cat));
        });
      }

      // Brand filter - would need brand info on projects, for now skip
      // This will be handled when DB model is updated

      return filtered;
    }
  );

  if (isLoading) return <ProjectsSkeleton />;
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
        <p className="font-medium">데이터 로딩 오류</p>
        <p className="mt-1 text-destructive/80">프로젝트 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }

  const projects = data ?? [];

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center">
        <p className="text-neutral-600 font-medium">검색 결과가 없습니다</p>
        <p className="mt-1 text-sm text-neutral-500">다른 검색어나 필터를 사용해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 stagger-children">
      {projects.map((project: any) => {
        const tags = project.project_tags
          .map((tag: any) => (tag.tags?.type === "project" ? tag.tags?.name : undefined))
          .filter((name: string | undefined): name is string => Boolean(name));
        const cover = project.cover_image_url ?? project.project_images[0]?.image_url ?? "/placeholder.png";

        return (
          <ProductCard
            key={project.id}
            href={`/projects/${project.slug}`}
            title={project.title}
            imageUrl={addCacheBuster(cover)}
            tags={tags}
            meta={[
              ...(project.year ? [{ label: "연도", value: String(project.year) }] : []),
              ...(project.location ? [{ label: "지역", value: project.location }] : []),
            ]}
            aspectRatio="video"
          />
        );
      })}
    </div>
  );
}
