import Link from "next/link";
import { brands, projects } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Brands" };

export default function BrandsPage() {
  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold">Brands</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => {
          const recentCount = projects.filter((p) => p.brandIds.includes(b.id)).length;
          return (
            <Card key={b.id}>
              <Link href={`/brands/${b.slug}`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img src={b.cover} alt={b.name} className="h-full w-full object-cover" />
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <img src={b.logo} alt={b.name} className="h-6 w-6" />
                  {b.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{b.intro}</p>
                <div className="mt-2 text-xs text-muted-foreground">최근 프로젝트 {recentCount}건</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

