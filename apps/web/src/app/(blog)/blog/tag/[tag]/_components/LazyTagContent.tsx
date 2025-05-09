'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
// Import the component directly from its full path
import TagSkeleton from '../_components/TagSkeleton';

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

// Dynamically import the TagPageClient component with SSR disabled
const TagPageClient = dynamic(
    () => import('/home/coding/Desktop/terminal-portfolio/apps/web/src/app/(blog)/blog/tag/[tag]/_components/TagPageClient'), {
    loading: () => <TagSkeleton />,
    ssr: false // Only disable SSR here in a client component
});

interface LazyTagContentProps {
    posts: Post[];
    tag: string;
    color: string;
    description: string;
    tagSlug: string;
    currentPage: number;
    totalPages: number;
    error?: boolean;
}

export default function LazyTagContent({
    posts,
    tag,
    color,
    description,
    tagSlug,
    currentPage,
    totalPages,
    error = false
}: LazyTagContentProps) {
    const [isClient, setIsClient] = useState(false);

    // Ensure hydration doesn't cause mismatches
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <TagSkeleton />;
    }

    return (
        <Suspense fallback={<TagSkeleton />}>
            <TagPageClient
                posts={posts}
                tag={tag}
                color={color}
                description={description}
                tagSlug={tagSlug}
                currentPage={currentPage}
                totalPages={totalPages}
                error={error}
            />
        </Suspense>
    );
}