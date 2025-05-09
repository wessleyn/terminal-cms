'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import CategorySkeleton from './CategorySkeleton';

interface Author {
    name: string;
    avatarUrl: string | null;
}

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    imageUrl: string;
    publishedAt: Date | null;
    author: Author | null;
    tags: Tag[];
}

// Dynamically import the CategoryPageClient component with SSR disabled
const CategoryPageClient = dynamic(() => import('./CategoryPageClient'), {
    loading: () => <CategorySkeleton />,
    ssr: false // Only disable SSR here in a client component
});

interface LazyCategoryContentProps {
    posts: Post[];
    category: string;
    description: string;
    categorySlug: string;
    currentPage: number;
    totalPages: number;
    error?: boolean;
}

export default function LazyCategoryContent({
    posts,
    category,
    description,
    categorySlug,
    currentPage,
    totalPages,
    error = false
}: LazyCategoryContentProps) {
    const [isClient, setIsClient] = useState(false);

    // Ensure hydration doesn't cause mismatches
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <CategorySkeleton />;
    }

    return (
        <Suspense fallback={<CategorySkeleton />}>
            <CategoryPageClient
                posts={posts}
                category={category}
                description={description}
                categorySlug={categorySlug}
                currentPage={currentPage}
                totalPages={totalPages}
                error={error}
            />
        </Suspense>
    );
}