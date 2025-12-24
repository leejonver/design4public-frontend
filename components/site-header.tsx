"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/items", label: "Items" },
  { href: "/brands", label: "Brands" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto w-full max-w-[1920px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo with Rethink Sans Bold */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <span className="font-logo text-xl lg:text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-sage-700 transition-colors">
              design4public
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 lg:px-6 py-2 text-sm lg:text-base font-medium transition-colors rounded-md",
                    isActive
                      ? "text-sage-700"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 lg:left-6 lg:right-6 h-0.5 bg-sage-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white animate-fade-in">
          <nav className="mx-auto max-w-[1920px] px-6 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                    isActive
                      ? "text-sage-700 bg-sage-50"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
