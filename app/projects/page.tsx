import { Suspense } from "react";
import { ProjectsFilter } from "./projects-filter";
import { ProjectsGrid } from "./projects-grid";
import { ProjectsSkeleton } from "./projects-skeleton";

export const metadata = { title: "Projects" };

export default function ProjectsListPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-3 space-y-6">
        <ProjectsFilter />
      </aside>
      <section className="col-span-12 md:col-span-9">
        <header className="mb-6 flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Projects</h1>
        </header>
        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectsGrid />
        </Suspense>
      </section>
    </div>
  );
}
 
