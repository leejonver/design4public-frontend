import Link from "next/link";
import { items, brands } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Items" };

export default function ItemsListPage() {
  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold">Items</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const brand = brands.find((b) => b.id === it.brandId);
          return (
            <Card key={it.id} className="group">
              <Link href={`/items/${it.slug}`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img src={it.image} alt={it.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="text-base">{it.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{it.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="muted">브랜드</Badge>
                  <Link href={`/brands/${brand?.slug}`} className="hover:underline">{brand?.name}</Link>
                </div>
                <div className="mt-2 text-xs">
                  <a href={it.naraUrl} target="_blank" className="text-sage-700 underline">나라장터종합쇼핑몰 URL</a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

