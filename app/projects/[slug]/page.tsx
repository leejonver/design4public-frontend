import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProjectBySlug } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { addCacheBuster } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(decodeURIComponent(slug));
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
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const project = await fetchProjectBySlug(decodedSlug);
  if (!project) return notFound();

  const tags = project.project_tags
    .map((tag: { tag_id: string; tags: { name: string; type?: string } | null }) =>
      tag.tags?.type === "project" ? tag.tags?.name : undefined
    )
    .filter((name: string | null): name is string => Boolean(name));

  type RelatedItem = {
    id: string;
    slug: string;
    name: string;
    description: string;
    image_url: string | null;
    nara_url: string | null;
    brands: { id: string; name_ko: string; name_en: string | null } | null;
  };

  type RelatedItemWithBrand = RelatedItem & {
    brand: { id: string; name_ko: string; name_en: string | null } | null;
  };

  const items: RelatedItemWithBrand[] = project.project_items
    .map((pi: { item_id: string; items: RelatedItem | null }) => pi.items)
    .filter((item: RelatedItem | null): item is RelatedItem => Boolean(item))
    .map((item: RelatedItem) => ({
      ...item,
      brand: item.brands,
    }));

  const coverImage = project.cover_image_url ?? project.project_images[0]?.image_url;
  const galleryImages = project.project_images.filter(
    (image: { id: string; image_url: string }) => image.image_url !== coverImage
  );

  return (
    <article className="space-y-8">
      {/* 대표 이미지 */}
      {coverImage && (
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={addCacheBuster(coverImage)}
            alt={project.title}
            className="w-full aspect-[16/9] object-cover"
          />
        </div>
      )}

      {/* 프로젝트 정보 섹션 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 좌측: 프로젝트 정보 */}
        <div className="flex-1 space-y-4">
          <header className="space-y-3">
            <h1 className="text-3xl font-semibold">{project.title}</h1>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{project.year ?? "연도 미정"}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>

            {project.description && (
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            )}
          </header>
        </div>

        {/* 우측: CTA 버튼 */}
        <div className="lg:w-64">
          <InquiryDialog />
        </div>
      </div>

      {/* 이미지 갤러리 (본문 형식) */}
      {galleryImages.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">프로젝트 이미지</h2>
          <div className="space-y-4">
            {galleryImages.map((image: { id: string; image_url: string }) => (
              <div key={image.id} className="w-full">
                <img
                  src={addCacheBuster(image.image_url)}
                  alt={project.title}
                  className="w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {items.length ? (
        <section>
          <h2 className="mb-2 text-lg font-medium">연관된 아이템</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item: RelatedItemWithBrand) => (
              <li key={item.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={addCacheBuster(item.image_url)}
                    alt={item.name}
                    className="h-20 w-28 rounded object-cover"
                  />
                  <div className="flex-1">
                    <Link href={`/items/${item.slug}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {item.brand
                        ? `브랜드: ${item.brand.name_ko}${item.brand.name_en ? ` (${item.brand.name_en})` : ""}`
                        : "브랜드 정보 없음"}
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
    </article>
  );
}

