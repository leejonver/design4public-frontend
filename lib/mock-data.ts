export type Brand = {
  id: string;
  name: string;
  slug: string;
  intro: string;
  logo: string; // url or /public path
  cover: string;
  url: string;
};

export type Item = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  brandId: string;
  naraUrl: string; // 나라장터 URL
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  photos: string[];
  year: number;
  areaM2?: number;
  tags: string[];
  brandIds: string[];
  itemIds: string[];
};

export type Photo = {
  id: string;
  alt: string;
  url: string;
  tags: string[];
  projectId?: string;
  itemId?: string;
};

export const brands: Brand[] = [
  {
    id: "b1",
    name: "SageWorks",
    slug: "sageworks",
    intro: "차분한 컬러와 실용성을 갖춘 사무 가구 브랜드.",
    logo: "/logo.svg",
    cover:
      "https://images.unsplash.com/photo-1486955740388-944eb4b12caa?q=80&w=1400&auto=format&fit=crop",
    url: "https://example.com/sageworks",
  },
  {
    id: "b2",
    name: "UrbanForm",
    slug: "urbanform",
    intro: "공공공간에 최적화된 모듈형 가구.",
    logo: "/logo.svg",
    cover:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop",
    url: "https://example.com/urbanform",
  },
];

export const items: Item[] = [
  {
    id: "i1",
    name: "모듈 데스크 1200",
    slug: "module-desk-1200",
    description: "공공기관용 내구성 강화 모듈 데스크.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop",
    brandId: "b1",
    naraUrl: "https://shopping.g2b.go.kr/",
  },
  {
    id: "i2",
    name: "스택 체어",
    slug: "stack-chair",
    description: "회의실 및 교육장에 적합한 적층형 의자.",
    image:
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1400&auto=format&fit=crop",
    brandId: "b2",
    naraUrl: "https://shopping.g2b.go.kr/",
  },
  {
    id: "i3",
    name: "보관 캐비닛",
    slug: "storage-cabinet",
    description: "관공서 문서 보관을 위한 안전 캐비닛.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop",
    brandId: "b1",
    naraUrl: "https://shopping.g2b.go.kr/",
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    slug: "district-office-renovation",
    title: "구청 민원실 리노베이션",
    description:
      "민원 대기공간 개선과 업무 효율을 위한 가구 재배치 및 신규 납품.",
    cover:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop",
    ],
    year: 2023,
    areaM2: 280,
    tags: ["민원실", "리노베이션", "대기공간"],
    brandIds: ["b1", "b2"],
    itemIds: ["i1", "i2"],
  },
  {
    id: "p2",
    slug: "public-library-extension",
    title: "시립 도서관 증축",
    description: "열람석 확장 및 자료 보관 공간 최적화.",
    cover:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
    ],
    year: 2024,
    areaM2: 450,
    tags: ["도서관", "열람실", "보관"],
    brandIds: ["b1"],
    itemIds: ["i1", "i3"],
  },
];

export const photos: Photo[] = [
  {
    id: "ph1",
    alt: "민원실 데스크",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop",
    tags: ["데스크", "민원실"],
    projectId: "p1",
    itemId: "i1",
  },
  {
    id: "ph2",
    alt: "회의실 의자",
    url: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1400&auto=format&fit=crop",
    tags: ["의자", "회의실"],
    projectId: "p1",
    itemId: "i2",
  },
  {
    id: "ph3",
    alt: "도서관 캐비닛",
    url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop",
    tags: ["보관", "도서관"],
    projectId: "p2",
    itemId: "i3",
  },
];

export function findBrandById(id: string) {
  return brands.find((b) => b.id === id);
}

export function findItemBySlug(slug: string) {
  return items.find((i) => i.slug === slug);
}

export function findProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

