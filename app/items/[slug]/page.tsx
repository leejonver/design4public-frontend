import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchItemBySlug } from "@/lib/api";
import { formatArea } from "@/lib/utils";

type Props = { params: { slug: string } };

export default async function ItemDetailPage({ params }: Props) {
  const item = await fetchItemBySlug(params.slug);
  if (!item) return notFound();

  type RelatedProject = {
    id: string;
    slug: string;
    title: string;
    cover_image_url: string | null;
    year: number | null;
    area?: number | null;
  };

  const relatedProjects: RelatedProject[] = item.project_items
    .map((pi: { project_id: string; projects: RelatedProject | null }) => pi.projects)
    .filter((project: RelatedProject | null): project is RelatedProject => Boolean(project));

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold">{item.name}</h1>
        <p className="text-muted-foreground">{item.description}</p>
        {item.nara_url ? (
          <div className="mt-2 text-xs">
            <a href={item.nara_url} target="_blank" className="text-sage-700 underline">
              나라장터종합쇼핑몰 바로가기
            </a>
          </div>
        ) : null}
      </header>

      <img
        src={item.image_url ?? "/placeholder.png"}
        alt={item.name}
        className="w-full rounded-md object-cover"
      />

      {item.brands ? (
        <section>
          <h2 className="mb-2 text-lg font-medium">브랜드</h2>
          <Link
            href={`/brands/${item.brands.slug}`}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-accent"
          >
            {item.brands.name}
          </Link>
        </section>
      ) : null}

      <section>
        <h2 className="mb-2 text-lg font-medium">아이템이 들어간 프로젝트</h2>
        {relatedProjects.length ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedProjects.map((project) => (
              <li key={project.id} className="rounded-lg border p-4">
                <Link href={`/projects/${project.slug}`} className="flex items-center gap-4">
                  <img
                    src={project.cover_image_url ?? "/placeholder.png"}
                    alt={project.title}
                    className="h-20 w-28 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {project.year ?? "연도 미정"} · {formatArea(project.area ?? undefined)}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            아직 연관된 프로젝트가 없습니다.
          </div>
        )}
      </section>
    </article>
  );
}

