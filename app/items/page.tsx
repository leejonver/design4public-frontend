import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchItems } from "@/lib/api";

export const metadata = { title: "Items" };

export default async function ItemsListPage() {
  const items = await fetchItems();

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold">Items</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item: any) => (
          <Card key={item.id} className="group">
            <Link href={`/items/${item.slug}`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.image_url ?? "/placeholder.png"}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <CardHeader>
              <CardTitle className="text-base">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="muted">브랜드</Badge>
                {item.brands ? (
                  <Link href={`/brands/${item.brands.slug}`} className="hover:underline">
                    {item.brands.name}
                  </Link>
                ) : (
                  <span>미등록</span>
                )}
              </div>
              {item.nara_url ? (
                <div className="mt-2 text-xs">
                  <a href={item.nara_url} target="_blank" className="text-sage-700 underline">
                    나라장터종합쇼핑몰 URL
                  </a>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

