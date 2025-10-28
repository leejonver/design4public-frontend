import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBrandBySlug } from "@/lib/api";
import { addCacheBuster } from "@/lib/utils";

export const revalidate = 0; // 항상 최신 데이터 가져오기

type Props = { params: Promise<{ slug: string }> };

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params;
  const brand = await fetchBrandBySlug(decodeURIComponent(slug));
  if (!brand) return notFound();

  const projects = brand.projects
    .map((item: { project_id: string; projects: any | null }) => {
      if (!item.projects) return null;
      // cover_image_url이 없으면 project_images의 첫 번째 이미지 사용
      const coverImage = item.projects.cover_image_url ?? item.projects.project_images?.[0]?.image_url ?? null;
      return {
        id: item.projects.id,
        title: item.projects.title,
        cover_image_url: coverImage,
        year: item.projects.year,
        slug:
          "slug" in item.projects && typeof item.projects.slug === "string"
            ? item.projects.slug
            : item.projects.id,
      };
    })
    .filter((project: { id: string; slug: string; cover_image_url: string | null; title: string; year: number | null } | null): project is { id: string; slug: string; cover_image_url: string | null; title: string; year: number | null } => Boolean(project));

  return (
    <article className="-mx-4 -mt-6 sm:-mx-6">
      {/* Cover Image Section */}
      <div className="relative">
        <div className="h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 sm:h-80">
          <img
            src={addCacheBuster(brand.cover_image_url)}
            alt={brand.name_ko ?? brand.name_en ?? "브랜드"}
            className="h-full w-full object-cover"
          />
        </div>
        
        {/* Profile Image */}
        <div className="absolute -bottom-16 left-4 sm:left-8">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
            <img
              src={addCacheBuster(brand.logo_image_url ?? brand.cover_image_url)}
              alt={brand.name_ko ?? brand.name_en ?? "브랜드"}
              className="h-full w-full object-contain p-2"
            />
          </div>
        </div>
      </div>

      {/* Brand Info Section */}
      <div className="mt-20 px-4 sm:px-6">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold">
            {brand.name_ko}
            {brand.name_en && (
              <span className="ml-3 text-lg font-normal text-muted-foreground">
                {brand.name_en}
              </span>
            )}
          </h1>
          
          {brand.website_url && (
            <a 
              href={brand.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              브랜드 홈페이지
            </a>
          )}
          
          {brand.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {brand.description}
            </p>
          )}
        </div>

        {/* Items Section */}
        {brand.items && brand.items.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">제품 목록</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {brand.items.map((item: any) => (
                <Link 
                  key={item.id} 
                  href={`/items/${item.slug}`}
                  className="group overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="aspect-square w-full overflow-hidden bg-gray-50">
                    <img
                      src={addCacheBuster(item.image_url)}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        <section className="mt-8 pb-8">
          <h2 className="mb-4 text-xl font-semibold">관련 프로젝트</h2>
          {projects.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {projects.map((project: { id: string; slug: string; cover_image_url: string | null; title: string; year: number | null }) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-50">
                    <img
                      src={addCacheBuster(project.cover_image_url)}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {project.year ?? "연도 미정"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-gray-50 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                아직 등록된 프로젝트가 없습니다.
              </p>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}

