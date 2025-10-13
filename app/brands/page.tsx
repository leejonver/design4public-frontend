import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBrands, fetchProjects } from "@/lib/api";

export const metadata = { title: "Brands" };

export default async function BrandsPage() {
  const [brands, projects] = await Promise.all([fetchBrands(), fetchProjects()]);

  const getCount = (brandId: string) =>
    projects.filter((project: any) =>
      project.project_items.some((item: any) => item.items?.brands?.id === brandId)
    ).length;

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold">Brands</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand: any) => (
          <Card key={brand.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <Link href={`/brands/${brand.slug}`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                <img
                  src={brand.logo_image_url ?? brand.cover_image_url ?? "/placeholder.png"}
                  alt={brand.name_ko ?? brand.name_en ?? "브랜드"}
                  className="h-full w-full object-contain p-8"
                />
              </div>
            </Link>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {brand.name_ko}
                {brand.name_en ? <span className="text-xs text-muted-foreground">({brand.name_en})</span> : null}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">{brand.description}</p>
              <div className="mt-2 text-xs text-muted-foreground">최근 프로젝트 {getCount(brand.id)}건</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

