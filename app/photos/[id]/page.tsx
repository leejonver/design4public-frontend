import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchPhotoById } from "@/lib/api";

type Props = { params: { id: string } };

export default async function PhotoDetailPage({ params }: Props) {
  const photo = await fetchPhotoById(params.id);
  if (!photo) return notFound();

  const project = photo.projects;
  const tags = photo.image_tags
    .map((tag: { tag_id: string; tags: { id: string; name: string } | null }) => tag.tags?.name)
    .filter(Boolean) as string[];

  return (
    <article className="space-y-4">
      <img src={photo.image_url} alt={project?.title ?? "프로젝트 이미지"} className="w-full rounded-md object-cover" />
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border px-2 py-1">
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        {project && (
          <Link href={`/projects/${project.slug}`} className="rounded-full border px-3 py-1 hover:bg-accent">
            연결된 프로젝트: {project.title}
          </Link>
        )}
      </div>
    </article>
  );
}

