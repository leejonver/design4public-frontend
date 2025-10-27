import { supabase } from "./supabase";
import type { Tables } from "./database.types";

type ProjectFilters = {
  q?: string;
  years?: string[];
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
      `id,slug,title,description,cover_image_url,year,area,status,location,created_at,updated_at,
       project_images(id,image_url,order),
       project_tags(tag_id,tags(id,name,type)),
       project_items(item_id,items(id,slug,name,description,image_url,nara_url,brand_id,brands(id,slug,name_ko,name_en)))`
    )
    .eq("status", "published")
    .order("year", { ascending: false, nullsFirst: false })
    .order("title", { ascending: true });
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

  if (filters.years?.length) {
    projects = projects.filter((project) =>
      project.year && filters.years!.includes(String(project.year))
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
      `id,slug,title,description,cover_image_url,year,area,status,location,created_at,updated_at,
       project_images(id,image_url,order),
       project_tags(tag_id,tags(id,name,type)),
       project_items(item_id,items(id,slug,name,description,image_url,nara_url,brand_id,brands(id,slug,name_ko,name_en,description,cover_image_url,website_url)))`
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
    .select("id,slug,name_ko,name_en,description,logo_image_url,cover_image_url,website_url")
    .order("name_ko", { ascending: true });
  
  if (error) throw error;
  
  // Fallback to direct REST API call if Supabase client returns empty data
  if (!data || data.length === 0) {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/brands?select=*&order=name_ko.asc`;
    const response = await fetch(url, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const restData = await response.json();
    return restData as Brand[];
  }
  
  return (data ?? []) as Brand[];
}

export async function fetchBrandBySlug(slug: string) {
  // Use REST API directly to avoid complex relationship issues with Supabase JS client
  const brandUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/brands?select=id,slug,name_ko,name_en,description,logo_image_url,cover_image_url,website_url,items(id,slug,name,description,image_url,nara_url)&slug=eq.${slug}`;
  const brandResponse = await fetch(brandUrl, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
    },
  });
  
  if (!brandResponse.ok) {
    throw new Error(`HTTP error! status: ${brandResponse.status}`);
  }
  
  const brandData = await brandResponse.json();
  if (!brandData || brandData.length === 0) {
    return null;
  }
  
  const brand = brandData[0];
  
  // Initialize empty projects array
  brand.projects = [];
  
  // Try to fetch project_items for this brand if items exist
  if (brand.items && brand.items.length > 0) {
    try {
      const itemIds = brand.items.map((item: any) => item.id).join(',');
      const projectItemsUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/project_items?select=project_id,item_id,projects(id,slug,title,cover_image_url,year,status)&item_id=in.(${itemIds})`;
      const projectItemsResponse = await fetch(projectItemsUrl, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      });
      
      if (projectItemsResponse.ok) {
        const projectItemsData = await projectItemsResponse.json();
        brand.projects = projectItemsData || [];
      }
    } catch (err) {
      console.error('Error fetching project_items:', err);
      // Continue with empty projects array
    }
  }
  
  return brand as (Brand & {
    items: (Tables<"items"> & {
      project_items: { project_id: string; projects: Tables<"projects"> | null }[];
    })[];
    projects: { project_id: string; projects: Tables<"projects"> | null }[];
  }) | null;
}

export type Item = Tables<"items"> & {
  brands: Tables<"brands"> | null;
  item_tags: (Tables<"item_tags"> & { tags: Tables<"tags"> | null })[];
  project_items: { project_id: string; projects: Tables<"projects"> | null }[];
};

export async function fetchItems() {
  const { data, error } = await supabase
    .from("items")
    .select(
      `id,slug,name,description,image_url,nara_url,status,brand_id,
       brands(id,slug,name_ko,name_en,logo_image_url,cover_image_url),
       item_tags(tag_id,tags(id,name,type))`
    )
    .order("name");
  if (error) throw error;
  return (data ?? []) as Item[];
}

export async function fetchItemBySlug(slug: string) {
  const { data, error } = await supabase
    .from("items")
    .select(
      `id,slug,name,description,image_url,nara_url,brand_id,status,
       brands(id,slug,name_ko,name_en,description,cover_image_url,website_url),
       item_tags(tag_id,tags(id,name,type)),
       project_items(project_id,projects(id,slug,title,cover_image_url,year,status,area,location))`
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Item | null;
}

export async function fetchTags() {
  const { data, error } = await supabase.from("tags").select("id,name,type").order("name");
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



