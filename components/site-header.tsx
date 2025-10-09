import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center font-semibold tracking-tight">
          <span className={cn("text-xl")}>design4public</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/projects" className="hover:text-sage-700">Projects</Link>
          <Link href="/items" className="hover:text-sage-700">Items</Link>
          <Link href="/brands" className="hover:text-sage-700">Brands</Link>
        </nav>
      </div>
    </header>
  );
}

