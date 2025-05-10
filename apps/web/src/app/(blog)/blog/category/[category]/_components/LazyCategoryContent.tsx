'use client';

import { Text } from '@mantine/core'; // Import Text component from Mantine
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { LazyDynamicSegProps } from '../../../_types/types';
import CategorySkeleton from './CategorySkeleton';


// Define props for CategoryPageClient explicitly to match expected props
interface CategoryPageClientProps {
    posts: LazyDynamicSegProps['posts'];
    category: string;
    description: string;
    categorySlug: string;
    currentPage: number;
    totalPages: number;
    // Make sure this component also accepts color prop
    color?: string;
}

// Dynamically import the CategoryPageClient component with SSR disabled
const CategoryPageClient = dynamic<CategoryPageClientProps>(() => import('./CategoryPageClient'), {
    loading: () => <CategorySkeleton />,
    ssr: false
});

export default function LazyCategoryContent({
    posts,
    category,
    description,
    categorySlug,
    currentPage,
    totalPages,
    color = 'blue', // Default color if not provided
    error = false
}: LazyDynamicSegProps) {
    const [isClient, setIsClient] = useState(false);

    // Ensure hydration doesn't cause mismatches
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <CategorySkeleton />;
    }

    if (error) {
        return (
            <div className="container">
                <Text>Sorry, there was an error loading this category. Please try again later.</Text>
            </div>
        );
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
                color={color}
            />
        </Suspense>
    );
}