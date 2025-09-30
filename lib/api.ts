import { supabase } from "./supabase";
import type { Tables } from "./database.types";

type ProjectFilters = {
  q?: string;
  brands?: string[];
  tags?: string[];
};

export type Project = Tables<"projects"> & {
  project_images: Tables<"project_images">[];
  project_tags: (Tables<"project_tags"> & { tags: Tables<"tags"> | null })[];
  project_items: (Tables<"project_items"> & {
    items: (Tables<"items"> & { brands: Tables<"brands"> | null }) | null;
  })[];
};

export async function fetchProjects(filters: ProjectFilters = {}) {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `id,slug,title,description,cover_image_url,year,area,status,
       project_images(id,image_url,order),
       project_tags(tag_id,tags(id,name)),
       project_items(item_id,items(id,slug,name,description,image_url,nara_url,brand_id,brands(id,slug,name)))`
    )
    .eq("status", "published")
    .order("year", { ascending: false, nullsFirst: false });
  if (error) throw error;
  let projects = (data ?? []) as Project[];

  if (filters.q) {
    const keyword = filters.q.toLowerCase();
    projects = projects.filter((project) => {
      const text = [project.title, project.description, ...project.project_tags.map((tag) => tag.tags?.name ?? "")]
        .join(" ")
        .toLowerCase();
      return text.includes(keyword);
    });
  }

  if (filters.brands?.length) {
    projects = projects.filter((project) =>
      project.project_items.some((item) => item.items?.brand_id && filters.brands!.includes(item.items.brand_id))
    );
  }

  if (filters.tags?.length) {
    projects = projects.filter((project) =>
      project.project_tags.some((tag) => tag.tag_id && filters.tags!.includes(tag.tag_id))
    );
  }

  return projects;
}

export async function fetchProjectBySlug(slug: string) {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `id,slug,title,description,cover_image_url,year,area,status,
       project_images(id,image_url,order),
       project_tags(tag_id,tags(id,name)),
       project_items(item_id,items(id,slug,name,description,image_url,nara_url,brand_id,brands(id,slug,name,description,cover_image_url,website_url)))`
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data as Project | null;
}

export type Brand = Tables<"brands">;

export async function fetchBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("id,slug,name,description,cover_image_url,website_url")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Brand[];
}

export async function fetchBrandBySlug(slug: string) {
  const { data, error } = await supabase
    .from("brands")
    .select(
      `id,slug,name,description,cover_image_url,website_url,
       items(id,slug,name,description,image_url,nara_url,project_items(project_id,projects(id,slug,title,cover_image_url,year))),
       projects:project_items(project_id,projects(id,slug,title,cover_image_url,year,status))`
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as (Brand & {
    items: (Tables<"items"> & {
      project_items: { project_id: string; projects: Tables<"projects"> | null }[];
    })[];
    projects: { project_id: string; projects: Tables<"projects"> | null }[];
  }) | null;
}

export type Item = Tables<"items"> & {
  brands: Tables<"brands"> | null;
  project_items: { project_id: string; projects: Tables<"projects"> | null }[];
};

export async function fetchItems() {
  const { data, error } = await supabase
    .from("items")
    .select("id,slug,name,description,image_url,nara_url,brand_id,brands(id,slug,name)")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Item[];
}

export async function fetchItemBySlug(slug: string) {
  const { data, error } = await supabase
    .from("items")
    .select(
      `id,slug,name,description,image_url,nara_url,brand_id,
       brands(id,slug,name,description,cover_image_url,website_url),
       project_items(project_id,projects(id,slug,title,cover_image_url,year,status))`
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Item | null;
}

export async function fetchTags() {
  const { data, error } = await supabase.from("tags").select("id,name").order("name");
  if (error) throw error;
  return (data ?? []) as Tables<"tags">[];
}

export type Photo = Tables<"project_images"> & {
  projects: Tables<"projects"> | null;
  image_tags: (Tables<"image_tags"> & { tags: Tables<"tags"> | null })[];
};

export async function fetchPhotos() {
  const { data, error } = await supabase
    .from("project_images")
    .select(
      `id,image_url,order,project_id,
       projects(id,slug,title,description,status),
       image_tags(tag_id,tags(id,name))`
    )
    .order("order", { ascending: true })
    .limit(60);
  if (error) throw error;
  return (data ?? []) as Photo[];
}

export async function fetchPhotoById(id: string) {
  const { data, error } = await supabase
    .from("project_images")
    .select(
      `id,image_url,order,project_id,
       projects(id,slug,title,description,status),
       image_tags(tag_id,tags(id,name))`
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Photo | null;
}



