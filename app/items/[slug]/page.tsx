import { notFound } from "next/navigation";
import Link from "next/link";
import { findItemBySlug, projects, brands } from "@/lib/mock-data";

type Props = { params: { slug: string } };

export default function ItemDetailPage({ params }: Props) {
  const item = findItemBySlug(params.slug);
  if (!item) return notFound();
  const brand = brands.find((b) => b.id === item.brandId)!;
  const related = projects.filter((p) => p.itemIds.includes(item.id));

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{item.name}</h1>
        <p className="text-muted-foreground">{item.description}</p>
        <div className="mt-2 text-xs">
          <a href={item.naraUrl} target="_blank" className="text-sage-700 underline">나라장터종합쇼핑몰 바로가기</a>
        </div>
      </header>
      <img src={item.image} alt={item.name} className="w-full rounded-md object-cover" />

      <section>
        <h2 className="mb-2 text-lg font-medium">브랜드</h2>
        <Link href={`/brands/${brand.slug}`} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-accent">
          <img src={brand.logo} alt={brand.name} className="h-5 w-5" />
          {brand.name}
        </Link>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">아이템이 들어간 프로젝트</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {related.map((p) => (
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

