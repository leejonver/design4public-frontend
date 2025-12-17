import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProjectBySlug, fetchProjectPhotosWithItems } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { PhotoGallerySlider } from "@/components/photo-gallery-slider";

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

  // Fetch photos with linked items
  const photosWithItems = await fetchProjectPhotosWithItems(project.id);

  const tags = project.project_tags
    .map((tag: { tag_id: string; tags: { name: string; type?: string } | null }) =>
      tag.tags?.type === "project" ? tag.tags?.name : undefined
    )
    .filter((name: string | null): name is string => Boolean(name));

  // Fallback to project_images if no photos from new table
  const hasPhotosWithItems = photosWithItems.length > 0;
  const fallbackImages = project.project_images.map((img: { id: string; image_url: string; order?: number }, index: number) => ({
    id: img.id,
    image_url: img.image_url,
    alt_text: project.title,
    title: null,
    order: img.order ?? index,
    items: [],
  }));

  const galleryPhotos = hasPhotosWithItems ? photosWithItems : fallbackImages;

  return (
    <article className="space-y-6">
      {/* 프로젝트 타이틀 - 상단 */}
      <header>
        <h1 className="text-2xl font-semibold">{project.title}</h1>
      </header>

      {/* 메인 컨텐츠: 좌측 사이드바 + 우측 슬라이더 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 좌측 사이드바: 프로젝트 정보 */}
        <aside className="lg:w-48 shrink-0 space-y-4">
          {/* 프로젝트 정보 - 하나의 div로 정리 */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {/* 설치 연도 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-14 shrink-0">설치연도</span>
              <span className="text-sm font-medium text-gray-900">
                {project.year ?? "미정"}
              </span>
            </div>

            {/* 지역 */}
            {project.location && (
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-500 w-14 shrink-0">지역</span>
                <span className="text-sm font-medium text-gray-900">
                  {project.location}
                </span>
              </div>
            )}

            {/* 설명 */}
            {project.description && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* 태그 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {tags.map((tag: string) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* 문의 버튼 */}
          <InquiryDialog label="담당자에게 물어보기" />
        </aside>

        {/* 우측: 이미지 슬라이더 */}
        <div className="flex-1 min-w-0">
          {galleryPhotos.length > 0 && (
            <PhotoGallerySlider
              photos={galleryPhotos}
              projectTitle={project.title}
              projectSlug={decodedSlug}
            />
          )}
        </div>
      </div>
    </article>
  );
}
