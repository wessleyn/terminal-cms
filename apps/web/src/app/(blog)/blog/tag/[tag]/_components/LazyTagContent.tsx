'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
// Import the component directly from its full path
import { LegacyBlogPost } from '../../../_types/types';
import TagSkeleton from '../_components/TagSkeleton';

// Dynamically import the TagPageClient component with SSR disabled
const TagPageClient = dynamic(
    () => import('../_components/TagPageClient'), {
    loading: () => <TagSkeleton />,
    ssr: false // Only disable SSR here in a client component
});

interface LazyTagContentProps {
    posts: LegacyBlogPost[];
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