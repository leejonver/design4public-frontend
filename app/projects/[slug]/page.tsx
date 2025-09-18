import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findProjectBySlug, brands, items } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { InquiryDialog } from "@/components/inquiry-dialog";
import { formatArea } from "@/lib/utils";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = findProjectBySlug(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    openGraph: { images: [p.cover] },
  };
}

export default function ProjectDetailPage({ params }: Props) {
  const project = findProjectBySlug(params.slug);
  if (!project) return notFound();

  const pBrands = project.brandIds
    .map((id) => brands.find((b) => b.id === id))
    .filter(Boolean);
  const pItems = project.itemIds
    .map((id) => items.find((i) => i.id === id))
    .filter(Boolean);

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <p className="text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <Badge key={t}>#{t}</Badge>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">시공연도 {project.year} · 면적 {formatArea(project.areaM2)}</div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {project.photos.map((src, i) => (
          <img key={i} src={src} alt={`${project.title} 사진 ${i + 1}`} className="w-full rounded-md object-cover" />
        ))}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">브랜드</h2>
        <div className="flex flex-wrap gap-3">
          {pBrands.map((b) => (
            <Link key={b!.id} href={`/brands/${b!.slug}`} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-accent">
              <img src={b!.logo} alt={b!.name} className="h-5 w-5" />
              {b!.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">연관된 아이템</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pItems.map((it) => (
            <li key={it!.id} className="rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <img src={it!.image} alt={it!.name} className="h-20 w-28 rounded object-cover" />
                <div className="flex-1">
                  <Link href={`/items/${it!.slug}`} className="font-medium hover:underline">{it!.name}</Link>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{it!.description}</p>
                  <div className="mt-2 text-xs">
                    <a href={it!.naraUrl} target="_blank" className="text-sage-700 underline">나라장터종합쇼핑몰 바로가기</a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div>
        <InquiryDialog />
      </div>
    </article>
  );
}

