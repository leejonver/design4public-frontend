import Link from "next/link";
import { notFound } from "next/navigation";
import { brands, projects } from "@/lib/mock-data";

type Props = { params: { slug: string } };

export default function BrandDetailPage({ params }: Props) {
  const brand = brands.find((b) => b.slug === params.slug);
  if (!brand) return notFound();
  const recent = projects.filter((p) => p.brandIds.includes(brand.id));

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <img src={brand.cover} alt={brand.name} className="h-48 w-full rounded-md object-cover" />
        <div className="flex items-center gap-3">
          <img src={brand.logo} alt={brand.name} className="h-8 w-8" />
          <h1 className="text-2xl font-semibold">{brand.name}</h1>
        </div>
        <p className="text-muted-foreground">{brand.intro}</p>
        <a href={brand.url} target="_blank" className="text-sage-700 underline text-sm">브랜드 홈페이지</a>
      </header>

      <section>
        <h2 className="mb-2 text-lg font-medium">최근 프로젝트</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {recent.map((p) => (
            <li key={p.id} className="rounded-lg border p-4">
              <Link href={`/projects/${p.slug}`} className="flex items-center gap-4">
                <img src={p.cover} alt={p.title} className="h-20 w-28 rounded object-cover" />
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.year}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

