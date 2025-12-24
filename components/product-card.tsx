"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
    href: string;
    title: string;
    subtitle?: string;
    imageUrl?: string | null;
    tags?: string[];
    badge?: "new" | "featured" | null;
    meta?: {
        label: string;
        value: string;
    }[];
    aspectRatio?: "square" | "video" | "portrait";
    className?: string;
}

export function ProductCard({
    href,
    title,
    subtitle,
    imageUrl,
    tags = [],
    badge,
    meta = [],
    aspectRatio = "video",
    className,
}: ProductCardProps) {
    const aspectRatioClass = {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
    }[aspectRatio];

    return (
        <Link
            href={href}
            className={cn(
                "group block bg-white rounded-lg border border-neutral-200 overflow-hidden",
                "transition-all duration-300 ease-out",
                "hover:shadow-card-hover hover:border-neutral-300 hover:-translate-y-1",
                className
            )}
        >
            {/* Image Container */}
            <div className={cn("relative overflow-hidden bg-neutral-100", aspectRatioClass)}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-neutral-200" />
                    </div>
                )}

                {/* Badge */}
                {badge && (
                    <div className="absolute top-3 left-3">
                        <span
                            className={cn(
                                "inline-flex items-center px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
                                badge === "new" && "bg-sage-600 text-white",
                                badge === "featured" && "bg-neutral-900 text-white"
                            )}
                        >
                            {badge === "new" ? "NEW" : "FEATURED"}
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    )}
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-base font-semibold text-neutral-900 line-clamp-1 group-hover:text-sage-700 transition-colors">
                    {title}
                </h3>

                {/* Subtitle */}
                {subtitle && (
                    <p className="mt-1 text-sm text-neutral-500 line-clamp-1">
                        {subtitle}
                    </p>
                )}

                {/* Meta Info */}
                {meta.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                        {meta.map((item, index) => (
                            <div key={index} className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <span className="font-medium text-neutral-400">{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-neutral-200"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {tags.length > 3 && (
                            <span className="text-xs text-neutral-400">+{tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
