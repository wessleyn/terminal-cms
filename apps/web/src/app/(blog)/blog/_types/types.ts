// Define reusable types for the entire blog application

export interface Author {
    name: string;
    avatarUrl: string | null;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Category {
    name: string;
    slug: string;
    color: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: Category;
    imageUrl: string;
    publishedAt: Date | null;
    author: Author | null;
    tags: Tag[];
}

// Legacy interface for backwards compatibility
export interface LegacyBlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    categorySlug: string;
    categoryColor: string;
    imageUrl: string;
    publishedAt: Date | null;
    author: Author;
    tags: Tag[];
}

export interface LazyDynamicSegProps {
    posts: LegacyBlogPost[];
    category: string;
    description: string;
    categorySlug: string;
    currentPage: number;
    totalPages: number;
    color?: string;
    error?: boolean;
}