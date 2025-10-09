import { Suspense } from "react";
import { ItemsFilter } from "./items-filter";
import { ItemsList } from "./items-list";
import { ItemsSkeleton } from "./items-skeleton";

export const metadata = { title: "Items" };

export default function ItemsListPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-12 space-y-6 md:col-span-3">
        <ItemsFilter />
      </aside>
      <section className="col-span-12 md:col-span-9">
        <header className="mb-6 flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Items</h1>
        </header>
        <Suspense fallback={<ItemsSkeleton />}>
          <ItemsList />
        </Suspense>
      </section>
    </div>
  );
}

