export     interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    imageUrl: string;
    publishedAt: Date | null;
    author: {
        name: string;
        avatarUrl: string | null;
    } | null;
    tags: {
        id: string;
        name: string;
        color: string;
    }[];
}