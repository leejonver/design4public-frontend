import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBrandBySlug } from "@/lib/api";

type Props = { params: { slug: string } };

export default async function BrandDetailPage({ params }: Props) {
  const brand = await fetchBrandBySlug(params.slug);
  if (!brand) return notFound();

  const projects = brand.projects
    .map((item: { project_id: string; projects: any | null }) =>
      item.projects
        ? {
            id: item.projects.id,
            title: item.projects.title,
            cover_image_url: item.projects.cover_image_url,
            year: item.projects.year,
            slug:
              "slug" in item.projects && typeof item.projects.slug === "string"
                ? item.projects.slug
                : item.projects.id,
          }
        : null
    )
    .filter((project: { id: string; slug: string; cover_image_url: string | null; title: string; year: number | null } | null): project is { id: string; slug: string; cover_image_url: string | null; title: string; year: number | null } => Boolean(project));

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <img
          src={brand.cover_image_url ?? brand.logo_image_url ?? "/placeholder.png"}
          alt={brand.name_ko ?? brand.name_en ?? "브랜드"}
          className="h-48 w-full rounded-md object-cover"
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            {brand.name_ko}
            {brand.name_en ? <span className="ml-2 text-sm text-muted-foreground">{brand.name_en}</span> : null}
          </h1>
          <p className="text-muted-foreground">{brand.description}</p>
          {brand.website_url ? (
            <a href={brand.website_url} target="_blank" className="text-sage-700 underline text-sm">
              브랜드 홈페이지
            </a>
          ) : null}
        </div>
      </header>

      <section>
        <h2 className="mb-2 text-lg font-medium">최근 프로젝트</h2>
        {projects.length ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((project: { id: string; slug: string; cover_image_url: string | null; title: string; year: number | null }) => (
              <li key={project.id} className="rounded-lg border p-4">
                <Link href={`/projects/${project.slug}`} className="flex items-center gap-4">
                  <img
                    src={project.cover_image_url ?? "/placeholder.png"}
                    alt={project.title}
                    className="h-20 w-28 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground">{project.year ?? "연도 미정"}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            아직 등록된 프로젝트가 없습니다.
          </div>
        )}
      </section>
    </article>
  );
}

