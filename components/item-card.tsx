"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ItemCardProps {
    href: string;
    name: string;
    category?: string;
    imageUrl?: string | null;
    className?: string;
}

export function ItemCard({
    href,
    name,
    category,
    imageUrl,
    className,
}: ItemCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group block",
                className
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-neutral-100 rounded-lg">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1920px) 33vw, 25vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-neutral-200" />
                    </div>
                )}

                {/* Hover Overlay */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/5",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    )}
                />
            </div>

            {/* Content - Only category and name */}
            <div className="mt-4 space-y-1">
                {/* Category Tag */}
                {category && (
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                        {category}
                    </p>
                )}

                {/* Item Name */}
                <h3 className="text-base font-medium text-neutral-900 group-hover:text-sage-700 transition-colors line-clamp-2">
                    {name}
                </h3>
            </div>
        </Link>
    );
}
