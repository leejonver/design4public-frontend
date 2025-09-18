import { notFound } from "next/navigation";
import Link from "next/link";
import { photos, projects, items } from "@/lib/mock-data";

type Props = { params: { id: string } };

export default function PhotoDetailPage({ params }: Props) {
  const photo = photos.find((p) => p.id === params.id);
  if (!photo) return notFound();
  const project = photo.projectId ? projects.find((p) => p.id === photo.projectId) : undefined;
  const item = photo.itemId ? items.find((i) => i.id === photo.itemId) : undefined;

  return (
    <article className="space-y-4">
      <img src={photo.url} alt={photo.alt} className="w-full rounded-md object-cover" />
      <div className="text-sm text-muted-foreground">{photo.alt}</div>
      <div className="flex flex-wrap gap-3 text-sm">
        {project && (
          <Link href={`/projects/${project.slug}`} className="rounded-full border px-3 py-1 hover:bg-accent">연결된 프로젝트: {project.title}</Link>
        )}
        {item && (
          <Link href={`/items/${item.slug}`} className="rounded-full border px-3 py-1 hover:bg-accent">연결된 아이템: {item.name}</Link>
        )}
      </div>
    </article>
  );
}

