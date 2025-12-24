import { Suspense } from "react";
import { ProjectsFilter } from "./projects-filter";
import { ProjectsGrid } from "./projects-grid";
import { ProjectsSkeleton } from "./projects-skeleton";

export const metadata = { title: "Projects" };

export default function ProjectsListPage() {
  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Page Header */}
      <header className="space-y-3">
        <h1 className="text-display-sm lg:text-display-md font-semibold text-neutral-900">Projects</h1>
        <p className="text-neutral-600 text-base lg:text-lg max-w-2xl">
          공공기관 가구 납품 프로젝트 사례를 탐색해 보세요
        </p>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-3 xl:col-span-2">
          <div className="lg:sticky lg:top-28">
            <ProjectsFilter />
          </div>
        </aside>

        {/* Project Grid */}
        <section className="lg:col-span-9 xl:col-span-10">
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsGrid />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
