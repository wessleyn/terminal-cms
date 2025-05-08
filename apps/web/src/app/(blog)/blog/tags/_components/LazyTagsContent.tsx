'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
// Import the component directly from its full path
import TagsSkeleton from '/home/coding/Desktop/terminal-portfolio/apps/web/src/app/(blog)/blog/tags/_components/TagsSkeleton';

interface Tag {
    id: string;
    name: string;
    slug: string;
    color: string;
    postCount: number;
}

// Dynamically import the TagsPageClient component with SSR disabled
const TagsPageClient = dynamic(
    () => import('/home/coding/Desktop/terminal-portfolio/apps/web/src/app/(blog)/blog/tags/_components/TagsPageClient'), {
    loading: () => <TagsSkeleton />,
    ssr: false // Only disable SSR here in a client component
});

interface LazyTagsContentProps {
    tags: Tag[];
}

export default function LazyTagsContent({ tags }: LazyTagsContentProps) {
    const [isClient, setIsClient] = useState(false);

    // Ensure hydration doesn't cause mismatches
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <TagsSkeleton />;
    }

    return (
        <Suspense fallback={<TagsSkeleton />}>
            <TagsPageClient tags={tags} />
        </Suspense>
    );
}