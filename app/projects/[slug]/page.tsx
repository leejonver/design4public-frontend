import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProjectBySlug } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { formatArea } from "@/lib/utils";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await fetchProjectBySlug(params.slug);
  if (!project) return {};
  const images = project.project_images
    .map((image: { image_url: string | null }) => image.image_url)
    .filter((url: string | null): url is string => Boolean(url));
  return {
    title: project.title,
    description: project.description ?? undefined,
    openGraph: {
      title: project.title,
      description: project.description ?? undefined,
      images,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await fetchProjectBySlug(params.slug);
  if (!project) return notFound();

  const tags = project.project_tags
    .map((tag: { tag_id: string; tags: { name: string } | null }) => tag.tags?.name)
    .filter((name: string | null): name is string => Boolean(name));

  type RelatedItem = {
    id: string;
    slug: string;
    name: string;
    description: string;
    image_url: string | null;
    nara_url: string | null;
    brands: { id: string; name: string } | null;
  };

  type RelatedItemWithBrand = RelatedItem & { brand: { id: string; name: string } | null };

  const items: RelatedItemWithBrand[] = project.project_items
    .map((pi: { item_id: string; items: RelatedItem | null }) => pi.items)
    .filter((item: RelatedItem | null): item is RelatedItem => Boolean(item))
    .map((item: RelatedItem) => ({
      ...item,
      brand: item.brands,
    }));

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        {project.description ? <p className="text-muted-foreground">{project.description}</p> : null}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          시공연도 {project.year ?? "미정"} · 면적 {formatArea(project.area ?? undefined)}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {project.project_images.map((image: { id: string; image_url: string }) => (
          <img
            key={image.id}
            src={image.image_url}
            alt={project.title}
            className="w-full rounded-md object-cover"
          />
        ))}
      </section>

      {items.length ? (
        <section>
          <h2 className="mb-2 text-lg font-medium">연관된 아이템</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item: RelatedItemWithBrand) => (
              <li key={item.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url ?? "/placeholder.png"}
                    alt={item.name}
                    className="h-20 w-28 rounded object-cover"
                  />
                  <div className="flex-1">
                    <Link href={`/items/${item.slug}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {item.brand ? `브랜드: ${item.brand.name}` : "브랜드 정보 없음"}
                    </div>
                    {item.nara_url ? (
                      <div className="mt-2 text-xs">
                        <a href={item.nara_url} target="_blank" className="text-sage-700 underline">
                          나라장터종합쇼핑몰 바로가기
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div>
        <InquiryDialog />
      </div>
    </article>
  );
}

