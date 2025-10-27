import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchItemBySlug } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addCacheBuster } from "@/lib/utils";

export const revalidate = 0; // 항상 최신 데이터 가져오기

type Props = { params: Promise<{ slug: string }> };

export default async function ItemDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await fetchItemBySlug(decodeURIComponent(slug));
  if (!item) return notFound();

  type RelatedProject = {
    id: string;
    slug: string;
    title: string;
    cover_image_url: string | null;
    year: number | null;
    area?: number | null;
    brand_count?: number | null;
    name_ko?: string | null;
    name_en?: string | null;
  };

  const relatedProjects: RelatedProject[] = item.project_items
    .map((pi: { project_id: string; projects: RelatedProject | null }) => pi.projects)
    .filter((project: RelatedProject | null): project is RelatedProject => Boolean(project));

  const tags = item.item_tags
    ?.map((tag: { tags: { name: string; type?: string } | null }) =>
      tag.tags?.type === "item" ? tag.tags?.name : undefined
    )
    .filter((name: string | undefined): name is string => Boolean(name));

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
        src={addCacheBuster(item.image_url)}
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
            {item.brands.name_ko}
            {item.brands.name_en ? (
              <span className="text-xs text-muted-foreground">({item.brands.name_en})</span>
            ) : null}
          </Link>
        </section>
      ) : null}

      {tags?.length ? (
        <section>
          <h2 className="mb-2 text-lg font-medium">태그</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <Badge key={tag}>#{tag}</Badge>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-4 text-lg font-medium">아이템이 들어간 프로젝트</h2>
        {relatedProjects.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((project) => (
              <Card key={project.id} className="group">
                <Link href={`/projects/${project.slug}`}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={addCacheBuster(project.cover_image_url)}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle className="text-base">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {project.year ?? "연도 미정"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            아직 연관된 프로젝트가 없습니다.
          </div>
        )}
      </section>
    </article>
  );
}

